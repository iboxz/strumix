<?php
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];

$userUsername = htmlspecialchars($userUsername);
$userPassword = htmlspecialchars($userPassword);

$servernameAuthorisation = 'localhost';
$usernameAuthorisation = "strumixii_mod";
$passwordAuthorisation = "3.MWU!7!G^5v";
$dbnameAuthorisation = 'strumixii_Mod_data';

$connAuthorisation = new mysqli($servernameAuthorisation, $usernameAuthorisation, $passwordAuthorisation, $dbnameAuthorisation);
$connAuthorisation->set_charset("utf8mb4");
if ($connAuthorisation->connect_error) {
    die('Database connection failed');
}

// استفاده از Prepared Statements برای جلوگیری از SQL Injection
$sqlAuthorisation = "SELECT * FROM modEntry WHERE email = ? AND password = ?";
$stmtAuth = $connAuthorisation->prepare($sqlAuthorisation);
$stmtAuth->bind_param("ss", $userUsername, $userPassword);
$stmtAuth->execute();
$resultAuthorisation = $stmtAuth->get_result();

if ($resultAuthorisation->num_rows > 0) {

    $id = $_POST['id'];
    $table = $_POST['table'];

    $servername = "localhost";
    $username = "strumixii_mod";
    $password = "3.MWU!7!G^5v";
    $dbname = "strumixii_contactData";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $conn->set_charset("utf8mb4");
    $response = array();

    if ($table === 'job') {
        $fetchSql = "SELECT file_path FROM job WHERE id = ?";
    } elseif ($table === 'branch') {
        $fetchSql = "SELECT id FROM branch WHERE id = ?";
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Invalid table name specified'
        );
        echo json_encode($response);
        exit();
    }

    $fetchStmt = $conn->prepare($fetchSql);
    $fetchStmt->bind_param("s", $id);
    $fetchStmt->execute();
    $fetchResult = $fetchStmt->get_result();

    if ($fetchResult->num_rows > 0) {
        $row = $fetchResult->fetch_assoc();
        $file_path = $row['file_path'];

        // حذف فایل از سرور
        if ($file_path && file_exists("../serverAssets/applicationFiles/" . $file_path)) {
            if (!unlink("../serverAssets/applicationFiles/" . $file_path)) {
                $response['status'] = 'error';
                $response['message'] = 'خطا در حذف فایل از سرور.';
                echo json_encode($response);
                exit();
            }
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'رکورد مورد نظر یافت نشد.';
        echo json_encode($response);
        exit();
    }
    $fetchStmt->close();

    // حالا رکورد را از دیتابیس حذف می‌کنیم
    if ($table === 'job') {
        $sql = "DELETE FROM job WHERE id=?";
    } elseif ($table === 'branch') {
        $sql = "DELETE FROM branch WHERE id=?";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        $response['status'] = 'success';
    } else {
        $response['status'] = 'error';
        $response['message'] = $stmt->error;
    }

    $stmt->close();
    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$stmtAuth->close();
$connAuthorisation->close();

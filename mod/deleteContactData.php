<?php

$postUsername = $_POST['username'];
$postPassword = $_POST['password'];
$id = $_POST['id'];
$table = $_POST['table']; // این فیلد به عنوان نام جدول برای حذف استفاده می‌شود

$servername = "localhost";
$username = $postUsername;
$password = $postPassword;
$dbname = "strumixii_contactData";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// بر اساس نام جدول انتخاب شده، استفاده از دستور حذف مربوطه
if ($table === 'job') {
    $sql = "DELETE FROM job WHERE id=?";
} elseif ($table === 'branch') {
    $sql = "DELETE FROM branch WHERE id=?";
} else {
    $response = array(
        'status' => 'error',
        'message' => 'Invalid table name specified'
    );
    echo json_encode($response);
    exit();
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

$response = array();
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
?>

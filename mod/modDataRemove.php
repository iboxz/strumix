<?php
$servername = 'localhost';
$username = "strumixii_mod";
$password = "3.MWU!7!G^5v";
$dbname = 'strumixii_Mod_data';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

$userEmail = $_POST['username'];
$userPassword = $_POST['password'];
$emailToDelete = $_POST['usernameInput'];

$userEmail = $conn->real_escape_string($userEmail);
$userPassword = $conn->real_escape_string($userPassword);
$emailToDelete = $conn->real_escape_string($emailToDelete);

$stmt = $conn->prepare("SELECT * FROM modEntry WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $userEmail, $userPassword);
$stmt->execute();
$resultAuthorisation = $stmt->get_result();

if ($resultAuthorisation->num_rows > 0) {
    $stmt = $conn->prepare("DELETE FROM modEntry WHERE email = ?");
    $stmt->bind_param("s", $emailToDelete);

    if ($stmt->execute()) {
        echo "اطلاعات با موفقیت حذف شد.";
    } else {
        echo "خطا در حذف اطلاعات: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$conn->close();

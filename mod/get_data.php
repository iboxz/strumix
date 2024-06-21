<?php
// اتصال به دیتابیس MySQL
$servername = "localhost"; 
$username = "strumixii_mod_hadinezhad"; 
$password = "iliya6116";
$dbname = "strumixii_contactData";
$conn = new mysqli($servername, $username, $password, $dbname);

// بررسی اتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
// پرس و جو برای دریافت داده‌ها از جدول strumixii_contactData
$sql = "SELECT * FROM job";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} 

$conn->close();

// ارسال داده‌ها به صورت JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
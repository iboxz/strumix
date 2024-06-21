<?php
$servername = "localhost"; 
$username = "strumixii_public"; 
$password = "8m1;68kO4A]IBgk/#79z";
$dbname = "strumixii_contactData";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

$name = $_POST['name'];
$ownername = $_POST['ownername'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$workers = $_POST['workers'];
$address = $_POST['address'];
$fields = $_POST['fields'];
$message = $_POST['message'];
$id = $_POST['id'];

$sql = "INSERT INTO branch (id, name, ownername, phone, email, workers, address, fields, message) 
        VALUES ('$id', '$name', '$ownername', '$phone', '$email', '$workers', '$address', '$fields', '$message')";

if ($conn->query($sql) === TRUE) {
    echo "اطلاعات با موفقیت ذخیره شد.";
} else {
    echo "خطا در ذخیره اطلاعات: " . $conn->error;
}

$conn->close();
?>

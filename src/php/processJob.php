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

$id = $_POST['id'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$message = $_POST['message'];

$sql = "INSERT INTO job (id, name, email, phone, address, message) 
        VALUES ('$id', '$name', '$email', '$phone', '$address', '$message')";

if ($conn->query($sql) === TRUE) {
    echo "اطلاعات با موفقیت ذخیره شد.";
} else {
    echo "خطا در ذخیره اطلاعات: " . $conn->error;
}

$conn->close();
?>

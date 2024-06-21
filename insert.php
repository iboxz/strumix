<?php
// اطلاعات اتصال به دیتابیس
$servername = "localhost"; // نام هاست دیگری
$username = "strumixii_iliyahadinezhad"; // نام کاربری دیتابیس
$password = "iliya6116"; // رمز عبور دیتابیس
$dbname = "strumixii_contactData"; // نام دیتابیس

// اتصال به دیتابیس
$conn = new mysqli($servername, $username, $password, $dbname);

// بررسی اتصال
if ($conn->connect_error) {
    die("اتصال با مشکل مواجه شد: " . $conn->connect_error);
}

// دریافت داده‌ها از فرم
$name = $_POST['name'];
$email = $_POST['email'];

// ذخیره داده‌ها در دیتابیس
$sql = "INSERT INTO branch (name, email) VALUES ('$name', '$email')";

if ($conn->query($sql) === TRUE) {
    echo "اطلاعات با موفقیت ذخیره شد.";
} else {
    echo "خطا در ذخیره اطلاعات: " . $conn->error;
}

// بستن اتصال
$conn->close();
?>

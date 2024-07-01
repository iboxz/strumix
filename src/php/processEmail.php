<?php
$servername = "localhost";
$username = "strumixii_public";
$password = "8m1;68kO4A]IBgk/#79z";
$dbname = "strumixii_usersEmail";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

if (isset($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $email = $_POST['email'];
    $stmt = $conn->prepare("INSERT INTO userEmail (email) VALUES (?)");
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        echo "اطلاعات با موفقیت ذخیره شد.";
    } else {
        echo "خطا در ذخیره اطلاعات: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "ایمیل وارد شده معتبر نیست.";
}

$conn->close();
?>

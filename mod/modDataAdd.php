<?php
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];

$userUsername = htmlspecialchars($userUsername);
$userPassword = htmlspecialchars($userPassword);

$servername = 'localhost';
$username = "strumixii_mod";
$password = "3.MWU!7!G^5v";
$dbname = 'strumixii_Mod_data';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");


$sql = "SELECT * FROM modEntry WHERE email = '$userUsername' AND password = '$userPassword'";
$resultAuthorisation = $conn->query($sql);

if ($resultAuthorisation->num_rows > 0) {
    if (isset($_POST['usernameInput'])  && isset($_POST['passwordInput'])) {
        $email = $_POST['usernameInput'];
        $password = $_POST['passwordInput'];

        $stmt = $conn->prepare("INSERT INTO modEntry (email, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $email, $password);

        if ($stmt->execute()) {
            echo "اطلاعات با موفقیت ذخیره شد.";
        } else {
            echo "خطا در ذخیره اطلاعات: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "اطلاعات وارد شده معتبر نیست.";
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$conn->close();

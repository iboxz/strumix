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
    die('Database connection failed: ' . $connAuthorisation->connect_error);
}

$sqlAuthorisation = "SELECT * FROM modEntry WHERE email = '$userUsername' AND password = '$userPassword'";
$resultAuthorisation = $connAuthorisation->query($sqlAuthorisation);

if ($resultAuthorisation->num_rows > 0) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['file']) && isset($_POST['title'])) {
            $title = $_POST['title'];
            $file = $_FILES['file'];

            $uploadDirectory = '../serverAssets/productCatalogue/';

            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            if (strtolower($fileExtension) !== 'pdf') {
                echo 'Invalid file type. Only PDF is allowed.';
                exit;
            }
            $uploadPath = $uploadDirectory . $title . '.' . $fileExtension;

            if ($file['error'] !== UPLOAD_ERR_OK) {
                echo 'File upload error. Error code: ' . $file['error'];
                exit;
            }

            if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
                echo 'PDF uploaded successfully!';
            } else {
                echo 'PDF upload failed. Could not move the file.';
            }
        } else {
            echo 'Invalid input. Title or PDF file missing.';
        }
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();
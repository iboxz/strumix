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
        if (isset($_FILES['image']) && isset($_POST['title'])) {
            $title = $_POST['title'];
            $image = $_FILES['image'];
            $title = preg_replace('/[^\p{L}\p{N}\-_]/u', '_', $title);

            $uploadDirectory = '../serverUploadAssets/blogsCoverImg/';

            $fileExtension = pathinfo($image['name'], PATHINFO_EXTENSION);
            if (!in_array(strtolower($fileExtension), ['jpg', 'jpeg', 'png'])) {
                echo 'Invalid file type. Only JPG and PNG are allowed.';
                exit;
            }
            $fileExtension = "jpg";
            $uploadPath = $uploadDirectory . $title . '.' . $fileExtension;

            if ($image['error'] !== UPLOAD_ERR_OK) {
                echo 'File upload error. Error code: ' . $image['error'];
                exit;
            }

            if (move_uploaded_file($image['tmp_name'], $uploadPath)) {
                echo 'Image uploaded successfully!';
            } else {
                echo 'Image upload failed. Could not move the file.';
            }
        } else {
            echo 'Invalid input. Title or image missing.';
        }
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

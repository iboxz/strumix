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
    die('Database connection failed');
}

$sqlAuthorisation = "SELECT * FROM modEntry WHERE email = '$userUsername' AND password = '$userPassword'";
$resultAuthorisation = $connAuthorisation->query($sqlAuthorisation);

if ($resultAuthorisation->num_rows > 0) {
    $directories = [
        '../serverAssets/blogs/',
        '../serverAssets/blogsCoverImg/',
        '../assets/productImg/'
    ];

    $imageURLs = array();

    foreach ($directories as $directory) {
        $images = glob($directory . "*.{jpg,png,gif,jpeg}", GLOB_BRACE);
        foreach ($images as $image) {
            $imageURLs[] = $image;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($imageURLs);
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

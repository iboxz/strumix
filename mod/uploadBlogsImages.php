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
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
        $targetDir = "../serverAssets/blogs/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $originalFileName = basename($_FILES["image"]["name"]);
        $fileName = time() . '_' . $originalFileName;
        $targetFilePath = $targetDir . $fileName;
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

        $allowTypes = array('jpg', 'png', 'jpeg', 'gif');
        if (in_array($fileType, $allowTypes)) {
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
                echo json_encode([
                    "imageUrl" => $targetFilePath
                ]);
            } else {
                echo json_encode([
                    "error" => "Sorry, there was an error uploading your file."
                ]);
            }
        } else {
            echo json_encode([
                "error" => "Sorry, only JPG, JPEG, PNG, & GIF files are allowed."
            ]);
        }
    } else {
        echo json_encode([
            "error" => "No file uploaded or invalid request."
        ]);
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

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
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $uploadDir = '../serverAssets/technicalDocuments/';
        $fileTitle = $_POST['title'];
        $sanitizedFileName = $_POST['sanitizedFileName'];
        $file = $_FILES['file'];

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $filePath = $uploadDir . basename($sanitizedFileName);
        $fileUrl = 'https://strumix.com/serverAssets/technicalDocuments/' . basename($sanitizedFileName);

        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $jsonData = file_get_contents('../serverAssets/technicalDoc.json');
            $articlesData = json_decode($jsonData, true);

            $category = "مدارک فنی جدید";

            if (!isset($articlesData[$category])) {
                $articlesData[$category] = [];
            }

            $articlesData[$category][] = ['text' => $fileTitle, 'url' => $fileUrl];

            file_put_contents('../serverAssets/technicalDoc.json', json_encode($articlesData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

            echo json_encode(['status' => 'success', 'message' => 'فایل با موفقیت آپلود شد']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'خطا در آپلود فایل']);
        }
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

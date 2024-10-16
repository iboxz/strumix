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

    try {
        $data = file_get_contents("php://input");
        $requestData = json_decode($data, true);
        $order = $requestData['order'];

        $jsonData = file_get_contents('../serverAssets/technicalDoc.json');
        $articlesData = json_decode($jsonData, true);

        $updatedData = [];
        foreach ($order as $category => $items) {
            $updatedData[$category] = [];
            foreach ($items as $item) {
                $originalCategory = $item['originalCategory'];
                $index = $item['index'];
                $article = $articlesData[$originalCategory][$index];
                $article['text'] = $item['text'];
                $updatedData[$category][] = $article;
            }
        }

        // حذف کتگوری "مدارک فنی جدید" اگر خالی است
        $categoryToRemove = "مدارک فنی جدید";
        if (isset($updatedData[$categoryToRemove]) && empty($updatedData[$categoryToRemove])) {
            unset($updatedData[$categoryToRemove]);
        }

        file_put_contents('../serverAssets/technicalDoc.json', json_encode($updatedData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        echo json_encode(['status' => 'success', 'message' => 'تغییرات با موفقیت ذخیره شد']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

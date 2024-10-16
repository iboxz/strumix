<?php
header('Content-Type: application/json; charset=UTF-8');

$data = json_decode(file_get_contents('php://input'), true);
$username = filter_var($data['username'], FILTER_SANITIZE_STRING);
$password = filter_var($data['password'], FILTER_SANITIZE_STRING);

$servername = 'localhost';
$usernameDB = "strumixii_mod";
$passwordDB = "3.MWU!7!G^5v";
$dbname = 'strumixii_Mod_data';

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

if ($conn->connect_error) {
    die(json_encode(array('success' => false, 'error' => 'Database connection failed')));
}

$sql = "SELECT * FROM modEntry WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Create a new array for order data
    $orderData = $data['order'];

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    try {
        $jsonData = file_get_contents('../serverAssets/technicalDoc.json');
        $articlesData = json_decode($jsonData, true);

        $updatedData = [];
        foreach ($orderData as $category => $items) {
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
    echo json_encode(array('success' => false, 'error' => 'Invalid login credentials'), JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();

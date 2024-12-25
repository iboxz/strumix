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

    $inputData = json_decode(file_get_contents("php://input"), true);

    // بررسی معتبر بودن داده
    if (!$inputData || !isset($inputData['newOrder']) || !is_array($inputData['newOrder'])) {
        echo json_encode([
            'status'  => 'error',
            'message' => 'No valid data provided.'
        ]);
        exit;
    }

    $newOrder = $inputData['newOrder'];

    // مسیر فایل JSON نهایی
    $jsonFilePath = '../serverAssets/products.json';

    // تبدیل آرایه دریافت‌شده به JSON با کدنویسی یونی‌کُد و فرمت مرتب
    $newJsonContent = json_encode($newOrder, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    // تلاش برای نوشتن در فایل
    if (file_put_contents($jsonFilePath, $newJsonContent) === false) {
        echo json_encode([
            'status'  => 'error',
            'message' => 'خطا در نوشتن فایل JSON.'
        ]);
        exit;
    }

    // در صورت عدم رخ دادن خطا
    echo json_encode([
        'status'  => 'success',
        'message' => 'ترتیب محصولات با موفقیت بروزرسانی شد.'
    ]);
} else {
    echo json_encode(array('success' => false, 'error' => 'Invalid login credentials'), JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
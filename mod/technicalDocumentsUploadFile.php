<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = '../serverAssets/technicalDocuments/'; // مسیر پوشه ذخیره‌سازی فایل‌ها
    $fileTitle = $_POST['title'];
    $file = $_FILES['file'];

    // بررسی و ایجاد پوشه اگر وجود ندارد
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDir . basename($file['name']);
    $fileUrl = 'https://strumix.com/serverAssets/uploads/' . basename($file['name']);

    // آپلود فایل
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        // خواندن فایل JSON موجود
        $jsonData = file_get_contents('../serverAssets/technicalDoc.json');
        $articlesData = json_decode($jsonData, true);

        // اضافه کردن فایل جدید به دسته‌بندی "مدارک فنی جدید"
        $category = "مدارک فنی جدید";
        $newCategoryData = [$category => [['text' => $fileTitle, 'url' => $fileUrl]]];

        // اضافه کردن کتگوری جدید به ابتدای آرایه
        $articlesData = array_merge($newCategoryData, $articlesData);

        // ذخیره داده‌های به‌روز شده در فایل JSON
        file_put_contents('../serverAssets/technicalDoc.json', json_encode($articlesData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        echo json_encode(['status' => 'success', 'message' => 'فایل با موفقیت آپلود شد']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'خطا در آپلود فایل']);
    }
}

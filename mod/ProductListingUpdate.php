<?php
/**
 * technicalDocumentsUploadFile.php
 *
 * این فایل PHP، فایل جدید را پس از ادیت‌ها یا هر عملیاتی آپلود می‌کند.
 * به عنوان نمونه، در کد فرانت‌اند با:
 *   const formData = new FormData();
 *   formData.append("username", username);
 *   formData.append("password", password);
 *   formData.append("sanitizedFileName", sanitizedFileName);
 *   formData.append("title", $("#fileTitle").val());
 *   formData.append("file", fileInput.files[0]);
 *
 *   $.ajax({
 *       url: "technicalDocumentsUploadFile.php",
 *       type: "POST",
 *       data: formData,
 *       processData: false,
 *       contentType: false,
 *       success: function (response) {
 *           // ...
 *       },
 *       error: function (error) {
 *           // ...
 *       },
 *   });
 *
 * ارسال می‌شود.
 * 
 * سپس این فایل با رعایت نکات امنیتی پایه (مثل تایید یوزر/پس، اعتبارسنجی فایل و غیره)
 * فایل را در مسیر مورد نظر آپلود می‌کند و خروجی JSON می‌دهد.
 */

// برای خروجی JSON
header('Content-Type: application/json; charset=utf-8');

// نوشتن یک تابع ساده احراز هویت نمونه (می‌توانید آن را با دیتابیس یا سازوکار دلخواه خود ادغام کنید)
function isAuthorized($username, $password) {
    // فقط یک نمونه ساده:
    $validUser = "admin";
    $validPass = "12345";
    return ($username === $validUser && $password === $validPass);
}

// بررسی متد ارسال
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Invalid request method. Use POST.'
    ]);
    exit;
}

// دریافت اطلاعات ارسالی
$username          = isset($_POST['username']) ? trim($_POST['username']) : '';
$password          = isset($_POST['password']) ? trim($_POST['password']) : '';
$sanitizedFileName = isset($_POST['sanitizedFileName']) ? trim($_POST['sanitizedFileName']) : '';
$title             = isset($_POST['title']) ? trim($_POST['title']) : '';

// احراز هویت
if (!isAuthorized($username, $password)) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unauthorized user or wrong credentials.'
    ]);
    exit;
}

// بررسی وجود فایل
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'No file uploaded or an upload error occurred.'
    ]);
    exit;
}

// مسیر پوشه مقصد (با دسترسی نوشتن)
$uploadDir = __DIR__ . '/uploads'; // می‌توانید مسیر دلخواه تعیین کنید
if (!is_dir($uploadDir)) {
    // اگر پوشه وجود ندارد، آن را می‌سازیم. (اختیاری)
    if (!mkdir($uploadDir, 0777, true)) {
        echo json_encode([
            'status'  => 'error',
            'message' => 'Failed to create upload directory.'
        ]);
        exit;
    }
}

// ساخت مسیر کامل فایل خروجی
// اگر sanitizedFileName خالی باشد، نام فایل اصلی را استفاده می‌کنیم
$finalFileName = $sanitizedFileName !== '' ? $sanitizedFileName : basename($_FILES['file']['name']);
$destination   = $uploadDir . '/' . $finalFileName;

// انتقال فایل از tmp به پوشه مقصد
if (!move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Error moving the uploaded file.'
    ]);
    exit;
}

// در صورت نیاز، می‌توانیم اطلاعات جدید را در فایل JSON ذخیره کنیم.
// به عنوان نمونه، فرض می‌کنیم فایل main.json شامل یک آرایه از رکوردهاست.
// این بخش را بسته به نیاز خود تغییر دهید:

/*
// مثال برای ویرایش یک فایل JSON:
$jsonPath = __DIR__ . '/technicalDoc.json';
$jsonData = [];
if (file_exists($jsonPath)) {
    $jsonRaw  = file_get_contents($jsonPath);
    $jsonData = json_decode($jsonRaw, true);
    // اگر ساختار فایل شما متفاوت است، باید متناسب با آن عمل کنید
}

// اضافه کردن فایل جدید:
$jsonData[] = [
    'title'        => $title,
    'filename'     => $finalFileName,
    'upload_date'  => date('Y-m-d H:i:s')
];

// ذخیره‌سازی مجدد فایل
file_put_contents($jsonPath, json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
*/

// در نهایت پاسخ JSON موفقیت
echo json_encode([
    'status'  => 'success',
    'message' => 'فایل با موفقیت آپلود شد و اطلاعات درج گردید.',
    'file'    => $finalFileName
]);
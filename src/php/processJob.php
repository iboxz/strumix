<?php
$servername = "localhost";
$username = "strumixii_public";
$password = "8m1;68kO4A]IBgk/#79z";
$dbname = "strumixii_contactData";


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("اتصال ناموفق به دیتابیس: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';
$message = $_POST['message'] ?? '';

$file_path = "";

if (isset($_FILES['uploadFile']) && $_FILES['uploadFile']['error'] == 0) {
  $target_dir = "../../serverAssets/applicationFiles/";

  $file_tmp_name = $_FILES['uploadFile']['tmp_name'];
  $file_name = $_FILES['uploadFile']['name'];
  $file_size = $_FILES['uploadFile']['size'];

  $allowed = array('pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png');

  $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

  if (in_array($file_ext, $allowed)) {
    if ($file_size <= 10 * 1024 * 1024) {
      $file_new_name = $id . "." . $file_ext;
      $file_destination = $target_dir . $file_new_name;

      if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
          die("خطا در ایجاد پوشه مقصد.");
        }
      }

      if (file_exists($file_destination)) {
        unlink($file_destination); 
      }

      if (move_uploaded_file($file_tmp_name, $file_destination)) {
        $file_path = $file_new_name; 
      } else {
        die("خطا در آپلود فایل.");
      }
    } else {
      die("حجم فایل بیشتر از حد مجاز است.");
    }
  } else {
    die("پسوند فایل مجاز نیست.");
  }
} else {
  die("فایلی آپلود نشده است.");
}

$sql = "INSERT INTO job (id, name, email, phone, address, message, file_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if ($stmt) {
  $stmt->bind_param("sssssss", $id, $name, $email, $phone, $address, $message, $file_path);
  if ($stmt->execute()) {
    echo "اطلاعات با موفقیت ذخیره شد.";
  } else {
    die("خطا در ذخیره اطلاعات: " . $stmt->error);
  }
  $stmt->close();
} else {
  die("خطا در آماده‌سازی کوئری: " . $conn->error);
}

$conn->close();
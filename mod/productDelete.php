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
    // کاربر مجاز است
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $url = htmlspecialchars($_POST['url']);

        // حذف محصول از فایل products.json
        $jsonFile = '../serverAssets/products.json';
        $jsonString = file_get_contents($jsonFile);
        $data = json_decode($jsonString, true);

        $productFound = false;
        foreach ($data['categories'] as &$category) {
            foreach ($category['products'] as $key => $product) {
                if ($product['url'] == $url) {
                    // حذف محصول از آرایه
                    unset($category['products'][$key]);
                    $productFound = true;
                    break 2; // خروج از هر دو حلقه
                }
            }
        }

        if (!$productFound) {
            echo 'محصول مورد نظر یافت نشد.';
            exit;
        }

        // ذخیره داده‌های به‌روز شده در فایل JSON
        $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        if (!file_put_contents($jsonFile, $newJsonString)) {
            echo 'خطا در به‌روزرسانی فایل JSON.';
            exit;
        }

        // حذف فایل HTML محصول
        $productHtmlFile = "../products/" . $url . ".html";
        if (file_exists($productHtmlFile)) {
            if (!unlink($productHtmlFile)) {
                echo 'خطا در حذف فایل HTML محصول.';
                exit;
            }
        }

        // حذف تصویر محصول
        $imageExtensions = ['jpg', 'jpeg', 'png'];
        $imageDeleted = false;
        foreach ($imageExtensions as $ext) {
            $imageFile = "../assets/productImg/" . $url . "." . $ext;
            if (file_exists($imageFile)) {
                if (!unlink($imageFile)) {
                    echo 'خطا در حذف تصویر محصول.';
                    exit;
                } else {
                    $imageDeleted = true;
                    break;
                }
            }
        }

        if (!$imageDeleted) {
            echo 'تصویر محصول یافت نشد یا قبلاً حذف شده است.';
        }

        // حذف فایل PDF محصول
        $pdfFile = "../serverAssets/productCatalogue/" . $url . ".pdf";
        if (file_exists($pdfFile)) {
            if (!unlink($pdfFile)) {
                echo 'خطا در حذف کاتالوگ محصول.';
                exit;
            }
        } else {
            echo 'کاتالوگ محصول یافت نشد یا قبلاً حذف شده است.';
        }

        echo 'محصول با موفقیت حذف شد.';
    } else {
        echo 'درخواست نامعتبر.';
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}
$connAuthorisation->close();
?>
<?php
// بررسی روش درخواست
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // دریافت پارامترهای POST
    $url = htmlspecialchars($_POST['url']);
    $labels = $_POST['labels'];
    $labelYellow = $_POST['labelYellow'];
    $labelRed = $_POST['labelRed'];
    $dataYellow = $_POST['dataYellow'];
    $dataRed = $_POST['dataRed'];
    $titleText = $_POST['titleText'];
    $body = $_POST['body'];

    // مسیر فایل HTML محصول
    $new_file = '../products/' . $url . '.html';

    // به‌روزرسانی فایل HTML محصول
    if (file_exists($new_file)) {
        $content = file_get_contents($new_file);
        $updated_content = preg_replace('/<main id="smooth-wrapper">.*<\/main>/s', '<main id="smooth-wrapper">' . $body . '</main>', $content);

        $new_script = ' <script> var labels = [' . $labels . ']; var labelYellow = "' . $labelYellow . '"; var labelRed = "' . $labelRed . '"; var dataYellow = [' . $dataYellow . ']; var dataRed = [' . $dataRed . ']; var titleText = "' . $titleText . '"; </script>';

        if (preg_match('/<script>.*?<\/script>/s', $updated_content)) {
            $updated_content = preg_replace('/<script>.*?<\/script>/s', $new_script, $updated_content);
        } else {
            $updated_content = str_replace('</body>', $new_script . '</body>', $updated_content);
        }

        if (!file_put_contents($new_file, $updated_content)) {
            echo 'خطا در به‌روزرسانی صفحه HTML.';
            exit;
        }
    } else {
        echo 'فایل HTML محصول وجود ندارد.';
        exit;
    }

    // آپلود فایل PDF (در صورت وجود)
    if (isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] == UPLOAD_ERR_OK) {
        $pdfFile = $_FILES['pdfFile'];

        $uploadDirectory = '../serverAssets/productCatalogue/';

        $fileExtension = pathinfo($pdfFile['name'], PATHINFO_EXTENSION);
        if (strtolower($fileExtension) !== 'pdf') {
            echo 'فرمت فایل PDF معتبر نیست.';
            exit;
        }

        $uploadPath = $uploadDirectory . $url . '.' . $fileExtension;

        if (!move_uploaded_file($pdfFile['tmp_name'], $uploadPath)) {
            echo 'خطا در جابجایی فایل PDF.';
            exit;
        }
    }

    // آپلود فایل تصویر و به‌روزرسانی فایل JSON (در صورت وجود)
    if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] == UPLOAD_ERR_OK) {
        // پوشه مقصد برای ذخیره تصویر
        $imageUploadFolder = '../assets/productImg/';

        $imageFile = $_FILES['imageFile'];
        $imageTmpPath = $imageFile['tmp_name'];
        $imageName = $imageFile['name'];

        // خواندن فایل products.json
        $jsonFile = '../products/products.json';
        $jsonString = file_get_contents($jsonFile);
        $data = json_decode($jsonString, true);

        // جستجوی محصول با استفاده از 'url'
        $productFound = false;

        foreach ($data['categories'] as &$category) {
            foreach ($category['products'] as &$product) {
                if ($product['url'] == $url) {
                    // محصول یافت شد
                    $productFound = true;
                    break 2;
                }
            }
        }

        if (!$productFound) {
            echo "محصول در فایل JSON یافت نشد.";
            exit;
        }

        // نام جدید برای فایل تصویر بر اساس 'url'
        $newFileName = $url . '.jpg';
        $destPath = $imageUploadFolder . $newFileName;

        // تبدیل تصویر به فرمت JPG در صورت نیاز
        $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));

        if ($imageExtension == 'jpg' || $imageExtension == 'jpeg') {
            // انتقال فایل
            if (!move_uploaded_file($imageTmpPath, $destPath)) {
                echo "خطا در جابجایی فایل تصویر.";
                exit;
            }
        } elseif ($imageExtension == 'png') {
            // تبدیل PNG به JPG
            $pngImage = imagecreatefrompng($imageTmpPath);
            if ($pngImage) {
                if (!imagejpeg($pngImage, $destPath, 100)) {
                    echo "خطا در ذخیره تصویر JPG.";
                    exit;
                }
                imagedestroy($pngImage);
            } else {
                echo "خطا در تبدیل تصویر PNG به JPG.";
                exit;
            }
        } else {
            echo "فرمت تصویر پشتیبانی نمی‌شود.";
            exit;
        }

        // به‌روزرسانی فیلد 'image' در فایل JSON به 'url' به همراه '.jpg'
        $product['image'] = $url . '.jpg';

        // ذخیره مجدد فایل JSON
        $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        if (!file_put_contents($jsonFile, $newJsonString)) {
            echo "خطا در به‌روزرسانی فایل JSON.";
            exit;
        }
    }

    echo "صفحه و فایل‌ها با موفقیت به‌روزرسانی شدند.";
} else {
    echo 'درخواست نامعتبر.';
}

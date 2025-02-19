<?php
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];

$servernameAuthorisation = 'localhost';
$usernameAuthorisation = "strumixii_mod";
$passwordAuthorisation = "3.MWU!7!G^5v";
$dbnameAuthorisation = 'strumixii_Mod_data';

$connAuthorisation = new mysqli($servernameAuthorisation, $usernameAuthorisation, $passwordAuthorisation, $dbnameAuthorisation);
$connAuthorisation->set_charset("utf8mb4");
if ($connAuthorisation->connect_error) {
    error_log('Database connection failed: ' . $connAuthorisation->connect_error);
    die('خطا در اتصال به پایگاه داده.');
}

$stmt = $connAuthorisation->prepare("SELECT * FROM modEntry WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $userUsername, $userPassword);
$stmt->execute();
$resultAuthorisation = $stmt->get_result();

if ($resultAuthorisation->num_rows > 0) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // دریافت پارامترهای POST
        $url = $_POST['url'];
        // اعتبارسنجی $url
        if (!preg_match('/^[a-zA-Z0-9_\-]+$/', $url)) {
            echo 'آدرس URL نامعتبر است.';
            exit;
        }

        // دریافت فیلدهای جدید
        $titleFa = trim($_POST['titleFa'] ?? '');
        $titleEn = trim($_POST['titleEn'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $labels = $_POST['labels'] ?? '';
        $labelYellow = $_POST['labelYellow'] ?? '';
        $labelRed = $_POST['labelRed'] ?? '';
        $dataYellow = $_POST['dataYellow'] ?? '';
        $dataRed = $_POST['dataRed'] ?? '';
        $titleText = $_POST['titleText'] ?? '';
        $body = $_POST['body'] ?? '';

        // مسیر فایل HTML محصول
        $product_dir = realpath('../products/') . DIRECTORY_SEPARATOR;
        $new_file = $product_dir . basename($url) . '.html';
        if (strpos($new_file, $product_dir) !== 0) {
            echo 'مسیر فایل نامعتبر است.';
            exit;
        }

        // به‌روزرسانی فایل HTML محصول
        if (file_exists($new_file)) {
            $content = file_get_contents($new_file);
            $updated_content = preg_replace('/<main id="smooth-wrapper">.*?<\/main>/s', '<main id="smooth-wrapper">' . $body . '</main>', $content);
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
            $uploadDirectory = realpath('../serverAssets/productCatalogue/') . DIRECTORY_SEPARATOR;
            // بررسی نوع MIME فایل
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($pdfFile['tmp_name']);
            if ($mimeType !== 'application/pdf') {
                echo 'فرمت فایل PDF معتبر نیست.';
                exit;
            }
            $uploadPath = $uploadDirectory . basename($url) . '.pdf';
            if (!move_uploaded_file($pdfFile['tmp_name'], $uploadPath)) {
                echo 'خطا در جابجایی فایل PDF.';
                exit;
            }
        } else {
            // کاربر فایل PDF را آپلود نکرده است. مشکلی نیست.
        }

        // آپلود فایل تصویر و به‌روزرسانی فایل JSON (در صورت وجود)
        if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] == UPLOAD_ERR_OK) {
            // پوشه مقصد برای ذخیره تصویر
            $imageUploadFolder = realpath('../assets/productImg/') . DIRECTORY_SEPARATOR;
            $imageFile = $_FILES['imageFile'];
            $imageTmpPath = $imageFile['tmp_name'];
            $imageName = $imageFile['name'];
            // اعتبارسنجی تصویر
            $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png'];
            if (!in_array($imageExtension, $allowedExtensions)) {
                echo 'فرمت تصویر پشتیبانی نمی‌شود.';
                exit;
            }
            // بررسی نوع MIME
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($imageTmpPath);
            $allowedMimeTypes = ['image/jpeg', 'image/png'];
            if (!in_array($mimeType, $allowedMimeTypes)) {
                echo 'فرمت تصویر پشتیبانی نمی‌شود.';
                exit;
            }
            $destPath = $imageUploadFolder . basename($url) . '.jpg';
            if ($mimeType == 'image/jpeg') {
                // انتقال فایل JPEG
                if (!move_uploaded_file($imageTmpPath, $destPath)) {
                    echo 'خطا در جابجایی فایل تصویر.';
                    exit;
                }
            } elseif ($mimeType == 'image/png') {
                // تبدیل PNG به JPEG
                $pngImage = imagecreatefrompng($imageTmpPath);
                if ($pngImage) {
                    if (!imagejpeg($pngImage, $destPath, 100)) {
                        echo 'خطا در ذخیره تصویر JPG.';
                        exit;
                    }
                    imagedestroy($pngImage);
                } else {
                    echo 'خطا در تبدیل تصویر PNG به JPG.';
                    exit;
                }
            }

            // به‌روزرسانی فیلد 'image' در فایل JSON به 'url' به همراه '.jpg'
            // خواندن فایل products.json
            $jsonFile = realpath('../serverAssets/products.json');
            if (!$jsonFile) {
                echo 'فایل JSON محصولات یافت نشد.';
                exit;
            }
            $jsonString = file_get_contents($jsonFile);
            $data = json_decode($jsonString, true);
            if ($data === null) {
                echo 'خطا در تجزیه فایل JSON.';
                exit;
            }

            // جستجوی محصول با استفاده از 'url'
            $productFound = false;
            foreach ($data['categories'] as &$category) {
                foreach ($category['products'] as &$product) {
                    if ($product['url'] == $url) {
                        // محصول یافت شد
                        $product['image'] = $url . '.jpg';
                        $productFound = true;
                        break 2;
                    }
                }
            }

            if (!$productFound) {
                echo 'محصول در فایل JSON یافت نشد.';
                exit;
            }

            // ذخیره مجدد فایل JSON
            $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            if (!file_put_contents($jsonFile, $newJsonString)) {
                echo 'خطا در به‌روزرسانی فایل JSON.';
                exit;
            }
        } else {
            // کاربر فایلی را آپلود نکرده است، مشکلی نیست.
            // فایل JSON را به‌روز نمی‌کنیم.
        }

        // == به‌روزرسانی فایل JSON با عنوان و توضیحات جدید ==
        $jsonFile = realpath('../serverAssets/products.json');
        if (!$jsonFile) {
            echo 'فایل JSON محصولات یافت نشد.';
            exit;
        }
        $jsonString = file_get_contents($jsonFile);
        $data = json_decode($jsonString, true);
        if ($data === null) {
            echo 'خطا در تجزیه فایل JSON.';
            exit;
        }

        $foundProduct = false;
        foreach ($data['categories'] as &$category) {
            foreach ($category['products'] as &$product) {
                if ($product['url'] == $url) {
                    // این محصول را یافتیم - به‌روزرسانی می‌کنیم
                    if ($titleFa) {
                        $product['name']['fa'] = $titleFa;
                    }
                    if ($titleEn) {
                        $product['name']['en'] = $titleEn;
                    }
                    if ($description) {
                        $product['description'] = $description;
                    }
                    $foundProduct = true;
                    break 2;
                }
            }
        }

        if ($foundProduct) {
            // ذخیره تغییرات در فایل JSON
            $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            if (!file_put_contents($jsonFile, $newJsonString)) {
                echo 'خطا در به‌روزرسانی فایل JSON.';
                exit;
            }
        } else {
            echo 'محصول در فایل JSON یافت نشد تا به‌روزرسانی شود.';
        }

        // == به‌روزرسانی تگ‌های سئو در فایل HTML (title, meta description, meta keywords و ...) ==
        // تابع تولید کلیدواژه
        function generateKeywords($fa, $en)
        {
            $combinedTitle = $fa . ' ' . $en;
            $words = preg_split('/\s+/', $combinedTitle);
            $stopWords = [
                'و',
                'با',
                'به',
                'در',
                'از',
                'که',
                'را',
                'این',
                'آن',
                'برای',
                'the',
                'and',
                'of',
                'a',
                'an',
                'in',
                'on',
                'is',
                'are'
            ];
            $filtered = array_diff($words, $stopWords);
            $keywordsString = implode(', ', $filtered);
            return $keywordsString;
        }

        $keywords = generateKeywords($titleFa, $titleEn);

        // حالا فایل HTML را می‌خوانیم و در آن تگ <title> و متاها را آپدیت می‌کنیم.
        if (file_exists($new_file)) {
            $content = file_get_contents($new_file);

            // 1) جایگزینی <title>...</title>:
            if ($titleFa) {
                $patternTitle = '/<title>(.*?)<\/title>/s';
                $replacementTitle = '<title>' . htmlspecialchars($titleFa, ENT_QUOTES, 'UTF-8') . '</title>';
                $content = preg_replace($patternTitle, $replacementTitle, $content);
            }

            // 2) جایگزینی meta name="description"
            if ($description) {
                $patternDesc = '/<meta[^>]+name="description"[^>]+content="([^"]*)"[^>]*>/i';
                $replacementDesc = '<meta name="description" content="' . htmlspecialchars($description, ENT_QUOTES, 'UTF-8') . '" />';
                $content = preg_replace($patternDesc, $replacementDesc, $content);
            }

            // 3) جایگزینی meta name="keywords"
            if ($keywords) {
                $patternKeywords = '/<meta[^>]+name="keywords"[^>]+content="([^"]*)"[^>]*>/i';
                $replacementKeywords = '<meta name="keywords" content="' . htmlspecialchars($keywords, ENT_QUOTES, 'UTF-8') . '" />';
                $content = preg_replace($patternKeywords, $replacementKeywords, $content);
            }

            // 4) og:title و og:description
            if ($titleFa) {
                $patternOgTitle = '/<meta[^>]+property="og:title"[^>]+content="([^"]*)"[^>]*>/i';
                $replacementOgTitle = '<meta property="og:title" content="' . htmlspecialchars($titleFa, ENT_QUOTES, 'UTF-8') . '" />';
                $content = preg_replace($patternOgTitle, $replacementOgTitle, $content);
            }
            if ($description) {
                $patternOgDesc = '/<meta[^>]+property="og:description"[^>]+content="([^"]*)"[^>]*>/i';
                $replacementOgDesc = '<meta property="og:description" content="' . htmlspecialchars($description, ENT_QUOTES, 'UTF-8') . '" />';
                $content = preg_replace($patternOgDesc, $replacementOgDesc, $content);
            }

            // 5) twitter:title و twitter:description
            if ($titleFa) {
                $patternTwTitle = '/<meta[^>]+name="twitter:title"[^>]+content="([^"]*)"[^>]*>/i';
                $replacementTwTitle = '<meta name="twitter:title" content="' . htmlspecialchars($titleFa, ENT_QUOTES, 'UTF-8') . '" />';
                $content = preg_replace($patternTwTitle, $replacementTwTitle, $content);
            }
            if ($description) {
                $patternTwDesc = '/<meta[^>]+name="twitter:description"[^>]+content="([^"]*)"[^>]*>/i';
                $replacementTwDesc = '<meta name="twitter:description" content="' . htmlspecialchars($description, ENT_QUOTES, 'UTF-8') . '" />';
                $content = preg_replace($patternTwDesc, $replacementTwDesc, $content);
            }

            if (!file_put_contents($new_file, $content)) {
                echo 'خطا در به‌روزرسانی صفحه HTML.';
                exit;
            }

            $sitemapFile = '../sitemap.xml';
            $pageUrl = "https://strumix.com/products/" . $url;
            $xml = simplexml_load_file($sitemapFile);

            $found = false;

            $currentDate = date('Y-m-d');

            foreach ($xml->url as $urlElement) {
                if (trim((string)$urlElement->loc) === $pageUrl) {
                    $urlElement->lastmod = $currentDate;
                    $found = true;
                    break;
                }
            }

            if ($found) {
                if ($xml->asXML($sitemapFile)) {
                    echo "تاریخ آخرین تغییر صفحه به $currentDate به روز رسانی شد.";
                } else {
                    echo "خطا در ذخیره فایل سایت مپ.";
                }
            } else {
                echo "صفحه مورد نظر در سایت مپ پیدا نشد.";
            }

            echo 'صفحه و فایل‌ها با موفقیت به‌روزرسانی شدند.';
        } else {
            echo 'فایل HTML محصول وجود ندارد.';
        }
    } else {
        echo 'درخواست نامعتبر.';
    }
} else {
    echo 'خطا: اطلاعات ورود به سیستم صحیح نیست.';
}
$connAuthorisation->close();
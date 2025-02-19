<?php
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];
$userUsername = htmlspecialchars($userUsername);
$userPassword = htmlspecialchars($userPassword);

$servernameAuthorisation = 'localhost';
$usernameAuthorisation  = "strumixii_mod";
$passwordAuthorisation  = "3.MWU!7!G^5v";
$dbnameAuthorisation    = 'strumixii_Mod_data';

$connAuthorisation = new mysqli($servernameAuthorisation, $usernameAuthorisation, $passwordAuthorisation, $dbnameAuthorisation);
$connAuthorisation->set_charset("utf8mb4");

if ($connAuthorisation->connect_error) {
    die('Database connection failed: ' . $connAuthorisation->connect_error);
}

$sqlAuthorisation    = "SELECT * FROM modEntry WHERE email='$userUsername' AND password='$userPassword'";
$resultAuthorisation = $connAuthorisation->query($sqlAuthorisation);

if ($resultAuthorisation->num_rows > 0) {
    // کاربر مجاز است
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $url = htmlspecialchars($_POST['url']);

        // حذف محصول از فایل products.json
        $jsonFile   = '../serverAssets/products.json';
        $jsonString = file_get_contents($jsonFile);
        $data       = json_decode($jsonString, true);

        $productFound = false;

        // پیمایش دسته‌ها
        foreach ($data['categories'] as &$category) {
            // بررسی مقدار products
            if (isset($category['products'])) {

                // اگر ساختار به‌صورت شی (object) است، آن را به آرایه تبدیل می‌کنیم
                if (is_object($category['products'])) {
                    $category['products'] = (array)$category['products'];
                }

                // برای هماهنگی و از بین بردن ایندکس‌های نامنظم، از array_values استفاده می‌کنیم
                $category['products'] = array_values($category['products']);

                foreach ($category['products'] as $key => $product) {
                    if ($product['url'] === $url) {
                        // حذف محصول از آرایه
                        unset($category['products'][$key]);
                        // مجدد ایندکس‌ها را مرتب می‌کنیم
                        $category['products'] = array_values($category['products']);
                        $productFound = true;
                        break 2; // خروج از هر دو حلقه
                    }
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

        $sitemapFile = '../sitemap.xml';
        $pageUrl = "https://strumix.com/products/" . $url;

        if (file_exists($sitemapFile)) {
            $doc = new DOMDocument();
            $doc->preserveWhiteSpace = false;
            $doc->formatOutput = true;
            $doc->load($sitemapFile);

            $xpath = new DOMXPath($doc);
            $namespaceURI = $doc->documentElement->lookupnamespaceURI(NULL);
            if ($namespaceURI) {
                $xpath->registerNamespace('ns', $namespaceURI);
                $query = "/ns:urlset/ns:url[ns:loc/text() = '$pageUrl']";
            } else {
                $query = "/urlset/url[loc/text() = '$pageUrl']";
            }

            $nodes = $xpath->query($query);

            if ($nodes->length > 0) {
                foreach ($nodes as $node) {
                    $node->parentNode->removeChild($node);
                }
                $doc->save($sitemapFile);
                echo "صفحه ($pageUrl) با موفقیت از sitemap حذف شد.";
            } else {
                echo "صفحه ($pageUrl) در sitemap یافت نشد.";
            }
        } else {
            echo "فایل sitemap.xml یافت نشد.";
        }

        echo 'محصول با موفقیت حذف شد.';
    } else {
        echo 'درخواست نامعتبر.';
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}
$connAuthorisation->close();
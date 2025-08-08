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
    // بررسی روش درخواست
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // دریافت پارامترهای POST
        $url = htmlspecialchars($_POST['url']);
        $titleFa = $_POST['titleFa'];
        $titleEn = $_POST['titleEn'];
        $description = $_POST['description'];
        $categoryName = $_POST['category'];
        $newProductContent = $_POST['newProductContent']; // دریافت محتوای main

        // ایجاد کلمات کلیدی از عنوان‌ها
        function generateKeywords($titleFa, $titleEn)
        {
            // ادغام عناوین
            $combinedTitle = $titleFa . ' ' . $titleEn;

            // جدا کردن به کلمات
            $words = preg_split('/\s+/', $combinedTitle);

            // حذف حروف ربط و کلمات اضافی
            $stopWords = array('و', 'با', 'به', 'در', 'از', 'که', 'را', 'این', 'آن', 'برای', 'the', 'and', 'of', 'a', 'an', 'in', 'on', 'is', 'are');
            $keywords = array_diff($words, $stopWords);

            // تبدیل به رشته با کاما
            $keywordsString = implode(', ', $keywords);

            return $keywordsString;
        }

        $keywords = generateKeywords($titleFa, $titleEn);

        // مسیر فایل HTML محصول جدید
        $new_file = '../products/' . $url . '.html';

        // قالب HTML پایه
        $htmlTemplate = '<!DOCTYPE html>
<html lang="fa">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{titleFa}</title>

    <script async="" src="https://www.googletagmanager.com/gtag/js?id=G-4PJ8JE8SW8"></script>
    <script src="../src/js/googleAnalytics.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="../src/js/ScrollSmoother.min.js"></script>
    <script src="../src/js/SplitText.min.js"></script>

    <script defer="" src="../src/js/addSpanForEnglish.js"></script>
    <script defer="" src="../src/js/products.js?v=1.0.13"></script>
    <script defer="" src="../src/js/horizontalScrollbar.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>

    <meta name="author" content="استراميکس-STRUMIX" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="robots" content="index, follow" />
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/faviconPackage/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/faviconPackage/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/faviconPackage/favicon-16x16.png" />
    <link rel="manifest" href="../assets/faviconPackage/site.webmanifest" />
    <link rel="mask-icon" href="../assets/faviconPackage/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    <meta name="description" content="{description}" />
    <meta name="keywords" content="{keywords}" />
    <meta property="og:title" content="{titleFa}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="strumix.com/assets/productImg/{url}.jpg" />
    <meta property="og:url" content="strumix.com/products/{url}.html" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="strumix.com/assets/productImg/{url}.jpg" />
    <meta name="twitter:title" content="{titleFa}" />
    <meta name="twitter:description" content="{description}" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CSSRulePlugin.min.js"></script>

    <link rel="stylesheet" href="../src/css/main.css?v=1.0.13" />
    <link rel="stylesheet" href="../src/css/products.css?v=1.0.13" />
    <script defer src="../src/js/main.js?v=1.0.13"></script>
    <script src="../src/js/chart.js"></script>
    <script defer="" src="../src/js/lineChart.js"></script>
  </head>

  <body>
    <div id="scrollbar-container">
      <div id="scrollbar"></div>
    </div>

    <main id="smooth-wrapper">
      <div id="smooth-content">
      {mainContent}
      </div>
    </main>
    <section class="splashScreen" data-cursor="pointerWaveBorder">
      <p>
        Strumix
        <svg viewBox="0 0 337 255" fill="none">
          <path class="svg-path"></path>
        </svg>
      </p>
      <p>بسپار بتن ايرانيان هوشمند</p>
      <img src="assets/VectorLogo.svg" alt="Strumix logo" />
    </section>
  </body>
</html>';

        // جایگزینی مقادیر در قالب
        $htmlContent = str_replace(
            array('{titleFa}', '{description}', '{keywords}', '{url}', '{mainContent}'),
            array($titleFa, $description, $keywords, $url, $newProductContent),
            $htmlTemplate
        );

        // ذخیره فایل HTML محصول جدید
        if (!file_put_contents($new_file, $htmlContent)) {
            echo 'خطا در ایجاد صفحه HTML محصول.';
            exit;
        }

        // آپلود فایل PDF
        if (isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] == UPLOAD_ERR_OK) {
            $pdfFile = $_FILES['pdfFile'];
            $uploadDirectory = '../serverAssets/productCatalogue/';
            $fileExtension = strtolower(pathinfo($pdfFile['name'], PATHINFO_EXTENSION));

            if ($fileExtension !== 'pdf') {
                echo 'فرمت فایل PDF معتبر نیست.';
                exit;
            }

            $uploadPath = $uploadDirectory . $url . '.pdf';

            if (!move_uploaded_file($pdfFile['tmp_name'], $uploadPath)) {
                echo 'خطا در جابجایی فایل PDF.';
                exit;
            }
        } else {
            echo 'فایل PDF ارسال نشده است.';
            exit;
        }

        // آپلود تصویر محصول
        if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] == UPLOAD_ERR_OK) {
            $imageUploadFolder = '../assets/productImg/';
            $imageFile = $_FILES['imageFile'];
            $imageTmpPath = $imageFile['tmp_name'];
            $imageName = $imageFile['name'];
            $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));

            if ($imageExtension == 'jpg' || $imageExtension == 'jpeg' || $imageExtension == 'png') {
                $newFileName = $url . '.' . $imageExtension;
                $destPath = $imageUploadFolder . $newFileName;

                if (!move_uploaded_file($imageTmpPath, $destPath)) {
                    echo 'خطا در جابجایی فایل تصویر.';
                    exit;
                }
            } else {
                echo 'فرمت تصویر پشتیبانی نمی‌شود.';
                exit;
            }
        } else {
            echo 'فایل تصویر ارسال نشده است.';
            exit;
        }

        // به‌روزرسانی فایل JSON
        $jsonFile = '../serverAssets/products.json';
        $jsonString = file_get_contents($jsonFile);
        $data = json_decode($jsonString, true);

        // جستجوی دسته‌بندی مورد نظر
        $categoryFound = false;
        foreach ($data['categories'] as &$category) {
            if ($category['name'] == $categoryName) {
                $categoryFound = true;
                // یافتن بیشترین ID موجود
                $maxId = 0;
                foreach ($category['products'] as $product) {
                    if ($product['id'] > $maxId) {
                        $maxId = $product['id'];
                    }
                }
                $newId = $maxId + 1;

                // افزودن محصول جدید به دسته‌بندی
                $newProduct = [
                    "id" => $newId,
                    "url" => $url,
                    "name" => [
                        "fa" => $titleFa,
                        "en" => $titleEn
                    ],
                    "description" => $description,
                    "image" => $url . '.' . $imageExtension
                ];

                $category['products'][] = $newProduct;
                break;
            }
        }

        if (!$categoryFound) {
            echo 'دسته‌بندی مورد نظر یافت نشد.';
            exit;
        }

        // ذخیره مجدد فایل JSON
        $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        if (!file_put_contents($jsonFile, $newJsonString)) {
            echo 'خطا در به‌روزرسانی فایل JSON.';
            exit;
        }

        // به روز رسانی فایل sitemap.xml
        $sitemapFile = '../sitemap.xml';
        $newUrl = "https://strumix.com/products/" . $url;

        if (file_exists($sitemapFile)) {
            $doc = new DOMDocument();
            $doc->preserveWhiteSpace = false;
            $doc->formatOutput = true;
            $doc->load($sitemapFile);

            $urlset = $doc->getElementsByTagName('urlset')->item(0);
            $urlElement = $doc->createElement('url');

            $loc = $doc->createElement('loc', $newUrl);
            $urlElement->appendChild($loc);

            $lastmod = $doc->createElement('lastmod', date('Y-m-d'));
            $urlElement->appendChild($lastmod);

            $urlset->appendChild($urlElement);

            $doc->save($sitemapFile);
        }

        echo 'محصول با موفقیت اضافه شد.';
    } else {
        echo 'درخواست نامعتبر.';
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();
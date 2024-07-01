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
    die('Database connection failed');
}

$sqlAuthorisation = "SELECT * FROM modEntry WHERE email = '$userUsername' AND password = '$userPassword'";
$resultAuthorisation = $connAuthorisation->query($sqlAuthorisation);

if ($resultAuthorisation->num_rows > 0) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['url'])) {

            $url = $_POST['url'];

            $filePath = '../blogs/' . $url . '.html';

            $jsonFilePath = '../serverAssets/blogs.json';

            if (file_exists($jsonFilePath)) {
                $jsonContent = file_get_contents($jsonFilePath);
                $jsonArray = json_decode($jsonContent, true);

                if ($jsonArray !== null) {
                    foreach ($jsonArray['blogs'] as $key => $blog) {
                        if ($blog['url'] === $url) {
                            unset($jsonArray['blogs'][$key]);
                            $jsonArray['blogs'] = array_values($jsonArray['blogs']);
                            break;
                        }
                    }

                    if (file_put_contents($jsonFilePath, json_encode($jsonArray, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))) {
                        echo "ورودی JSON با موفقیت حذف شد.";
                    } else {
                        echo "خطا در بروزرسانی فایل JSON.";
                    }
                } else {
                    echo "خطا در خواندن فایل JSON.";
                }
            } else {
                echo "فایل JSON وجود ندارد.";
            }


            if (file_exists($filePath)) {
                if (unlink($filePath)) {
                    echo "فایل HTML با موفقیت حذف شد.";
                } else {
                    echo "خطا در حذف فایل HTML.";
                    exit;
                }
            } else {
                echo "فایل HTML وجود ندارد.";
            }
        } else {
            echo "پارامتر 'url' ارسال نشده است.";
        }
    } else {
        echo "درخواست نامعتبر است.";
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

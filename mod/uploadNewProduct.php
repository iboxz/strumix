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
    $url = htmlspecialchars($_POST['url']);

    $labels = $_POST['labels'];
    $labelYellow = $_POST['labelYellow'];
    $labelRed = $_POST['labelRed'];
    $dataYellow = $_POST['dataYellow'];
    $dataRed = $_POST['dataRed'];
    $titleText = $_POST['titleText'];

    $body = $_POST['body'];

    $new_file = '../products/' . $url . '.html';

    if (file_exists($new_file)) {
        $content = file_get_contents($new_file);

        $updated_content = preg_replace('/<main id="smooth-wrapper">.*<\/main>/s', '<main id="smooth-wrapper">' . $body . '</main>', $content);

        $new_script = '
        <script>
          var labels = [' . $labels . '];
          var labelYellow = "' . $labelYellow . '";
          var labelRed = "' . $labelRed . '";
          var dataYellow = [' . $dataYellow . '];
          var dataRed = [' . $dataRed . '];
          var titleText = "' . $titleText . '";
        </script>';

        if (preg_match('/<script>.*?<\/script>/s', $updated_content)) {
            $updated_content = preg_replace('/<script>.*?<\/script>/s', $new_script, $updated_content);
        } else {
            $updated_content = str_replace('</body>', $new_script . '</body>', $updated_content);
        }

        if (file_put_contents($new_file, $updated_content)) {
            echo "صفحه با موفقیت به‌روزرسانی شد: <a href='" . $new_file . "' target='_blank'>" . $new_file . "</a>";
        } else {
            echo 'خطا در به‌روزرسانی صفحه.';
        }



        if (file_put_contents($new_file, $updated_content)) {
            echo "صفحه با موفقیت به‌روزرسانی شد: <a href='" . $new_file . "'>" . $new_file . "target='_blank' </a>";
        } else {
            echo 'خطا در به‌روزرسانی صفحه.';
        }
    } else {
        echo 'فایل وجود ندارد.';
    }
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

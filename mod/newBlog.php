<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);

    $servername = "localhost";
    $db_username = $username;
    $db_password = $password;
    $dbname = "strumixii_contactData";

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
    } else {

        $page_name = htmlspecialchars($_POST['page_name']);
        $page_title = htmlspecialchars($_POST['page_title']);

        $new_file = $page_name . ".html";

        $html_content = "<!DOCTYPE html>
    <html lang='fa'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>" . $page_title . "</title>
    </head>
    <body>
        <h1>" . $page_title . "</h1>
        <p>این یک صفحه جدید است که به صورت پویا ایجاد شده است.</p>
    </body>
    </html>";

        if (file_put_contents($new_file, $html_content)) {
            echo "صفحه جدید با موفقیت ایجاد شد: <a href='" . $new_file . "'>" . $new_file . "</a>";
        } else {
            echo "خطا در ایجاد صفحه.";
        }
    }
    $conn->close();
} else {
    echo "درخواست نامعتبر.";
}

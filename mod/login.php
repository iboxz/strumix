<?php
$userUsername = htmlspecialchars($_POST['username']);
$userPassword = htmlspecialchars($_POST['password']);

$servernameAuthorisation = 'localhost';
$usernameAuthorisation = "strumixii_mod";
$passwordAuthorisation = "3.MWU!7!G^5v";
$dbnameAuthorisation = 'strumixii_Mod_data';

$connAuthorisation = new mysqli($servernameAuthorisation, $usernameAuthorisation, $passwordAuthorisation, $dbnameAuthorisation);
$connAuthorisation->set_charset("utf8mb4");
if ($connAuthorisation->connect_error) {
    echo 'Database connection failed';
}
$sqlAuthorisation = "SELECT * FROM modEntry";

$resultAuthorisation = $connAuthorisation->query($sqlAuthorisation);

if ($resultAuthorisation->num_rows > 0) {
    $match_found = false;
    while ($row = $resultAuthorisation->fetch_assoc()) {
        if ($row['email'] === $userUsername && $row['password'] === $userPassword) {
            $match_found = true;
            break;
        }
    }

    if (!$match_found) {
        echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
    } else {
        echo "true";
    }
} else {
    echo "خطا در دریافت اطلاعات ورد به سیستم";
}

$connAuthorisation->close();

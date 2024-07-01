<?php
$userUsername = $_POST['username'];
$userPassword = $_POST['password'];

$userUsername = htmlspecialchars($userUsername);
$userPassword = htmlspecialchars($userPassword);

$servername = 'localhost';
$username = "strumixii_mod";
$password = "3.MWU!7!G^5v";
$dbname = 'strumixii_Mod_data';

$conn = new mysqli($servername, $username, $password, $dbname);

$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM modEntry WHERE email = '$userUsername' AND password = '$userPassword'";
$resultAuthorisation = $conn->query($sql);

if ($resultAuthorisation->num_rows > 0) {

    $sql = "SELECT email FROM modEntry";
    $result = $conn->query($sql);

    $response_data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response_data[] = $row;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($response_data);
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$conn->close();

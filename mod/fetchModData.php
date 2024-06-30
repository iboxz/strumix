<?php
$servername = 'localhost';
$username = "strumixii_mod";
$password = "3.MWU!7!G^5v";
$dbname = 'strumixii_Mod_data';

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT email FROM modEntry";
$result = $conn->query($sql);

$response_data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $response_data[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response_data);

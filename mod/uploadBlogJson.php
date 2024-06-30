<?php
header('Content-Type: application/json; charset=UTF-8');

$data = json_decode(file_get_contents('php://input'), true);
$username = filter_var($data['username'], FILTER_SANITIZE_STRING);
$password = filter_var($data['password'], FILTER_SANITIZE_STRING);

$servername = 'localhost';
$usernameDB = "strumixii_mod";
$passwordDB = "3.MWU!7!G^5v";
$dbname = 'strumixii_Mod_data';

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

if ($conn->connect_error) {
    die(json_encode(array('success' => false, 'error' => 'Database connection failed')));
}

$sql = "SELECT * FROM modEntry WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    unset($data['username']);
    unset($data['password']);

    $filePath = '../serverAssets/blogs.json';

    if (file_exists($filePath)) {
        $jsonContent = file_get_contents($filePath);
        $blogs = json_decode($jsonContent, true);
    } else {
        $blogs = array("blogs" => array());
    }

    $urlExists = false;
    foreach ($blogs['blogs'] as &$blog) {
        if ($blog['url'] == $data['url']) {
            $blog = $data;
            $urlExists = true;
            break;
        }
    }

    if (!$urlExists) {
        $blogs['blogs'][] = $data;
    }

    if (file_put_contents($filePath, json_encode($blogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(array('success' => true), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(array('success' => false, 'error' => 'Failed to write to file'), JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode(array('success' => false, 'error' => 'Invalid login credentials'), JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();

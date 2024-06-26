<?php
header('Content-Type: application/json; charset=UTF-8'); 

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $filePath = 'blogs.json';

    if (file_exists($filePath)) {
        $jsonContent = file_get_contents($filePath);
        $blogs = json_decode($jsonContent, true);
    } else {
        $blogs = array("blogs" => array());
    }

    $blogs['blogs'][] = $data;

    if (file_put_contents($filePath, json_encode($blogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(array('success' => true), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(array('success' => false), JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode(array('success' => false), JSON_UNESCAPED_UNICODE);
}
?>

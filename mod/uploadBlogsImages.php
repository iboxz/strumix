<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $targetDir = "uploads/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $originalFileName = basename($_FILES["image"]["name"]);
    $fileName = time() . '_' . $originalFileName;
    $targetFilePath = $targetDir . $fileName;
    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

    $allowTypes = array('jpg', 'png', 'jpeg', 'gif');
    if (in_array($fileType, $allowTypes)) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
            echo json_encode([
                "imageUrl" => $targetFilePath
            ]);
        } else {
            echo json_encode([
                "error" => "Sorry, there was an error uploading your file."
            ]);
        }
    } else {
        echo json_encode([
            "error" => "Sorry, only JPG, JPEG, PNG, & GIF files are allowed."
        ]);
    }
} else {
    echo json_encode([
        "error" => "No file uploaded or invalid request."
    ]);
}

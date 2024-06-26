<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && isset($_POST['title'])) {
        $title = $_POST['title'];
        $image = $_FILES['image'];
        $title = preg_replace('/[^\p{L}\p{N}\-_]/u', '_', $title);

        $uploadDirectory = 'uploads/';

        $fileExtension = 'jpg';

        $uploadPath = $uploadDirectory . $title . '.' . $fileExtension;

        if (move_uploaded_file($image['tmp_name'], $uploadPath)) {
            echo 'Image uploaded successfully!';
        } else {
            echo 'Image upload failed.';
        }
    } else {
        echo 'Invalid input.';
    }
}

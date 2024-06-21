<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $servername = "localhost";
    $db_username = $username; 
    $db_password = $password; 
    $dbname = "strumixii_contactData";

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
        echo "false";
    } else {
        echo "true";
    }
    $conn->close();
}
?>

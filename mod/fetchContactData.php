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
    $servername = "localhost";
    $username = "strumixii_mod";
    $password = "3.MWU!7!G^5v";
    $dbname = "strumixii_contactData";

    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql_job = "SELECT * FROM job";
    $result_job = $conn->query($sql_job);

    $data_job = array();
    if ($result_job->num_rows > 0) {
        while ($row_job = $result_job->fetch_assoc()) {
            $data_job[] = $row_job;
        }
    }

    $sql_branch = "SELECT * FROM branch";
    $result_branch = $conn->query($sql_branch);

    $data_branch = array();
    if ($result_branch->num_rows > 0) {
        while ($row_branch = $result_branch->fetch_assoc()) {
            $data_branch[] = $row_branch;
        }
    }

    $conn->close();

    $response_data = array(
        'job' => $data_job,
        'branch' => $data_branch
    );

    header('Content-Type: application/json');
    echo json_encode($response_data);
} else {
    echo "خطا: اطلاعات ورود به سیستم صحیح نیست.";
}

$connAuthorisation->close();

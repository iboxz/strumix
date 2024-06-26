<?php
$postUsername = $_POST['username'];
$postPassword = $_POST['password'];

$servername = "localhost";
$username = $postUsername;
$password = $postPassword;
$dbname = "strumixii_contactData";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

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
    'branche' => $data_branch
);

header('Content-Type: application/json');
echo json_encode($response_data);
?>

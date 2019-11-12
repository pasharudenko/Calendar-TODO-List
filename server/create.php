<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$data = json_decode(file_get_contents('php://input'), true);




$dbc = mysqli_connect('localhost', 'root', '', 'calendar') or die('db error');

$query = "INSERT INTO `reminder`(date, name, text) VALUES (".$data['date'].", '".$data['name']."', '".$data['text']."')";
mysqli_query($dbc, $query) or die(mysqli_error($dbc));

echo mysqli_insert_id($dbc);
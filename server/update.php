<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$data = json_decode(file_get_contents('php://input'), true);
$dbc = mysqli_connect('localhost', 'root', '', 'calendar') or die('db error');
$query = "UPDATE `reminder` SET name = '".$data['name']."', text = '".$data['text']."' WHERE id =".$data['id'];

mysqli_query($dbc, $query) or die(mysqli_error($dbc));
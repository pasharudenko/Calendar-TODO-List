<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$data = json_decode(file_get_contents('php://input'), true);




$dbc = mysqli_connect('localhost', 'root', '', 'calendar') or die('db error');

$query = "SELECT * FROM `reminder`";
$result = mysqli_query($dbc, $query) or die(mysqli_error($dbc));

$arr = [];

while($next = mysqli_fetch_array($result)) {
      $arr[] = ['id' => $next['id'], 'date' => $next['date'],'name' => $next['name'],'text' => $next['text']];
}

print_r(json_encode($arr));
<?php 

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["lat"]) && isset($_GET["long"])) {

	$lat = $_GET["lat"];
	$long = $_GET["long"];
	
	if (is_numeric($lat) && is_numeric($long)) {
		$file = "coordinates.txt";
		// The new coordinates to add to the file
        $data = $_SERVER["REQUEST_TIME"] . " "  .$lat . " " . $long . PHP_EOL;
        // Write the contents to the file, 
        // and the LOCK_EX flag to prevent anyone else writing to the file at the same time
		file_put_contents($file, $data, LOCK_EX);
		echo "<h1>Issaugota</h1>";
	} else {
		echo "<h1>Neteisingos koordinates</h1>";
	}
}

?>
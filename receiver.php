<?php 
$cmdFilename = "cmds.txt";
$coordFilename = "coordinates.txt";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	// Tikrinam ar yra nustatytos lat ir long koordinates
    if (isset($_GET["lat"]) && isset($_GET["long"])) {
		$lat = $_GET["lat"];
	    $long = $_GET["long"];
		// Tikrinam ar koordinates yra skaiciai
	    if (is_numeric($lat) && is_numeric($long)) {
	    	// Duomenys, kuriuos rasysim i faila
            $data = $_SERVER["REQUEST_TIME"] . " "  .$lat . " " . $long . PHP_EOL;
            // Rasom duomenis i faila 
            // LOCK_EX flag to prevent anyone else writing to the file at the same time
	    	$result = file_put_contents($coordFilename, $data, LOCK_EX);
			// Tikrinam ar pavyko irasyti duomenis
			if (is_numeric($result) && $result > 0) {
				$return = "SAVED";
			} else {
				$return = "SAVEERROR";
			}
	    } else {
			$return = "SAVEERROR";
	    }
		
		// Tikrinam ar yra nauju komandu
		if (file_exists($cmdFilename) && filesize($cmdFilename) > 0) {
			// Pridedam naujas komandas prie grazinamo teksto
			$return .= " " . file_get_contents($cmdFilename);
			// Isvalom komandu faila
			$cmdFile = fopen($cmdFilename, "w");
			fclose($cmdFile);
		}
        echo $return;
	}
	
	// Tikrinam ar atsiusta nauja komanda
	if (isset($_GET["cmd"])) {
		$cmdFilesize = filesize($cmdFilename);
		// Jeigu komandu failas nera tuscias, pries komanda pridedam tarpa 
		if (file_exists($cmdFilename) && $cmdFilesize > 0) {
			$_GET["cmd"] = " " . $_GET["cmd"];
		}
		// Irasom komanda i faila
		$result = file_put_contents($cmdFilename, $_GET["cmd"], FILE_APPEND | LOCK_EX);
		// Tikrinam ar pavyko irasyti duomenis
		if (is_numeric($result) && $result > 0) {
			$return = "CMDSAVED";
		} else {
			$return = "CMDSAVEERROR";
		}
		echo $return . ": ".$_GET["cmd"];
	}
}

?>
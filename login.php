<?php
	// nuskaitome konfigūracijų failą
	include 'config.php';

	// iškviečiame prisijungimo prie duomenų bazės klasę
	include 'mysql.class.php';
	
	// iškviečiame prisijungimo prie duomenų bazės klasę
	include 'users.php';
	$usersObj = new user();
	
	session_start();
	
	if(!empty($_POST['submit'])) {

      $myusername = mysqli_real_escape_string(mysql::connect(),$_POST['name']);
      $mypassword = mysqli_real_escape_string(mysql::connect(),$_POST['password']); 
      
      $result = $usersObj->getUser($myusername, $mypassword);
      
      // If result matched $myusername and $mypassword, table row must be 1 row
		
      if(!is_null($result)) {
         $_SESSION['login_user'] = $myusername;
         
         header("location: maps.html");
      }else {
         $error = "Your Login Name or Password is invalid";
      }
   }
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Sekimo projektas - Prisijungimas</title>

	</head>
	<body>
		<form action="" method="post">
		<fieldset>
			<legend>Prisijungimas</legend>
			<p>
				<label class="field" for="name">Vartotojo vardas:</label>
				<input type="text" id="name" name="name" class="textbox-150" value="<?php echo isset($fields['name']) ? $fields['name'] : ''; ?>">
			</p>
			<p>
				<label class="field" for="password">Slaptažodis:</label>
				<input type="text" id="password" name="password" class="textbox-150" value="<?php echo isset($fields['password']) ? $fields['password'] : ''; ?>">
			</p>
		</fieldset>
			<input type="submit" class="submit" name="submit" value="Prisijungti">
		</p>
		<?php if(isset($error)) echo $error; ?>
	</form>
	</body>
</html>

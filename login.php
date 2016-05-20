<?php
	// nuskaitome konfigûracijø failà
	include 'config.php';

	// iðkvieèiame prisijungimo prie duomenø bazës klasæ
	include 'mysql.class.php';
	
	// iðkvieèiame vartotojø klasæ
	include 'users.class.php';
	$usersObj = new user();
	session_start();
        error_reporting(0);
        
	if(!empty($_POST['submit'])) {
            
        // username and password sent from form 
      $myusername = mysqli_real_escape_string(mysql::connect(),$_POST['name']);
      $mypassword = mysqli_real_escape_string(mysql::connect(),$_POST['password']); 
      
      $result = $usersObj->getUserRights($myusername, $mypassword);

      // If result "== 1" means "admin", "== 0"	means "guest", else error
      if($result == "1") {
         $_SESSION['login_user'] = $myusername;
         header("location: http://sarkyb.stud.if.ktu.lt/semestrinis/maps.php");
      } else if($result == "0") {
         $_SESSION['login_user'] = $myusername;
         header("location: http://sarkyb.stud.if.ktu.lt/semestrinis/maps.php");
      } else {
         $error = "Your Login Name or Password is invalid!";
      }
      error_reporting(1);
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
				<label class="field" for="name">User name:</label>
				<input type="text" id="name" name="name" class="textbox-150" value="<?php echo isset($fields['name']) ? $fields['name'] : ''; ?>">
			</p>
			<p>
				<label class="field" for="password">Password:</label>
				<input type="password" id="password" name="password" class="textbox-150" value="<?php echo isset($fields['password']) ? $fields['password'] : ''; ?>">
			</p>
		</fieldset>
			<input type="submit" class="submit" name="submit" value="Prisijungti">
		</p>
		<?php if(isset($error)) echo $error; ?>
	</form>
	</body>
</html>

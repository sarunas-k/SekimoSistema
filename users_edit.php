<?php
	session_start();
	// Jei nėra administratorius, puslapio nerodom
    if(!isset($_SESSION['admin_user']))
    	header('location: login.php');
	
	include 'users.class.php';
    $usersObj = new user();

    include 'config.php';
    include 'mysql.class.php';
	
	$fields = array();
	$formErrors = null;
	
	$id = '';
	if(isset($_GET['id']))
    	$id = $_GET['id'];
	
	// paspaustas išsaugojimo mygtukas
	if(!empty($_POST['submit'])) {
        if(isset($_POST['name'])) {
			$data['name'] = $_POST['name'];
			if(isset($_POST['password'])) {
				$data['password'] = $_POST['password'];
			}
			$data['admin_rights'] = isset($_POST['admin_rights']) ? "1" : "0";
			
			if(isset($_POST['id'])) {
				if(isset($_POST['password'])) {
					// atnaujiname duomenis
			        $usersObj->updateUser($data);
				} else {
					$usersObj->updateUserRights($data);
				}
		    } else {
				if(isset($_POST['password']))
		    	    $usersObj->insertUser($data);
				else
					$formErrors = true;
		    }
		    // nukreipiame į markių puslapį
		    header("Location: users_list.php");
		    die();
		} else {
			$formErrors = true;
		}
		
	} else {
		// tikriname, ar nurodytas elemento id. Jeigu taip, išrenkame elemento duomenis ir jais užpildome formos laukus.
		if(!empty($id)) {
			$fields = $usersObj->getUser($id);
		}
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Sekimo projektas</title>
	</head>
	<body>
<h3><?php echo empty($id) ? "New user" : "Edit user"; ?></h3>
<?php if($formErrors != null) { ?>
		<div class="errorBox">
			Neįvesti arba neteisingai įvesti laukai.
		</div>
	<?php } ?>
<form action="" method="post">
  <div class="form-group">
    <label for="name">User name</label>
    <input type="text" class="form-control" id="name" name="name" placeholder="User name" value="<?php echo isset($fields['name']) ? $fields['name'] : ''; ?>">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password" name="password" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="admin_rights">Admin rights</label>
    <input type="checkbox" class="form-control" id="admin_rights" name="admin_rights"<?php echo isset($fields['admin_rights']) && $fields['admin_rights'] == "1" ? " checked" : ""; ?>>
  </div>
  <input type="submit" class="submit btn btn-default" name="submit" value="Išsaugoti">
  <?php if(!empty($id)) { ?>
			<input type="hidden" name="id" value="<?php echo $id; ?>" />
  <?php } ?>
</form>
</body>
</html>
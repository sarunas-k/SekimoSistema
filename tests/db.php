<h1>Stebejimo sistemos DB automatinis testavimas</h1>
<?php 
	
    include '../users.class.php';
    $usersObj = new user();

    include '../config.php';
    include '../mysql.class.php';
	
	// Sugeneruoti atsitiktinis prisijungimo vardas, slaptazodis ir privilegijos
	$data['name'] = substr(md5(microtime()),rand(0,26),5);
	$data['password'] = substr(md5(microtime()),rand(0,26),5);
	$data['admin_rights'] = rand(0,1);
	
	// insertUser test
	$totalUsers = $usersObj->getUsersListCount();

	$usersObj->insertUser($data);
	$totalUsersAfterInsert = $usersObj->getUsersListCount();
	
	if ($totalUsersAfterInsert == $totalUsers + 1) {
		echo '<p>insertUser() is working</p>';
	} else {
		echo '<p>insertUser() is not working</p>';
	}
	
	// getUser() test
	$user = $usersObj->getUser($data['name']);
	if (!is_null($user) && $user['password'] == SHA1($data['password']) && $user['admin_rights'] == $data['admin_rights']) {
		echo '<p>getUser() is working</p>';
	} else {
		echo '<p>getUser() is not working</p>';
	}
	
	// updateUser() test
	$data['password'] = substr(md5(microtime()),rand(0,26),5);
	$data['admin_rights'] = $data['admin_rights'] == 1 ? 0 : 1;
	$usersObj->updateUser($data);
	
	$user = $usersObj->getUser($data['name']);
	if (!is_null($user) && $user['password'] == SHA1($data['password']) && $user['admin_rights'] == $data['admin_rights']) {
		echo '<p>updateUser() is working</p>';
	} else {
		echo '<p>updateUser() is not working</p>';
	}
	
	// getUserRights() test
	if ($usersObj->getUserRights($data['name'], $data['password']) == $data['admin_rights']) {
		echo '<p>getUserRights() is working</p>';
	} else {
		echo '<p>getUserRights() is not working</p>';
	}
	
	// deleteUser() test
	$usersObj->deleteUser($data['name']);
	if ($usersObj->getUsersListCount() == $totalUsers) {
	    echo '<p>deleteUser() is working</p>';
	} else {
		echo '<p>deleteUser() is not working</p>';
	}
?>
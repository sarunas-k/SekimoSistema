<?php
    session_start();
	// Jei nėra administratorius, puslapio nerodom
    if(!isset($_SESSION['admin_user']))
    	header('location: login.php');
	
    include 'users.class.php';
    $usersObj = new user();

    include 'config.php';
    include 'mysql.class.php';
    
    if(isset($_GET['removeid'])) {
        $usersObj->deleteUser($_GET['removeid']);
    }
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Sekimo projektas</title>
	</head>
	<body>
<ul id="pagePath">
        <li><a href="maps.php">Pradžia</a></li>
        <li>Vartotojų sąrašas</li>
</ul>
<div id="actions">
        <a href='users_edit.php'> Naujas vartotojas</a>
</div>
<div class="float-clear"></div>
<table>
    <tr>
                
                <th>User name</th>
                <th>Permission</th>
    </tr>
    <?php 

            $data = $usersObj->getUsersList();
            
            foreach($data as $key =>$val) {

                echo 
                            "<tr>"
                                    . "<td>{$val['name']}</td>"
                                    . "<td>{$val['admin_rights']}</td>"
                                    . "<td>"
                                            . "<a href='users_list.php?removeid={$val['name']}'>Šalinti</a>&nbsp;"
                                            . "<a href='users_edit.php?id={$val['name']}'>Redaguoti</a>"
                                    ."</td>"
                            . "</tr>";
                
            }
?>
</table>
</body>
</html>
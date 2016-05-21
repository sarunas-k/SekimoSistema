<?php
        include 'users.class.php';
        $usersObj = new user();

        include 'config.php';
        include 'mysql.class.php';
        
        if(!empty($removeId)) {
                $usersObj->deleteUser($removeId);
            die();
        }
?>
<ul id="pagePath">
        <li><a href="/maps.php">Pradþia</a></li>
        <li>Vartotojø sàraðas</li>
</ul>
<div id="actions">
        <a href='users_edit.php=&action=new'> Naujas vartotojas</a>
</div>
<div class="float-clear"></div>
<table>
    <tr>
                
                <th>User name</th>
                <th>Password</th>
                <th>Permission</th>
    </tr>
    <?php 
            $elementCount = $usersObj->getUsersListCount();

            $data = $usersObj->getUsersList();
            
            foreach($data as $key =>$val) {
                echo 
                            "<tr>"
                                    . "<td>{$val['name']}</td>"
                                    . "<td>{$val['password']}</td>"
                                    . "<td>{$val['admin_rights']}</td>"
                                    . "<td>"
                                            . "<a href='#' onclick='showConfirmDialog(\"users\", \"{$val['name']}\"); return false;' title''>Ðalinti</a>&nbsp;"
                                            . "<a href='users_edit.php=&id={$val['name']}' title=''>Redaguoti</a>"
                                    ."</td>"
                            . "</tr>";
                
            }
?>
</table>
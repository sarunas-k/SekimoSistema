<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class user {
    
    public function __construct() {
    }
    
    public function getUserRights($username, $password) {
         $query = " SELECT `SP_users`.`admin_rights`
                                     FROM `SP_users`
                                     WHERE `name`='{$username}'
				      AND `password`='{$password}'";
         $data = mysql::select($query);
         return $data[0]['admin_rights'];
     }
     
     public function getUsersList($limit = null, $offset = null) {
         $limitOffsetString = "";
         if(isset($limit)) {
             $limitOffsetString .= " LIMIT {$limit}";
         }
         
         if(isset($limit)) {
             $limitOffsetString .= " OFFSET {$offset}";
         }
         
         $query = " SELECT *
                                     FROM `SP_users`" . $limitOffsetString;
         $data = mysql::select($query);
         
         return $data;
     }
     
     public function getUsersListCount() {

         $query = " SELECT COUNT(`name`) as `kiekis`
                                     FROM `SP_users`";
         $data = mysql::select($query);
         
         return $data[0]['kiekis'];
     }
     
     public function deleteUser($id) {
         $query = "DELETE FROM `SP_users`
                                     WHERE `name`='{$id}'";
             mysql::query($query);
     }
     
     public function updateUser($data) {
         $query = " UPDATE `SP_users`
                                     SET `password`='{$data['password']}',
                                         `admin_rights`='{$data['admin_rights']}',
                                     WHERE `name`='{$data['name']}'";
                                     
     
         mysql::query($query);
     }
     
     
     public function insertUser($data) {
         $query = " INSERT INTO `SP_users`
                                     (
                                         `name`,
                                         `password`,
                                         `admin_rights`
                                     )
                                     VALUES
                                     (
                                         '{$data['name']}',
                                         '{$data['password']}',
                                         '{$data['admin_rights']}'
                                     )";
         mysql::query($query);
     }
}
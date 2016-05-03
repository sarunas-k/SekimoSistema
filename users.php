<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class user {
    
    public function __construct() {
    }
    
    public function getUser($id) {
         $query = " SELECT *
                                     FROM `users`
                                     WHERE `name`='{$id}'";
         $data = mysql::select($query);
         
         return $data[0];
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
                                     FROM `users`" . $limitOffsetString;
         $data = mysql::select($query);
         
         return $data;
     }
     
     public function getUsersListCount() {
         $query = " SELECT COUNT(`name`) as `kiekis`
                                     FROM `users`";
         $data = mysql::select($query);
         
         return $data[0]['kiekis'];
     }
     
     public function deleteUser($id) {
         $query = "DELETE FROM `users`
                                     WHERE `name`='{$id}'";
             mysql::query($query);
     }
     
     public function updateUser($data) {
         $query = " UPDATE `users`
                                     SET `password`='{$data['password']}',
                                         `permission`='{$data['permission']}',
                                     WHERE `name`='{$data['name']}'";
                                     
     
         mysql::query($query);
     }
     
     
     public function insertUser($data) {
         $query = " INSERT INTO `users`
                                     (
                                         `name`,
                                         `password`,
                                         `permission`
                                     )
                                     VALUES
                                     (
                                         '{$data['name']}',
                                         '{$data['password']}',
                                         '{$data['permission']}'
                                     )";
         mysql::query($query);
     }
}
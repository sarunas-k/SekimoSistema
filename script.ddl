CREATE TABLE users
(
        id integer NOT NULL AUTO_INCREMENT,
	name varchar (255) NOT NULL,
	password varchar (255) NOT NULL,
	permission varchar (255) NOT NULL,
	PRIMARY KEY(id)
);


CREATE TABLE permtypes
(
	id integer NOT NULL AUTO_INCREMENT,
	name char (12) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO permtypes(id, name) VALUES(1, 'admin');
INSERT INTO permtypes(id, name) VALUES(2, 'guest');


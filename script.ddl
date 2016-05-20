CREATE TABLE SP_users
(
	name varchar (255) NOT NULL,
	password varchar (255) NOT NULL,
	admin_rights boolean NOT NULL,
	PRIMARY KEY(name)
);


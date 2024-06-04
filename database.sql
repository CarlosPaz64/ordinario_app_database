CREATE DATABASE IF NOT EXISTS tasks_organizer;

USE tasks_organizer;

CREATE TABLE IF NOT EXISTS users(
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(40) NOT NULL, 
apellidos VARCHAR(100) NOT NULL,
correo VARCHAR(100) NOT NULL UNIQUE,
contrasenia_hashed TEXT
);

CREATE TABLE IF NOT EXISTS tasks(
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion LONGTEXT NOT NULL,
    estatus ENUM('To do', 'Doing', 'Done') NOT NULL DEFAULT 'To do',
    fecha_finalizacion DATE NOT NULL,
    importancia ENUM('critical', 'important', 'optional') NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES users(id)
);


-- DROP DATABASE tasks_organizer;
import { dbConnection } from "../db.conecction.config.js";

const connection = new dbConnection().mysqlConnection();

const userModel = `CREATE TABLE IF NOT EXISTS users(
    id_user INT AUTO_INCREMENT PRIMARY KEy,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    date_signup TIMESTAMP NOT NULL,
    image_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL)`

const createTable = async() => {
    try {
        await (await connection).execute(userModel);
        console.log('Tabla "users" creada o ya existente en mysql');
    } catch (error) {
        console.error('Error al crear la tabla:', error);
    }
}

createTable();
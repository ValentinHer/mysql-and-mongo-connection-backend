import envConfig from './env.config.js';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';

export class dbConnection {
    async mysqlConnection() {
        const url = envConfig.URL_DB_RELATIONAL;

        const [userPaswword, hostPortDb] = url.replace("mysql://", "").split("@");
        const [user, password] = userPaswword.split(":");
        const [hostPort, database] = hostPortDb.split("/");
        const [hostname, port] = hostPort.split(":");
        
        try {
            return await mysql.createConnection({
                host: hostname,
                port,
                user,
                password,
                database
            });
        } catch (error) {
            console.log("Error al conectar a MySql ", error);
        }
    }

    async mongoDbConnection() {
        const url = envConfig.URL_DB_NOTRELATIONAL;
        
        try {
            return await mongoose.connect(url);
        } catch (error) {
            console.log("Error al conectar a MongoDB ", error);
        }
    }
}
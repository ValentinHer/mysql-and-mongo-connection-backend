import envConfig from './env.config.js';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';

export class dbConnection {
    // dbUrl = envConfig.URL_DB_RELATIONAL;

    // async connection(){
    //     if(this.dbUrl.includes("mysql")) {
    //         return await this.mysqlConnection(this.dbUrl);
    //     } else {
    //         return await this.mongoDbConnection(this.dbUrl);
    //     }
    // }

    async mysqlConnection() {
        const url = envConfig.URL_DB_RELATIONAL;

        const [userPaswword, hostPortDb] = url.replace("mysql://", "").split("@");
        const [user, password] = userPaswword.split(":");
        const [hostPort, database] = hostPortDb.split("/");
        const [hostname, port] = hostPort.split(":");
        
        return await mysql.createConnection({
            host: hostname,
            port,
            user,
            password,
            database
        });
    }

    async mongoDbConnection() {
        const url = envConfig.URL_DB_NOTRELATIONAL;
        
        return await mongoose.connect(url);
    }
}
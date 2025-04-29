import express from 'express';
import envConfig from "./env.config.js";
import { dbConnection } from "./db.conecction.config.js";
import {} from "./models/user.mysql.model.js";
import mongoDbUsersRouter from "./routes/user.mongo.routes.js";
import mysqlDbUsersRouter from "./routes/user.mysql.routes.js";
import cors from "cors";
import {swaggerSpec} from "./docs/swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/mongodb/users', mongoDbUsersRouter);
app.use('/api/mysql/users', mysqlDbUsersRouter);

app.listen(envConfig.SERVER_PORT, async () => {
    await new dbConnection().mongoDbConnection();
    
    console.log(`server started in PORT ${envConfig.SERVER_PORT}`);
})
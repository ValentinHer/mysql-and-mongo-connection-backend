import * as bcrypt from "bcrypt";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import envConfig from "../env.config.js";
import { dbConnection } from "../db.conecction.config.js";

const connection = new dbConnection().mysqlConnection();
const s3Client = new S3Client({
  region: envConfig.AWS_REGION,
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEYID,
    secretAccessKey: envConfig.AWS_SECRET_ACCESSKEY,
  },
});

export const create = async (req, res) => {
  const { name, password, date_signup, description } = req.body;
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);
  const dateWithUtc = new Date(date_signup);
  

  const sql =
    "INSERT INTO `users`(`name`, `password`, `date_signup`, `image_name`, `description`) VALUES (?, ?, ?, ?, ?)";

  try {
    const filename = `${crypto.randomUUID()}_${req?.file?.originalname}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: envConfig.AWS_BUCKET_NAME,
        Key: filename,
        Body: req.file.buffer,
      })
    );

    const values = [
      name,
      passwordHash,
      dateWithUtc,
      filename,
      description,
    ];

    const [results] = await (await connection).execute(sql, values);

    return res.status(201).json({ message: "Usuario Registrado Exitosamente" });
  } catch (err) {
    return res
      .status(400)
      .json({
        message: `Problemas al ejecutar la operación, intente de nuevo ${err}`,
      });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM `users` WHERE id_user = ?";

  try {
    const [rows] = await (await connection).query(query, id);

    if (rows.length == 0) {
      return res.status(404).json({ message: "Usuario No Encontrado" });
    }

    const { image_name, password, ...data } = rows[0];

    const command = new GetObjectCommand({
      Bucket: envConfig.AWS_BUCKET_NAME,
      Key: image_name,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    const dataWithUrl = {
      ...data,
      image_url: url,
    };

    return res.status(200).json(dataWithUrl);
  } catch (error) {
    return res
      .status(400)
      .json({
        message: `Problemas al ejecutar la operación, intente de nuevo ${error}`,
      });
  }
};

export const getAll = async (req, res) => {
  const query = "SELECT * FROM `users`";

  try {
    const [rows] = await (await connection).query(query);

    const newData = [];

    for (let i = 0; i < rows.length; i++) {
      const { image_name, ...data } = rows[i];
      const command = new GetObjectCommand({
        Bucket: envConfig.AWS_BUCKET_NAME,
        Key: image_name,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      const dataWithUrl = {
        ...data,
        image_url: url,
      };

      newData.push(dataWithUrl);
    }

    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({
        message: `Problemas al ejecutar la operación, intente de nuevo ${error}`,
      });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, password, date_signup, description } = req.body;

  let fieldsToUpdate = [];
  let values = [];

  if (name) {
    fieldsToUpdate.push("`name` = ? ");
    values.push(name);
  }

  if (password) {
    fieldsToUpdate.push("`password` = ? ");
    values.push(password);
  }

  if (date_signup) {
    fieldsToUpdate.push("`date_signup` = ? ");
    values.push(date_signup);
  }

  if (description) {
    fieldsToUpdate.push("`description` = ? ");
    values.push(description);
  }

  const query =
    "UPDATE `users` SET " + fieldsToUpdate.join(", ") + "WHERE `id_user` = ?";
  console.log(query);
  values.push(id);

  try {

    if (req.file) {
      const sql = "SELECT * FROM `users` WHERE `id_user` = ?";
      const [rows] = await (await connection).query(sql, id);

      if (rows.length == 0) {
        return res.status(404).json({ message: "Usuario No Encontrado" });
      }

      const { image_name } = rows[0];

      await s3Client.send(
        new PutObjectCommand({
          Bucket: envConfig.AWS_BUCKET_NAME,
          Key: image_name,
          Body: req.file.buffer,
        })
      );
    }

    if(fieldsToUpdate.length > 0){
        const [results] = await (await connection).execute(query, values);
    }

    return res
      .status(200)
      .json({ message: "Usuario Actualizado Exitosamente" });
  } catch (err) {
    return res
      .status(400)
      .json({
        message: `Problemas al ejecutar la operación, intente de nuevo ${err}`,
      });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM `users` WHERE `id_user` = ?";
  const idModified = [id];

  try {
    const sql = "SELECT * FROM `users` WHERE `id_user` = ?";
    const [rows] = await (await connection).query(sql, id);

    if (rows.length == 0) {
      return res.status(404).json({ message: "Usuario No Encontrado" });
    }

    const { image_name } = rows[0];

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: envConfig.AWS_BUCKET_NAME,
        Key: image_name,
      })
    );

    const [results] = await (await connection).execute(query, idModified);

    return res.status(200).json({ message: "Usuario Eliminado Exitosamente" });
  } catch (err) {
    return res
      .status(400)
      .json({
        message: `Problemas al ejecutar la operación, intente de nuevo ${err}`,
      });
  }
};

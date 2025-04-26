import mongoose from "mongoose"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand }  from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import userSchema from "../models/user.mongodb.model.js";
import bcrypt from "bcrypt";
import envConfig from '../env.config.js';

const User = mongoose.model('User', userSchema);
const s3Client = new S3Client({
    region: envConfig.AWS_REGION,
    credentials: {
        accessKeyId: envConfig.AWS_ACCESS_KEY,
        secretAccessKey: envConfig.AWS_SECRET_ACCESSKEY
    }
});

const { ObjectId } = mongoose.Types;

export const create = async(req, res) => {
    const { name, password, date_signup, description } = req.body;
    const saltRounds = 10;
        
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const dateWithUtc = new Date(date_signup);

    try {
        const filename = `${crypto.randomUUID()}_${req?.file?.originalname}`;
        await s3Client.send(new PutObjectCommand({
            Bucket: envConfig.AWS_BUCKET_NAME,
            Key: filename,
            Body: req.file.buffer
        }));

        const newUser = new User({
            name: name,
            password: passwordHash,
            date_signup: dateWithUtc,
            image_name:  filename,
            description: description
        });

        await newUser.save();

        return res.status(201).json({message: "Usuario Registrado Exitosamente"});
    } catch (err) {
        return res.status(400).json({message: `Problemas al ejecutar la operación, intente de nuevo ${err}`})
    }
}

export const getById = async(req, res) => {
    const { id } = req.params;

    const userFound = await User.findById(id).exec();

    if(!userFound) return res.status(404).json({message: "Usuario No Encontrado"});

    const { _id, name, password, date_signup, image_name, description } = userFound;

    try {
        const command = new GetObjectCommand({
            Bucket: envConfig.AWS_BUCKET_NAME,
            Key: image_name
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        const dataWithUrl = {
            _id,
            name, 
            password,
            date_signup,
            description,
            image_url: url
        }
        return res.status(200).json(dataWithUrl);
    } catch (error) {
        return res.status(400).json({message: `Problemas al ejecutar la operación, intente de nuevo ${error}`})
    }
}

export const getAll = async(req, res) => {
    try {
        const users = await User.find({});

        const newData = [];

        for(let i=0; i < users.length; i++){
            const {image_name, _id, description, date_signup, name, password} = users[i];
            const command = new GetObjectCommand({
                Bucket: envConfig.AWS_BUCKET_NAME,
                Key: image_name
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

            const dataWithUrl = {
                _id,
                name,
                password,
                date_signup,
                description,
                image_url: url
            }

            newData.push(dataWithUrl);
        }

        return res.status(200).json(newData);
    } catch (error) {
        return res.status(400).json({message: `Problemas al ejecutar la operación, intente de nuevo ${error}`})
    }
}

export const update = async(req, res) => {
    const { id } = req.params;
    const { name, password, date_signup, description } = req.body;

    const updateData = {};

    if(name) updateData.name = name;
    if(password) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        updateData.password = password;
    };
    if(date_signup) updateData.date_signup = date_signup;
    if(description) updateData.description = description;
    if(req.file){
        try {
            const userFound = await User.findById(id).exec();
            if(!userFound) return res.status(404).json({message: "Usuario No Encontrado"});
            
            const {image_name} = userFound;

            await s3Client.send(new PutObjectCommand({
                Bucket: envConfig.AWS_BUCKET_NAME,
                Key: image_name,
                Body: req.file.buffer
            }));
        } catch (err) {
            return res.status(400).json({message: `Error al actualizar la imagen ${err}`});
        }
    }

    const newId = new ObjectId(id);

    const userUpdated = await User.updateOne({_id: newId}, updateData);

    // if(!userUpdated.matchedCount) return res.status(404).json({message: "User Not Found"});
    if(userUpdated.modifiedCount) return res.status(200).json({message: "Usuario Actualizado Exitosamente"});
}

export const remove = async(req, res) => {
    const { id } = req.params;

    try {
        const userFound = await User.findById(id).exec();
        if(!userFound) return res.status(404).json({message: "Usuario No Encontrado"});
        
        const {image_name} = userFound;

        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: envConfig.AWS_BUCKET_NAME,
                Key: image_name
            })
        )

        const userRemoved = await User.deleteOne({_id: new ObjectId(id)});

        return res.status(200).json({message: "User Eliminado Exitosamente"});
    } catch (err) {
        return res.status(400).json({message: `Problemas al ejecutar la operación, intente de nuevo ${err}`})
    }
}
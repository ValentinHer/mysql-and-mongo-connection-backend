import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    date_signup: { type: Date, required: true },
    image_name: { type: String, required: true },
    description: { type: String, required: true } 
})

export default userSchema;
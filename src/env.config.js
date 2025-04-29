import Joi from "joi";

const fileSchema = Joi.object({
    RELATIONAL: Joi.string().required(),
    NOTRELATIONAL: Joi.string().required(),
    SERVER_PORT: Joi.number().positive().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
    AWS_ACCESSKEY: Joi.string().required(),
    AWS_SECRETACCESSKEY: Joi.string().required(),
    AWS_REGION: Joi.string().required()
})

const {value: envVar, error} = fileSchema.validate({
    RELATIONAL: process.env.RELATIONAL,
    NOTRELATIONAL: process.env.NOTRELATIONAL,
    SERVER_PORT: process.env.SERVER_PORT,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_ACCESSKEY: process.env.AWS_ACCESSKEY,
    AWS_SECRETACCESSKEY: process.env.AWS_SECRETACCESSKEY,
    AWS_REGION: process.env.AWS_REGION
});

if(error) throw new Error(`Error to validate EnvConfig file: ${error}`);

const envConfig = {
    URL_DB_RELATIONAL: envVar.RELATIONAL,
    URL_DB_NOTRELATIONAL: envVar.NOTRELATIONAL,
    SERVER_PORT: envVar.SERVER_PORT,
    AWS_BUCKET_NAME: envVar.AWS_BUCKET_NAME,
    AWS_ACCESS_KEY: envVar.AWS_ACCESSKEY,
    AWS_SECRET_ACCESSKEY: envVar.AWS_SECRETACCESSKEY,
    AWS_REGION: envVar.AWS_REGION
}

export default envConfig;
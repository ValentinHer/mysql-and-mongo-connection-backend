import swaggerJSDoc from "swagger-jsdoc";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const filenameRoute = fileURLToPath(import.meta.url);
const dirnameActual = dirname(filenameRoute);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'My API Docu',
            description: 'API to manage users in MySql and MongoDB'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
        tags: [
            {
                name: 'MySql - Users'
            },
            {
                name: 'MongoDB - Users'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID del usuario'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre del usuario'
                        },
                        password: {
                            type: 'string',
                            description: 'Contraseña del usuario'
                        },
                        date_signup: {
                            type: 'string',
                            description: 'Fecha de registro'
                        },
                        image_name: {
                            type: 'string',
                            description: 'Nombre la imagen'
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción del usuario'
                        }
                    }
                }
            }
        }
    },
    apis: [join(dirnameActual,'..','routes', '*.js')]
}

export const swaggerSpec = swaggerJSDoc(options);
# API de Administración de usuarios en MySql y MongoDB

## Descripción
API para administrar usuarios en MySql y MongoDB.

Si todavia no tienes el FrontEnd del proyecto, clonalo desde el siguiente repositorio: [mysql-and-mongo-connection-frontend
](https://github.com/ValentinHer/mysql-and-mongo-connection-frontend).

## Configuración

1. **Clona o descarga el archivo `.zip` de este repositorio**.
   - Instala las dependencias del proyecto:

        ```
        npm install
        ```

1. **Crear un bucket en AWS para realizar la carga de imágenes**.

   - Dentro de AWS, en la sección S3 crea un bucket con las configuraciones por defecto (solo añade el nombre que tendrá el bucket), una vez creado copia la región donde se encuentre el bucket junto con el nombre del bucket y añadeselo al archivo `.env`, ejemplo: **AWS_REGION=us-east-1**.

   - En la sección IAM crea una nueva política. 
        - Añade las siguientes acciones para el servicio S3 (al crear la política, esta sección para asignar permisos se muestra como **Acciones permitido**):
            * GetObject
            * DeleteObject
            * PutObject
            * ListBucket

        - Al momento de crear la política, en la sección **Recursos**, especifica los recursos para los que las acciones anteriores se permitiran.
          - En bucket, seleciona **Agregar ARN** y agrega el nombre del bucket creado en S3.
          - En object, selecciona **Agregar ARN**, agrega el nombre del bucket creado en S3, pero en este caso para el campo **Resource object name** selecciona la casilla **Cualquier object name** (esto con la finalidad de acceder a cualquier archivo almacenado dentro del bucket).

        - Como paso final añade un nombre a la política y creala.

   - Siguiendo en la sección IAM crea un nuevo usuario (en la sección **Personas**) y añadele la política antes creada.
        - Añade un nombre al usuario.
        - En la sección **Establecer permisos**, escoge la opción **Adjuntar políticas directamente** y añade la política antes creada.
        - Crea el usuario.

   - Crear claves de acceso para el usuario.
        - Una vez completado el paso anterior accedemos al usuario creado.
        - En la sección **Credenciales de seguridad** buscamos **Claves de acceso**, una vez ubicado crea una clave de acceso.
            - En el Paso 1, en Caso de uso selecciona: **Código local**.
            - En el Paso 2, agrega una descripcion para la clave de acceso.
            - Copia la **Clave de acceso** y la **Clave de acceso secreta** y añadeselo al archivo `.env`.

1. **Crear base de datos MySql y Mongo**.
   - Si cuentas con Docker, puedes utilizar el archivo `docker-compose.yml` que se encuentra en el proyecto y dejar las URLs de las bases de datos en el archivo `.env` tal como estan, de otro modo dirígete al siguiente punto.
        - Desde la terminal dirigete a la ruta donde se encuentre el archivo **docker-compose**, y ejecuta los siguientes comandos:
        
            Iniciar Servicios
            ```
            docker compose up -d
            ``` 

            Finalizar Servicios
            ```
            docker compose down
            ``` 
   - Crea una base de datos MySql local, y añade las credenciales de acceso al archivo `.env`.
   - Si cuentas con MongoDB Compass crea una base de datos Mongo local o crea una en la nube con MongoDB Atlas y añade las credenciales de acceso al archivo `.env`.

## Inicialización

- **Inicializa el proyecto**.

    ```
    npm run dev
    ```

## Documentación de API

- Entra al siguiente link una vez inicializado el proyecto para visualizar todas las operaciones disponibles en la API: 
`http://localhost:3000`
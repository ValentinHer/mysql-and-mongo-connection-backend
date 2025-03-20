export const userModel = `CREATE TABLE IF NOT EXISTS users(
    id_user INT AUTO_INCREMENT PRIMARY KEy,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    date_signup TIMESTAMP NOT NULL,
    image_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL)`
import dotenv from 'dotenv'
dotenv.config();

export const {
    PORT,
    DB_URL,
    JWT_SECRET,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_BUCKET
} = process.env
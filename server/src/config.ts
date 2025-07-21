//AWS S3 config
export const BUCKET_NAME: string = process.env.BUCKET_NAME as string;
export const PRESIGNED_URL_EXPIRY_TIME: number | undefined = Number(process.env.PRESIGNED_URL_EXPIRY_TIME) // in seconds
export const S3_BUCKET_REGION: string = process.env.S3_BUCKET_REGION as string
export const S3_ACCESS_KEY_ID: string = process.env.S3_ACCESS_KEY_ID as string
export const S3_SECRET_ACCESS_KEY: string = process.env.S3_SECRET_ACCESS_KEY as string

//jwt config
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string
export const JWT_EXPIRY_TIME: number = Number(process.env.JWT_EXPIRY_TIME) // in days

//postgress DB config
export const POSTGRES_DB_USER: string = process.env.POSTGRES_DB_USER as string
export const POSTGRES_DB_HOST: string = process.env.POSTGRES_DB_HOST as string
export const POSTGRES_DB_NAME: string = process.env.POSTGRES_DB_NAME as string
export const POSTGRES_DB_PASSWORD: string = process.env.POSTGRES_DB_PASSWORD as string
export const POSTGRES_DB_PORT: number = Number(process.env.POSTGRES_DB_PORT)

//mongoDB config
export const MONGODB_URL: string = process.env.MONGODB_URL as string

//redis config
export const RATE_LIMIT: number = Number(process.env.RATE_LIMIT)
export const RATE_LIMIT_WINDOW_IN_SECONDS: number = Number(process.env.RATE_LIMIT_WINDOW_IN_SECONDS)
export const REDIS_HOST: string = process.env.REDIS_HOST as string
export const REDIS_PORT: number = Number(process.env.REDIS_PORT);

//server config
export const PORT: number = Number(process.env.PORT)
export const MAX_START_RETRIES: number = Number(process.env.MAX_START_RETRIES);
export const START_RETRY_DELAY_MS: number = Number(process.env.START_RETRY_DELAY_MS); // in milliseconds
//AWS S3 config
export const BUCKET_NAME: string = process.env.BUCKET_NAME as string;
export const PRESIGNED_URL_EXPIRY_TIME: number | undefined = Number(process.env.PRESIGNED_URL_EXPIRY_TIME)
export const S3_BUCKET_REGION: string = process.env.S3_BUCKET_REGION as string
export const S3_ACCESS_KEY_ID: string = process.env.S3_ACCESS_KEY_ID as string
export const S3_SECRET_ACCESS_KEY: string = process.env.S3_SECRET_ACCESS_KEY as string

//jwt config
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string
export const JWT_EXPIRY_TIME: number = Number(process.env.JWT_EXPIRY_TIME)

//postgress DB config
export const DB_USER: string = process.env.DB_USER as string
export const DB_HOST: string = process.env.DB_HOST as string
export const DB_NAME: string = process.env.DB_NAME as string
export const DB_PASSWORD: string = process.env.DB_PASSWORD as string
export const DB_PORT: string = process.env.DB_PORT as string

//redis config
export const RATE_LIMIT: number = Number(process.env.RATE_LIMIT)
export const RATE_LIMIT_WINDOW_IN_SECONDS: number = Number(process.env.RATE_LIMIT_WINDOW_IN_SECONDS)

//server config
export const PORT: number = Number(process.env.PORT)
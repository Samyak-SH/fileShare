export const BUCKET_NAME: string = process.env.BUCKET_NAME as string;
export const PRESIGNED_URL_EXPIRY_TIME: number | undefined = Number(process.env.PRESIGNED_URL_EXPIRY_TIME)
export const S3_BUCKET_REGION: string = process.env.S3_BUCKET_REGION as string
export const S3_ACCESS_KEY_ID: string = process.env.S3_ACCESS_KEY_ID as string
export const S3_SECRET_ACCESS_KEY: string = process.env.S3_SECRET_ACCESS_KEY as string
export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string
export const JWT_EXPIRY_TIME: number = Number(process.env.JWT_EXPIRY_TIME)
export const DB_HOST: string = process.env.DB_HOST as string
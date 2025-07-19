import { Response } from "express";
import { AuthorizedRequeset } from "../types/user"
import { uploadedFile, file, updatedFile } from "../types/file";
import { createFile, getUserFiles, updateFile } from "../model/fileModel";
import { GetObjectCommand, PutObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { S3_BUCKET_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, PRESIGNED_URL_EXPIRY_TIME, BUCKET_NAME } from "../config"

const s3Client: S3Client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY as string
    }
})

export async function getAllFiles(req: AuthorizedRequeset, res: Response) {
    console.log("getting all file for ", req.user.id);
    try {
        const result: file[] = await getUserFiles(req.user.id)
        if (result.length !== 0) {
            console.log("result ", result);
            return res.status(200).json({ files: result });
        }
        console.log("no files found");
        return res.status(200).json({ message: "no files found" })

    } catch (err) {
        console.log("Error getting all files of user", err);
        return res.status(500).json({ message: "Failed getting all files" })
    }
}

export async function updateFileDetails(req: AuthorizedRequeset, res: Response) {
    try {
        const upf: updatedFile = {
            fid: req.body.fid,
            updatedName: req.body.name,
            updatedPath: req.body.path,
        }
        console.log("filed that came for udpate, ", upf);
        await updateFile(upf);
        return res.status(200).send({ message: "sucess" });
    } catch (err) {
        console.log("Failed to update file details ", err);
        return res.status(500).json({ message: "Failed to update file details" });;
    }
}

export async function uploadFile(req: AuthorizedRequeset, res: Response) {
    try {
        const fileType: string = req.body.type;
        const fid: string = uuidv4();
        const s3_key: string = `${req.user.id}/${fid}`
        console.log("generated s3_key while uploading ", s3_key);
        const presignedURL: string | null = await generatePutObjectURL(s3_key, fileType);
        if (presignedURL) {
            return res.status(200).json({ presignedURL: presignedURL , fid:fid});
        }
        return res.status(500).json({ message: "Failed to generate presignedURL file" });
    } catch (err) {
        console.error("failed to upload file", err);
        return res.status(500).json({ message: "Failed to generate presignedURL file" })
    }
}

export async function uploadFileSucess(req: AuthorizedRequeset, res: Response) {
    try {
        const uf: file = {
            uid: req.user.id,
            name: `${req.body.originalName}-${Date.now()}`,
            customName: req.body.customName,
            path: req.body.path,
            type: req.body.type,
            size: `${req.body.size}`,
            fid: req.body.fid
        }
        const fid: string = await createFile(uf, req.user.id);
        console.log(`updated metadata of file ${fid} sucess`);
    }
    catch (err) {
        console.error("failed to update metadata ", err);
        await deleteObject(req.body.fid);
        return res.status(500).json({ message: "Failed to upload file" });
    }
}

export async function viewFile(req: AuthorizedRequeset, res: Response) {
    try {
        const s3_key: string = `${req.user.id}/${req.body.fid}`
        console.log("generated s3_key for viewFile ", s3_key);
        const presignedURL: string | null = await generateGetObjectURL(s3_key)

        if (!presignedURL) return res.status(500).json({ message: "error generating presigned url" });

        return res.status(200).json({ presignedURL: presignedURL })
    } catch (err) {
        console.error("failed to generate viewFile url", err);
    }
}

async function generatePutObjectURL(fileS3_Key: string, FileContentType: string): Promise<string | null> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileS3_Key,
        ContentType: FileContentType
    })
    const url: string = await getSignedUrl(s3Client, command, { expiresIn: PRESIGNED_URL_EXPIRY_TIME })
    return url;
}

async function generateGetObjectURL(fileS3_key: string): Promise<string | null> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileS3_key
    })
    const url: string = await getSignedUrl(s3Client, command);
    return url
}

async function deleteObject(fileS3_key: string) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileS3_key
    })
    try {
        await s3Client.send(command);
        console.log(`Deleted ${fileS3_key} from ${BUCKET_NAME}`);
    } catch (err) {
        console.error(`failed to delete ${fileS3_key} from ${BUCKET_NAME} `, err);
    }
}
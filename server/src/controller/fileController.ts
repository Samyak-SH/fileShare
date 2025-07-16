import { Response} from "express";
import {AuthorizedRequeset} from "../types/user"
import { uploadedFile, file, updatedFile } from "../types/file";
import { createFile, getUserFiles, updateFile } from "../model/fileModel";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {S3_BUCKET_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, PRESIGNED_URL_EXPIRY_TIME, BUCKET_NAME} from "../config"

const s3Client = new S3Client({
    region : S3_BUCKET_REGION,
    credentials : {
        accessKeyId:S3_ACCESS_KEY_ID,
        secretAccessKey : S3_SECRET_ACCESS_KEY as string 
    }
})

export async function getAllFiles(req:AuthorizedRequeset, res:Response){
    // console.log("getting all file for ", req.user.id);
    try{
        const result:file[] = await getUserFiles(req.user.id)
        if(result.length!==0){
            // console.log("result ", result);
            return res.status(200).json({files : result});
        }
        // console.log("no files found");
        return res.status(404).json({message : "no files found"})

    }catch(err){
        // console.log("Error getting all files of user", err);
        return res.status(500).json({message:"Failed getting all files"})
    }
}

export async function updateFileDetails(req:AuthorizedRequeset, res:Response){
    try{
        const upf:updatedFile = {
            fid: req.body.fid,
            updatedName : req.body.name,
            updatedPath : req.body.path,
        }
        // console.log("filed that came for udpate, ", upf);
        await updateFile(upf);
        return res.status(200).send({message : "sucess"});
    }catch(err){
        // console.log("Failed to update file details ", err);
        return res.status(500).json({message : "Failed to update file details"});;
    }
}

export async function uploadFile(req:AuthorizedRequeset, res:Response){
    try{
        const uf:uploadedFile = {
            name : `${req.body.originalName}-${Date.now()}`,
            customName : req.body.customName,
            path : req.body.path,
            type : req.body.type,
            size : `${req.body.size}`,
            s3_key : `${req.user.id}/${req.body.customName}` //userid/customName(of file)
        }
        await createFile(uf, req.user.id);
        const url:string|null = await generatePutObjectURL(uf.s3_key, uf.type);
        if(url){
            return res.status(200).json({presignedURL : url});
        }
        return res.status(500).json({message : "Failed to upload file"});
    }catch(err){
        console.error("failed to upload file", err);
        return res.status(500).json("Failed to upload file")
    }
}

async function generatePutObjectURL(fileS3_Key:string, FileContentType:string):Promise<string|null>{
    const command = new PutObjectCommand({
        Bucket : BUCKET_NAME,
        Key : fileS3_Key,
        ContentType : FileContentType
    })
    const url:string = await getSignedUrl(s3Client, command, {expiresIn : PRESIGNED_URL_EXPIRY_TIME})
    return url;
}
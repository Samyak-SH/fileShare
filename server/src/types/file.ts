export interface uploadedFile {
    name: string,
    customName: string,
    path: string
    type: string,
    size: string,
}

export interface updatedFile{
    fid : string,
    updatedName : string,
    updatedPath : string,
}

export interface file extends uploadedFile{
    uid : string
    fid : string
}
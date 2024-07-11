import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from "src/firebase/firebase-config";
import { FileInterface } from "src/interfaces/fileInterface";
import { StoreBucketType } from "src/types/StoreBucketType";
import { v4 as uuidv4 } from 'uuid';



export const uploadFile = async (storeBucket: StoreBucketType, file: any, previousFile: string = null, subFolder: string = null): Promise<FileInterface> => {

    const uuid = uuidv4()
    const extencion = (file.name as string).substring((file.name as string).lastIndexOf('.'))
    const newFilename = `${uuid}${extencion}`
    const folder = (subFolder === null) ? '' : subFolder
    const storageRef = await ref(firebaseStorage, `/${storeBucket}/${folder}/${newFilename}`)

    const uploadTask = await uploadBytesResumable(storageRef, file)
    const url = await getDownloadURL(storageRef)

    //si trae archivo anterior se elimina
    if (previousFile !== null) {
        await deleteFile(storeBucket, previousFile, folder)
    }

    return {
        nombre: newFilename,
        fullPath: url
    }
}

export const deleteFile = async (storeBucket: StoreBucketType, file: string, subFolder: string = null): Promise<any> => {
    const folder = (subFolder === null) ? '' : subFolder
    if (file.length === 0 || file === null) return
    const fileRef   = await ref(firebaseStorage, `/${storeBucket}/${folder}/${file}`)
    const response  = await deleteObject(fileRef)
    return response
}

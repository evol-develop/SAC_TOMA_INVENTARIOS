
import { FirebaseApp, FirebaseDB } from "src/firebase/firebase-config"
import { ResponseInterface } from "src/interfaces/responseInterface"
import { createItem, getItemById, getItemsByCondition } from './genericApi';
import { entidades } from "src/config/entities"
import { UsuarioAdicionalesInterface } from "src/interfaces/UsuarioAdicionalesInterface"
import { RolestType } from "src/interfaces/userInterface";
import { WhereFilterOp, collection, getDocs, query, where } from "firebase/firestore";
import { EmpresaInterface } from "src/interfaces/empresaInterface";
import { Permisos, UserInterface } from 'src/interfaces/userInterface';
import { AuthState } from "src/contexts/Auth/AuthContext";



export const crearUsuario = async (email: string): Promise<ResponseInterface> => {
    try {
        const userResponse = await FirebaseApp.auth().createUserWithEmailAndPassword(email, email)
        // await userResponse.user.sendEmailVerification()
        // await FirebaseApp.auth().sendPasswordResetEmail(email)

        // const usuario: UsuarioAdicionalesInterface = {
        //     idUsuario: userResponse.user.uid,
        //     idEmpresa: empresaId,
        //     nombre: '',
        //     apellido: '',
        //     isActive: true,
        //     telefono: '0000000000',
        //     userRol: rol,
        //     photoURL: userResponse.user.photoURL,
        //     // correo: userResponse.user.email,
        //     coverPhotoURL: '',
        //     photoNameFile:'',
        //     coverPhotoNameFile:''
            
        // }

        // const infoAdicional = await createItem(entidades.USUARIOS, usuario)
        return {
            isSuccess: true,
            message: `Se genero la cuenta con el correo: ${email} `,
            code: 100,
            result: {
                // user: usuario,
                // infoAdicional: infoAdicional
            }
        }

    } catch (error) {
        return {
            isSuccess: false,
            message: `El correo: ${email} ya esta relacionado a una cuenta existente. Favor de verificar`,
            code: 100,
        }
    }
}


export const borraUsuario = async (): Promise<ResponseInterface> => {

    const user = await FirebaseApp.auth().currentUser
    user.delete().then(() => {
        //se borro
    }).catch((error) => {
        return {
            isSuccess: false,
            message: `Ocurrio un error al borrar ${user.email} `,
            code: 100,
        }
    })
    return {
        isSuccess: true,
        message: `Se borro correctamente la cuenta de usuario: ${user.email} `,
        code: 100,
    }

}

export const getUserInfoAdicional = async (idUsuario: string): Promise<ResponseInterface> => {
       
    const aux = await getItemsByCondition(entidades.USUARIOS, 'idUsuario', '==', idUsuario)
    const infoAdicional = aux[0] as UsuarioAdicionalesInterface
    const idEmpresa = infoAdicional ? infoAdicional.idEmpresa : ''
    const infoEmpresa = await getItemById(entidades.EMPRESAS, idEmpresa) 

    return {
        isSuccess: true,
        message: `informacion Adicional `,
        code: 100,
        result: {
            infoAdicional,
            infoEmpresa
        }
    }
}


export const getUsuariosByEmpresa = async (idEmpresa: string): Promise<ResponseInterface> => {

    const usuarios = await getItemsByCondition(entidades.USUARIOS, 'idEmpresa', '==', idEmpresa)

    return {
        isSuccess: true,
        message: `Usuarios por Empresa `,
        code: 100,
        result: usuarios
    }
}



export const getDataCurrentUser = async ():Promise<ResponseInterface> => {

    let  user = await FirebaseApp.auth().currentUser
    if (!user ){
       const authState =  JSON.parse(localStorage.getItem('AuthState')) 
       user = authState.user.multiFactor.user
    }
    const infoAdicional = (await getUserInfoAdicional(user.uid)).result
    // const userData: UserInterface = {
    //     ...user,
    //     permisos: null,
    //     // infoAdicional: infoAdicional
        
    // }

    return {
        isSuccess: true,
        message: `Usuarios por Empresa `,
        code: 100,
         //result:userData
    }

}



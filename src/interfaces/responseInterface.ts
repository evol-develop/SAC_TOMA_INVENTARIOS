


// Generated by https://quicktype.io

import { Permisos } from "./userInterface";
import { EmpresaInterface } from "./empresaInterface";

export interface ResponseInterface {
 
  isSuccess: boolean;
  message: string;
  code: number;
  result?: any;
}

export interface Result {
  Token: string;
  user: User;
  Expiracion: string;
  by: string;
}


// user response
export interface User {
  userName?: string;
  fullName?: string;
  userRol?: string
  avatar?: string;  
  permisos?:Permisos
  email: string;
  password: string;
  id_rol: number;
  id_empresa?:number;
  id_sucursal?:number;
}

//UsersResponse




// reupera info de usuario
export interface userResult {
  id_usuario: string;
  email: string;
  nombre: string;
  apellido: string; 
  fullName: string;
  userRoll: string;
  avatar: string;  
  permisos:Permisos  
  expiration:  string;
  activo: boolean
}




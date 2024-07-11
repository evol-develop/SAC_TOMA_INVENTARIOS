
import { EmpresaInterface } from "./empresaInterface";
import { sucursalInterface } from "./sucursalInterface";
// export interface UserInterface extends FirebaseUser {
//   permisos: Permisos
//   infoAdicional: UsuarioAdicionalesInterface
// }

export interface UserInterface {
  username: string;
  nombre: string;
  avatar: string;
  email: string;
  role: string;
  accessToken: string;
  permisos: Permisos
  expiration:  string;
  empresa: EmpresaInterface
  sucursal?: sucursalInterface 
}

export interface Permisos {
  id: number;
  catalogos: boolean;
  modifica: boolean;
  elimina: boolean;
}

export type RolestType = | 'SUPER-ADMIN' | 'ADMINISTRADOR' | 'USUARIO'

export interface EvolRolInterface {
  id: number;
  nombre: string;
  empresa: EmpresaInterface;
  empresaId: number;
  isActive: boolean;
}

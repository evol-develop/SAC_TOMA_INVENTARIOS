import { EmpresaInterface } from "./empresaInterface";
import { ProductosEmpresa } from "./productosInterface";
import { User } from "./responseInterface";
import { sucursalInterface } from "./sucursalInterface";

export interface respuestaAutenticacion {
    token: string;
    expiracion: Date;
    empresa: EmpresaInterface;
    usuario: User,
    empresaProducto?: ProductosEmpresa,
    sucursal? : sucursalInterface
  }
  
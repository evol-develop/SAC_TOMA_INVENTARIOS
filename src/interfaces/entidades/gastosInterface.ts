import { EmpresaInterface } from 'src/interfaces/empresaInterface';
// import { ObrasInterface } from 'src/interfaces/entidades/obrasInterface';
// import { ConceptosGastosInterface } from 'src/interfaces/entidades/conceptosGastosInterface';
// import { ColaboradoresInterface } from './colaboradoresInterface';
import { User } from '../responseInterface';
// import { FormaPagoInterface } from './formasPagooRepository';
// import { ProveedorInterface } from './proveedorInterface';
// import { InsumosGastosInterface } from './insumosGastos';

export default interface GastosInterface {
    id: number
    empresa?: EmpresaInterface
    empresaId: number
    // obras?: ObrasInterface
    obrasId: number
    // concepto?: ConceptosGastosInterface
    conceptoId: number
    autorizado: boolean
    cantidad: number
    precio: number
    comentarios: string
    urlComprobante: string
    fechaRegistro: Date
    importe?: number
    // colaborador?: ColaboradoresInterface
    colaboradorId: number
    nombreComprobante?: string
    usuarioAutoriza?: User
    fechaAutorizacion?: Date
    // formaPago?: FormaPagoInterface
    formaPagoId: number
    // proveedor?: ProveedorInterface
    proveedorId: number
    descripcion: string
    // insumos: InsumosGastosInterface[],
    facturaFiscal: boolean
}


export interface GastosRequestInterface {
    id: number
    empresa?: EmpresaInterface
    empresaId: number
    // obras?: ObrasInterface
    obrasId: number
    // concepto?: ConceptosGastosInterface
    conceptoId: number
    autorizado: boolean
    cantidad: number
    precio: number
    comentarios: string
    urlComprobante: string
    fechaRegistro: Date
    importe?: number
    // colaborador?: ColaboradoresInterface
    colaboradorId: number
    nombreComprobante?: string
    usuarioAutoriza?: User
    fechaAutorizacion?: Date
    // formaPago?: FormaPagoInterface
    formaPagoId: number
    // proveedor?: ProveedorInterface
    proveedorId: number
    descripcion: string
    // insumos: InsumosGastosInterface[]
}
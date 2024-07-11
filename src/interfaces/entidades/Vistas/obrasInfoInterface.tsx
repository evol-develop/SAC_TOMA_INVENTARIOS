// import { ClienteInterface } from "../clientesInterfce";
// import { AsentamientoObraInterface } from "../estadosInterface";
// import { TiposObraType } from "../obrasInterface";

export interface ObrasInfoInterface {
    id: number,
    nombre: string,
    descripcion: string,
    // idTipoObra: TiposObraType,
    idTipoObra: number,
    presupuesto: number,
    gastado: number,
    saldoObra: number,
    fechaInicio: Date,
    fechaFin: Date,
    // Asentamiento: AsentamientoObraInterface,
    Asentamiento: any,
    ingresos: number,
    disponibleIngresos: number,
}

export interface ObrasInfoDetailsInterface {
    id: number,
    nombre: string,
    descripcion: string,
    // idTipoObra: TiposObraType,
    presupuesto: number,
    gastado: number,
    saldoObra: number,
    fechaInicio: Date,
    fechaFin: Date,
    // Asentamiento: AsentamientoObraInterface,
    ingresos: number,
    disponibleIngresos: number,
    cliente?: string,
    cienteId
}
import { EmpresaInterface } from "../empresaInterface"

export interface ConceptoIngresoInterface {
    id: number
    descripcion: string
    empresa: EmpresaInterface
}
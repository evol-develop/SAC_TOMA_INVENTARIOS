export interface GastosPorTipoByObraInterface {
    tipoGasto: string
    gastado: number
    semanas: gastadoPorSemana[]
}
export interface GastosPorTipoByObraInterfaceNew {
    tipoGastoId: number
    tipoGasto: string
    gastado: number
    semana1: string
    sumaSemana1: number
    semana2: string
    sumaSemana2: number
    semana3: string
    sumaSemana3: number
    semana4: string
    sumaSemana4: number

}

export interface gastadoPorSemana {
    descripcion: string
    ImporteGastado: number
}

export interface ChartDataInterface {
    name: string
    data: number[]
}
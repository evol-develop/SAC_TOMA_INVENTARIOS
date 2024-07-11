import { ResponseInterface } from "src/interfaces/responseInterface"
import { getItemsByCondition } from "./genericApi"
import { entidades } from "src/config/entities"



export const getTipoMedicion = async (idEmpresa: string): Promise<ResponseInterface> => {

    const result = await getItemsByCondition(entidades.TIPOS_MEDICION, 'idEmpresa', '==', idEmpresa)

    return {
        isSuccess: true,
        message: `Tipos de medicion `,
        code: 100,
        result: result
    }
}
export const getTramo = async (idEmpresa: string): Promise<ResponseInterface> => {

    const result = await getItemsByCondition(entidades.TRAMOS, 'idEmpresa', '==', idEmpresa)

    return {
        isSuccess: true,
        message: `Tramos `,
        code: 100,
        result: result
    }
}


export const getTramoById = async (idEmpresa: string, idTramo: string): Promise<ResponseInterface> => {
    
    const result = (await getItemsByCondition(entidades.TRAMOS, 'idEmpresa', '==', idEmpresa))
                    .filter(tramo => tramo.id == idTramo)

    return {
        isSuccess: true,
        message: `Tramos `,
        code: 100,
        result: result
    }
}
import { entidades } from "src/config/entities"
import { getSnapShotByCondition } from "./genericApi"


export const GetFasesByEmpresa = async (idEmpresa: string) => {

    const data = await getSnapShotByCondition(entidades.FASES, idEmpresa)
}
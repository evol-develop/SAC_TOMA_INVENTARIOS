

import { useAppSelector } from 'src/hooks/storeHooks'
import { RootState } from 'src/store/store'
import { CardResult, EncabezadoGrid, GridResult, PAGE_SLOT } from './config';
import { UsuarioAdicionalesInterface } from 'src/interfaces/UsuarioAdicionalesInterface'
import { ResultsCatalogo } from '../catalogos/catalogoGenerico/ResultCatalogo'








export const Results = () => {
    const itemState: UsuarioAdicionalesInterface[] = useAppSelector((state: RootState) => state.page.slots.USUARIOS) || []

    const filterProperties = ['nombre', 'apellido', 'email']
    const tabs = [
        {
            value: 'todos',
            label: 'Todos'
        },
        {
            value: 'true',
            label: 'Activos'
        },
        {
            value: 'false',
            label: 'Inactivos'
        },
    ]

    return (
        <ResultsCatalogo
            PAGE_SLOT={PAGE_SLOT} itemState={itemState} filterProperties={filterProperties}
            tabs={tabs} EncabezadoGrid={EncabezadoGrid} GridResult={GridResult} CardResult={CardResult}
        />

    )

}




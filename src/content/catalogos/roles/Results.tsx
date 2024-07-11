import { useAppSelector } from 'src/hooks/storeHooks'
import { RootState } from 'src/store/store'
import { CardResult, EncabezadoGrid, GridResult, PAGE_SLOT } from './config';
import { ResultsCatalogo } from '../catalogoGenerico/ResultCatalogo'
import { RolInterface } from 'src/interfaces/entidades/rolInterface';

export const Results = () => {
    const itemState: RolInterface[] = useAppSelector((state: RootState) => state.page.slots.ROLES) || []

    const filterProperties = ['nombre']
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


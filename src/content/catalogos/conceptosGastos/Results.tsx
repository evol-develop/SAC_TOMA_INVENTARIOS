import { useAppSelector } from 'src/hooks/storeHooks'
import { RootState } from 'src/store/store'
import { CardResult, EncabezadoGrid, GridResult, PAGE_SLOT } from './config';
import { ResultsCatalogo } from '../catalogoGenerico/ResultCatalogo'
// import { ConceptosGastosInterface } from 'src/interfaces/entidades/conceptosGastosInterface';

export const Results = () => {
    //const itemState: ConceptosGastosInterface[] = useAppSelector((state: RootState) => state.page.slots.CONCEPTOS_GASTOS) || []
    const itemState: any[] = useAppSelector((state: RootState) => state.page.slots.CONCEPTOS_GASTOS) || []

    const filterProperties = ['nombre', 'descripcion']
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


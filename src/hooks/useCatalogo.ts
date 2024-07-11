import { useState } from "react"

import { useSnackbar } from 'notistack'
import { usePage } from "./usePage"
import { deleteItemSlot, setDataModal, setIsOpenModal } from "src/store/slices/page"
import { deleteItem } from "src/api/genericApi"
import { Zoom } from '@mui/material'
import axios from "src/utils/axios"
import { ResponseInterface } from "src/interfaces/responseInterface"
import { useAppSelector } from "./storeHooks"
import { RootState } from "src/store/store"


// interface Props {
//     items: any,
//     query: string,
//     filters: any,
//     filterProperties: string[]
// }

const applyFilters = (items: any, query: string, filters: any, filterProperties: string[]) => {

    if (!items) {
        return []
    }

    return items ? items.filter((item) => {
        let matches = true
        if (query) {
            const properties = filterProperties
            let containsQuery = false

            properties.forEach((property) => {
                if (item[property].toLowerCase().includes(query.toLowerCase())) {
                    containsQuery = true
                }
            })



            if (filters.isExterno && item !== filters.isExterno) {
                matches = false
            }

            if (!containsQuery) {
                matches = false
            }
        }

        Object.keys(filters).forEach((key) => {
            if (filters[key] !== '') {
                const value = (filters[key] === 'true') ? true : false

                if (item[key] !== value) {
                    matches = false
                }
            }
        })
        return matches
    }) : null
}

const applyPagination = (items: any[], page: number, limit: number) => {
    return items.slice(page * limit, page * limit + limit)
}

export const useCatalogo = (pageSlot: string, itemState: any[], filterProperties: string[]) => {


    const [selectedItems, setSelectedItems] = useState([])
    const { enqueueSnackbar } = useSnackbar()
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState({ activo: '' })
    const filteredItems: any[] = applyFilters(itemState, query, filters, filterProperties)
    const paginatedItems: any[] = applyPagination(filteredItems, page, limit)
    const selectedBulkActions = selectedItems.length > 0
    const selectedSomeItems = selectedItems.length > 0 && selectedItems.length < itemState.length
    const selectedAllItems = selectedItems.length === itemState.length

    const [toggleView, setToggleView] = useState('table_view')
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
    const [itemToDelete, setItemToDelete] = useState({})

    const { dispatch } = usePage(pageSlot)





    const handleTabsChange = (_event: React.SyntheticEvent<Element, Event>, tabsValue: string) => {
        let value = ''
        
        if (tabsValue !== 'todos') {
            value = tabsValue
        }

        setFilters((prevFilters: any) => ({
            ...prevFilters,
            activo: value     
        }))

        setSelectedItems([])
    }


    const handleQueryChange = (event: any) => {
        event.persist()
        setQuery(event.target.value!)
    }

    const handleSelectAllItem = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedItems(event.target.checked ? itemState.map((item) => item.id) : [])
    }

    const handleSelectOneItem = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (!selectedItems.includes(id)) {
            setSelectedItems((prevSelected) => [...prevSelected, id])
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((id) => id !== id)
            )
        }
    }

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage)
    }

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value))
    }

    const handleViewOrientation = (_event, newValue) => {
        setToggleView(newValue)
    }


    const handleConfirmDelete = (item: any) => {
        setItemToDelete(item)
        setOpenConfirmDelete(true)
    }

    const closeConfirmDelete = () => {
        setItemToDelete({})
        setOpenConfirmDelete(false)
    }

    const endPoint = useAppSelector((state: RootState) => state.page.slots.ENDPOINTDELETE) || []

    const handleDeleteCompleted = async () => {
        console.log('itemToDelete', itemToDelete['id'])
        try {
            const response = await axios.post<ResponseInterface>(`api/${endPoint}/${itemToDelete['id']}`)


            //const response = deleteItem(pageSlot, itemToDelete['id'])

            const message = response.data.message;
            const isSuccess = response.data.isSuccess;
      
            if (isSuccess) {
                dispatch(deleteItemSlot({ state: pageSlot, data: itemToDelete['id'] }))
                enqueueSnackbar('El Registro ha sido eliminado con exito', {
                    variant: 'warning',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                })
            }
            else {
                enqueueSnackbar(message, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    TransitionComponent: Zoom
                })

            }
        } catch (err) {
            console.error(err)

        }
        setOpenConfirmDelete(false)
    }

    const handleEditItem = (item: any) => {
        dispatch(setIsOpenModal(true))  // open modal
        dispatch(setDataModal(item))
    }

    const handleEditCompleted = async () => {
    }




    return {
        selectedItems, setSelectedItems, enqueueSnackbar, page, setPage,
        limit, setLimit, query, setQuery, filters, setFilters, filteredItems,
        paginatedItems, selectedBulkActions, selectedSomeItems, selectedAllItems,
        toggleView, setToggleView, openConfirmDelete, setOpenConfirmDelete,
        itemToDelete, setItemToDelete,
        handleTabsChange, handleQueryChange, handleSelectAllItem,handleSelectOneItem,
        handlePageChange,handleLimitChange,handleViewOrientation,handleConfirmDelete,
        closeConfirmDelete,handleDeleteCompleted,handleEditItem,handleEditCompleted
    }

}

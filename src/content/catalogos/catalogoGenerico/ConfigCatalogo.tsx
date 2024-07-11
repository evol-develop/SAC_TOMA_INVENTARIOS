
import React from 'react'

import Label from 'src/components/Label';


export interface PropsResults {
  paginatedItems: any[],
  selectedItems: any[],
  filteredItems: any[],
  selectedAllItems: boolean,
  selectedSomeItems: boolean,
  selectedBulkActions: boolean,
  page: number,
  limit: number,
  query: string,
  busquedaPor: string,
  entidad: string,
  handleSelectAllItem: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSelectOneItem: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void,
  handleConfirmDelete: (item: any) => void,
  handlePageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void,
  handleLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleEditCompleted: (item: any) => void,
  handleEditItem: (Item: any) => void,
  handleQueryChange: (event: any) => void,
  EncabezadoGrid?: () => JSX.Element, 
  GridResult?: (key: any, item: any, isItemSelected: boolean, handleEditItem: () => void, handleConfirmDelete: () => void) => JSX.Element,
  CardResult?: (key: any, item: any, isItemSelected: boolean) => JSX.Element
}


// interface PropsResults {
//     paginatedItems: any[],
//     selectedItems: any[],
//     filteredItems: any[],
//     selectedAllItems: boolean,
//     selectedSomeItems: boolean,
//     page: number,
//     limit: number,
//     handleSelectAllItem: (event: React.ChangeEvent<HTMLInputElement>) => void,
//     handleSelectOneItem: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void,
//     handleConfirmDelete: (item: EmpresaInterface) => void,
//     handlePageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void,
//     handleLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
//     handleEditCompleted: (item: EmpresaInterface) => void,
//     handleEditItem: (Item: EmpresaInterface) => void,
// }


export const getItemActiveLabel = (active: boolean) => {
  return active ? <Label color={'success'}> {'Activo'}</Label> : <Label color={'error'}> {'Inactivo'}</Label>
}



export const getUserRoleLabel = (userRole) => {  
  const rol = (userRole == 'SuperAdmin')?'SuperAdmin':userRole
  const map = {          
    Usuario: {
      text: 'Usuario',
      color: 'info'
    },
    Administrador: {
      text: 'Administrador',
      color: 'warning'
    },
    SuperAdmin: {
      text: 'Super-Admin',
      color: 'error'
    }
  }
  if (userRole === '') {
    return <Label color={'error'}> {'-'}</Label>
  }    
  
  const { text, color } = map[rol]  
  return <Label color={color}>{text}</Label>
}



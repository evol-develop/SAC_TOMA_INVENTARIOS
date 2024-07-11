import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import {
    Box,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, Tooltip, Typography
} from '@mui/material';
import { useLocation } from 'react-router-dom';

import { EmpresaInterface } from 'src/interfaces/empresaInterface';
import { getItemActiveLabel } from '../catalogoGenerico/ConfigCatalogo';

// <T extends Object>(formulario: T) 

interface Props {
    paginatedItems: any[],
    selectedItems: any[],
    filteredItems: any[],
    selectedAllItems: boolean,
    selectedSomeItems: boolean,
    page: number,
    limit: number,
    handleSelectAllItem: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleSelectOneItem: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void,
    handleConfirmDelete: (item: EmpresaInterface) => void,
    handlePageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void,
    handleLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleEditCompleted: (item: EmpresaInterface) => void,
    handleEditItem: (Item: EmpresaInterface) => void,
}




export const GridCatalogo = ({ paginatedItems, selectedAllItems, selectedSomeItems,
     selectedItems, filteredItems, page, limit,
     handleConfirmDelete, handlePageChange, handleLimitChange, handleEditCompleted, handleEditItem }: Props) => {
    const location = useLocation();

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllItems}
                                    indeterminate={selectedSomeItems}
                                    onChange={handleSelectAllItem}
                                />
                            </TableCell> */}
                            <TableCell>{'Nombre'}</TableCell>
                            <TableCell>{'Nombre Corto'}</TableCell>
                            <TableCell>{'Direccion'}</TableCell>
                            <TableCell>{'Telefono'}</TableCell>
                            <TableCell>{'Representante'}</TableCell>

                            <TableCell>{'Activo'}</TableCell>
                            <TableCell align="center">{'Acciones'}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedItems.map((item: EmpresaInterface) => {
                            const isClienteSelected = selectedItems.includes(item.id);
                            return (
                                <TableRow hover key={item.id} selected={isClienteSelected}>
                                    <TableCell>
                                        <Typography variant="h5" >{item.nombre}   </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography > {item.nombreCorto} </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{item.direccion}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{item.telefono}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{item.representante}</Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography>{getItemActiveLabel(item.isActive)}</Typography>
                                    </TableCell>


                                    <TableCell align="center">
                                        <Typography noWrap>
                                            <Tooltip title={'Editar'} arrow>
                                                <IconButton
                                                    onClick={() => handleEditItem(item)}
                                                    color="primary"
                                                >
                                                    <LaunchTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={'Eliminar'} arrow color='warning' >
                                                <IconButton
                                                    onClick={() => handleConfirmDelete(item)}
                                                    color="primary"
                                                >
                                                    <DeleteTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box p={2}>
                <TablePagination
                    labelRowsPerPage={'Registros por pagina:'}
                    component="div"
                    count={filteredItems.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 15]}
                />
            </Box>
        </>

    )
}
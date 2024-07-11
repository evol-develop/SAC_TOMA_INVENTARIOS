import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';

import Label from 'src/components/Label';
import { PropsResults } from './ConfigCatalogo';

// <T extends Object>(formulario: T)

export const GridCatalogo = ({
  paginatedItems,
  selectedAllItems,
  selectedSomeItems,
  selectedItems,
  filteredItems,
  page,
  limit,
  handleConfirmDelete,
  handlePageChange,
  handleLimitChange,
  handleEditCompleted,
  handleEditItem,
  GridResult,
  EncabezadoGrid
}: PropsResults) => {
  return (
    <>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <EncabezadoGrid />
          </TableHead>
          <TableBody>
            {paginatedItems.map((item: any) => {
              const isItemSelected = selectedItems.includes(item.id);
              return (
                <GridResult
                  key={item.id}
                  item={item}
                  isItemSelected={isItemSelected}
                  handleEditItem={handleEditItem}
                  handleConfirmDelete={handleConfirmDelete}
                />
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
  );
};

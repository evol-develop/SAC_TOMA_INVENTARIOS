import { PropsResults } from './ConfigCatalogo';
import {
  Box,
  Card,
  Checkbox,
  Grid,
  InputAdornment,
  TablePagination,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

export const CardCatalogo = ({
  paginatedItems,
  selectedAllItems,
  selectedSomeItems,
  selectedItems,
  filteredItems,
  page,
  limit,
  handlePageChange,
  handleLimitChange,
  handleSelectAllItem,
  selectedBulkActions,
  handleQueryChange,
  query,
  busquedaPor,
  entidad,
  CardResult
}: PropsResults) => {
  return (
    <>
      <Card sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {paginatedItems.length !== 0 && (
            <>
              <Box display="flex" alignItems="center">
                <Tooltip
                  arrow
                  placement="top"
                  title={'Seleccionar todos los registros'}
                >
                  <Checkbox
                    checked={selectedAllItems}
                    indeterminate={selectedSomeItems}
                    onChange={handleSelectAllItem}
                  />
                </Tooltip>
              </Box>
              {selectedBulkActions && (
                <Box flex={1} pl={2}>
                  {/* <BulkActions /> */}
                </Box>
              )}
            </>
          )}
          {!selectedBulkActions && (
            <TextField
              sx={{
                my: 0,
                ml: paginatedItems.length !== 0 ? 2 : 0
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder={busquedaPor}
              value={query}
              size="small"
              margin="normal"
              variant="outlined"
            />
          )}
        </Box>
      </Card>
      {paginatedItems.length === 0 ? (
        <Typography
          sx={{
            py: 10
          }}
          variant="h3"
          fontWeight="normal"
          color="text.secondary"
          align="center"
        >
          {'No hay registros para mostrar'}
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedItems.map((item) => {
              const isItemSelected = selectedItems.includes(item);
              return (
                <CardResult
                  key={item.key}
                  item={item}
                  isItemSelected={isItemSelected}
                />
              );
            })}
          </Grid>
          <Card
            sx={{
              p: 2,
              mt: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography component="span" variant="subtitle1">
                {'Mostrando'}
              </Typography>{' '}
              <b>{limit}</b> {'of'} <b>{filteredItems.length}</b>{' '}
              <b>{entidad}</b>
            </Box>
            <TablePagination
              component="div"
              count={filteredItems.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              labelRowsPerPage=""
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Card>
        </>
      )}
    </>
  );
};

import {
  Box,
  Button,
  Card,
  Divider,
  InputAdornment,
  Tab,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { Styled } from './Styled';
import { useCatalogo } from 'src/hooks/useCatalogo';

import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import { GridCatalogo } from './GridCatalogo';
import { CardCatalogo } from './CardCatalogo';
import CloseIcon from '@mui/icons-material/Close';
import { Loading } from 'src/components/Loading';

const { DialogWrapper, AvatarError, ButtonError, TabsWrapper, Transition } =
  Styled();

interface Props {
  PAGE_SLOT: string;
  itemState: any[];
  filterProperties: string[];
  tabs: {
    value: string;
    label: string;
  }[];
  EncabezadoGrid: () => JSX.Element;
  CardResult: (idkey: any, item: any, isItemSelected: boolean) => JSX.Element;
  GridResult: (
    idkey: any,
    item: any,
    isItemSelected: boolean,
    handleEditItem: () => void,
    handleConfirmDelete: () => void
  ) => JSX.Element;
  isCardViewEnabled?: boolean;
}
export const ResultsCatalogo = ({
  PAGE_SLOT,
  itemState,
  filterProperties,
  tabs,
  EncabezadoGrid,
  CardResult,
  GridResult,
  isCardViewEnabled = true
}: Props) => {
  const {
    selectedItems,
    setSelectedItems,
    enqueueSnackbar,
    page,
    setPage,
    limit,
    setLimit,
    query,
    setQuery,
    filters,
    setFilters,
    filteredItems,
    paginatedItems,
    selectedBulkActions,
    selectedSomeItems,
    selectedAllItems,
    toggleView,
    setToggleView,
    openConfirmDelete,
    setOpenConfirmDelete,
    itemToDelete,
    setItemToDelete,
    handleTabsChange,
    handleQueryChange,
    handleSelectAllItem,
    handleSelectOneItem,
    handlePageChange,
    handleLimitChange,
    handleViewOrientation,
    handleConfirmDelete,
    closeConfirmDelete,
    handleDeleteCompleted,
    handleEditItem,
    handleEditCompleted
  } = useCatalogo(PAGE_SLOT, itemState, filterProperties);

  return (
    <>
     <Loading />
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}
        paddingBottom="10px"
      >
        <TabsWrapper
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={filters.activo || 'todos'}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
          marco
        </TabsWrapper>
        {isCardViewEnabled && (
          <ToggleButtonGroup
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            size="small"
            value={toggleView}
            exclusive
            onChange={handleViewOrientation}
          >
            <ToggleButton disableRipple value="table_view">
              <TableRowsTwoToneIcon />
            </ToggleButton>
            <ToggleButton disableRipple value="grid_view">
              <GridViewTwoToneIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>
      {toggleView === 'table_view' && (
        <Card>
          <Box p={2}>
            {!selectedBulkActions && (
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder={'Buscar.... '}
                value={query}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
            {/* {selectedBulkActions && <BulkActions />} */}
          </Box>

          <Divider />

          {paginatedItems.length === 0 ? (
            <>
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {'No existen resultados para mostrar'}
              </Typography>
            </>
          ) : (
            <>
              <GridCatalogo
                paginatedItems={paginatedItems}
                selectedItems={selectedItems}
                filteredItems={filteredItems}
                selectedAllItems={selectedAllItems}
                selectedSomeItems={selectedSomeItems}
                page={page}
                limit={limit}
                handleSelectAllItem={handleSelectAllItem}
                handleSelectOneItem={handleSelectOneItem}
                handleConfirmDelete={handleConfirmDelete}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                handleEditItem={handleEditItem}
                handleEditCompleted={handleEditCompleted}
                selectedBulkActions={selectedBulkActions}
                handleQueryChange={handleQueryChange}
                query={query}
                busquedaPor="Nombre, Correo...."
                entidad={PAGE_SLOT}
                EncabezadoGrid={EncabezadoGrid}
                GridResult={GridResult}
              />
            </>
          )}
        </Card>
      )}
      {toggleView === 'grid_view' && (
        <>
          <CardCatalogo
            paginatedItems={paginatedItems}
            selectedItems={selectedItems}
            filteredItems={filteredItems}
            selectedAllItems={selectedAllItems}
            selectedSomeItems={selectedSomeItems}
            page={page}
            limit={limit}
            handleSelectAllItem={handleSelectAllItem}
            handleSelectOneItem={handleSelectOneItem}
            handleConfirmDelete={handleConfirmDelete}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            handleEditItem={handleEditItem}
            handleEditCompleted={handleEditCompleted}
            selectedBulkActions={selectedBulkActions}
            handleQueryChange={handleQueryChange}
            query={query}
            busquedaPor="Nombre, Correo...."
            entidad={PAGE_SLOT}
            CardResult={CardResult}
          />
        </>
      )}
      {!toggleView && (
        <Card
          sx={{
            textAlign: 'center',
            p: 3
          }}
        >
          <Typography
            align="center"
            variant="h4"
            fontWeight="normal"
            color="text.secondary"
            sx={{
              my: 5
            }}
            gutterBottom
          >
            {
              'Choose between table or grid views for displaying the users list.'
            }
          </Typography>
        </Card>
      )}

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6
            }}
            variant="h3"
          >
            {itemToDelete['nombre']}
          </Typography>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6
            }}
            variant="h3"
          >
            {'Estas seguro de eliminar este registro'}?
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {'Cancelar'}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {'Eliminar'}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

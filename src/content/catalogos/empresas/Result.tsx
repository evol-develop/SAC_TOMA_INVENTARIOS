import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Tab,
  TablePagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Zoom
} from '@mui/material';
import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import clsx from 'clsx';

import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import { useSnackbar } from 'notistack';
import { deleteItem } from 'src/api/genericApi';
import Label from 'src/components/Label';
import { entidades } from 'src/config/entities';
import { useAppSelector } from 'src/hooks/storeHooks';
import { usePage } from 'src/hooks/usePage';
import { EmpresaInterface } from 'src/interfaces/empresaInterface';
import { deleteItemSlot, setDataModal, setIsEditing, setIsOpenModal } from 'src/store/slices/page';
import { RootState } from 'src/store/store';
import { GridCatalogo } from './GridCatalogo'
import { Styled } from '../catalogoGenerico/Styled';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';

const PAGE_SLOT = entidades.EMPRESAS

const { DialogWrapper, AvatarError, CardWrapper, ButtonError, TabsWrapper, Transition } = Styled()

const getItemActiveLabel = (active: boolean) => {
  return active ? <Label color={'success'}> {'Activo'}</Label> : <Label color={'error'}> {'Inactivo'}</Label>;
};

const getItemExternoLabel = (active: boolean) => {
  return active && <Label color={'info'} > {'Externo'}</Label>
};



const applyFilters = (items: any, query: string, filters: any, filterProperties: string[]) => {  

  return items.filter((item) => {
    let matches = true;


    if (query) {
      const properties = filterProperties
      let containsQuery = false;

      properties.forEach((property) => {
        if (item[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });



      if (filters.isExterno && item !== filters.isExterno) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {

      if (filters[key] !== '') {
        const value = (filters[key] === 'true') ? true : false;

        if (item[key] !== value) {
          matches = false;
        }
      }
    });
    return matches;
  });
};

const applyPagination = (items: any[], page: number, limit: number) => {
  return items.slice(page * limit, page * limit + limit);
};



export const Results = () => {
  const itemState: EmpresaInterface[] = useAppSelector((state: RootState) => state.page.slots.EMPRESAS) || []

  const filterProperties = ['nombre', 'nombreCorto', 'correo','representante']
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
  ];

  const [selectedItems, setSelectedItems] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = usePage(PAGE_SLOT)

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ activo: '' });

  const handleTabsChange = (_event: React.SyntheticEvent<Element, Event>, tabsValue: string) => {
    let value = ''

    if (tabsValue !== 'todos') {
      value = tabsValue;
    }

    setFilters((prevFilters: any) => ({
      ...prevFilters,
      activo: value
    }));

    setSelectedItems([])
  };


  const handleQueryChange = (event: any) => {
    event.persist();
    setQuery(event.target.value!);
  };

  const handleSelectAllItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedItems(event.target.checked ? itemState.map((item) => item.id) : []);
  };

  const handleSelectOneItem = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (!selectedItems.includes(id)) {
      setSelectedItems((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== id)
      );
    }
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredItems: EmpresaInterface[] = applyFilters(itemState, query, filters, filterProperties);
  const paginatedItems: EmpresaInterface[] = applyPagination(filteredItems, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeItems = selectedItems.length > 0 && selectedItems.length < itemState.length;
  const selectedAllItems = selectedItems.length === itemState.length;



  const [toggleView, setToggleView] = useState('table_view');

  const handleViewOrientation = (_event, newValue) => {
    setToggleView(newValue);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({} as EmpresaInterface)

  const handleConfirmDelete = (item: EmpresaInterface) => {
    setItemToDelete(item)
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setItemToDelete({} as EmpresaInterface)
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {

    try {
       const response = await axios.delete<ResponseInterface>(`api/empresas/DeleteEmpresa/${itemToDelete.id}`);
       
      //const response = deleteItem(PAGE_SLOT, itemToDelete.id)

      const message = 'Se borro correctamente el registro de, ' + itemToDelete.nombre
      const isSuccess = true;
      if (isSuccess) {
        dispatch(deleteItemSlot({ state: PAGE_SLOT, data: itemToDelete.id }))
        enqueueSnackbar('El Registro ha sido eliminado con exito', {
          variant: 'warning',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });
      }
      else {
        enqueueSnackbar(message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Zoom
        });

      }
    } catch (err) {
      console.error(err);

    }
    setOpenConfirmDelete(false);
  }

  const handleEditItem = (item: EmpresaInterface) => {
    dispatch(setIsEditing(true))
    dispatch(setIsOpenModal(true))  // open modal
    dispatch(setDataModal(item))
  }

  const handleEditCompleted = async () => {
  }


  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}
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
        </TabsWrapper>
        <ToggleButtonGroup
          sx={{
            mt: { xs: 2, sm: 0 }
          }}
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
                placeholder={'Busqueda por Nombre o Correo'}
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
                {"No existen resultados para mostrar"}
              </Typography>
            </>
          ) : (
            <>
              <GridCatalogo
                paginatedItems={paginatedItems} selectedItems={selectedItems} filteredItems={filteredItems}
                selectedAllItems={selectedAllItems} selectedSomeItems={selectedSomeItems} page={page} limit={limit}
                handleSelectAllItem={handleSelectAllItem} handleSelectOneItem={handleSelectOneItem}
                handleConfirmDelete={handleConfirmDelete} handlePageChange={handlePageChange} handleLimitChange={handleLimitChange}
                handleEditItem={handleEditItem} handleEditCompleted={handleEditCompleted}
              />
            </>
          )}
        </Card>
      )}
      {toggleView === 'grid_view' && (
        <>
          <Card
            sx={{
              p: 2,
              mb: 3
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
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
                  placeholder={'Busqueda por Nombre o Correo...'}
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
              {"No hay registros para mostrar"}
            </Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedItems.map((item) => {
                  const isUserSelected = selectedItems.includes(item);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <CardWrapper
                        className={clsx({
                          'Mui-selected': isUserSelected
                        })}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: '2'
                          }}
                        >
                          <Box
                            px={2}
                            pt={2}
                            display="flex"
                            alignItems="flex-start"
                            justifyContent="space-between"
                          >
                            <span>{getItemActiveLabel(item.isActive)}</span>
                            <IconButton
                              color="primary"
                              sx={{
                                p: 0.5
                              }}
                            >
                              <MoreVertTwoToneIcon />
                            </IconButton>
                          </Box>
                          <Box p={2} display="flex" alignItems="flex-start">

                            {/* <LocalShippingTwoToneIcon
                              color="primary"
                              sx={{
                                width: 50,
                                height: 50,
                                mr: 2
                              }} /> */}

                            <Box>
                              <Box>
                                {item.nombre}
                              </Box>
                              <Typography
                                sx={{
                                  pt: 0.3
                                }}
                                variant="subtitle2"
                              >
                                {item.nombreCorto}
                              </Typography>
                              <Typography
                                sx={{
                                  pt: 1
                                }}
                                variant="h6"
                              >
                                {item.correo}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider />

                        </Box>
                      </CardWrapper>
                    </Grid>
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
                  <b>{'Empresas'}</b>
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
            {'Choose between table or grid views for displaying the users list.'}
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
            variant="h3" >
            {itemToDelete.nombre}
          </Typography>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6
            }}
            variant="h3"
          >
            {'Estas seguro de eliminar este registro'}
            ?
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



export default Results;

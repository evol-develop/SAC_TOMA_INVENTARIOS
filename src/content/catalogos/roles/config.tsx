import { entidades } from 'src/config/entities';
// import { LocalStyled } from '../obras/LocalStyled';
import { Styled } from '../catalogoGenerico/Styled';
import * as Yup from 'yup';
import { usePage } from 'src/hooks/usePage';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import { Formik } from 'formik';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import clsx from 'clsx';
import { getItemActiveLabel } from '../catalogoGenerico/ConfigCatalogo';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import KeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';

import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useEffect } from 'react';

import { createSlot, setIsOpenModal } from 'src/store/slices/page';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import { RolInterface } from 'src/interfaces/entidades/rolInterface';
import {
  MenuByRolInterface,
  MenuInterface
} from 'src/interfaces/entidades/menuInterface';
import { useSnackbar } from 'notistack';

export const ENDPOINTDELETE = 'roles/delete';

export const PAGE_SLOT = entidades.ROLES;
const { CardWrapper } = Styled();

interface Props {
  idKey: any;
  item: any;
  isItemSelected: boolean;
  handleEditItem?: (item: any) => void;
  handleConfirmDelete?: (item: any) => void;
}

//=======================================================================================
//          CONFIGURACION FORMULARIO
//=======================================================================================

export let titulos = {
  titulo: 'Administración de Roles',
  descripcion:
    'Todos los aspectos relacionados con los roles pueden ser administrados aquí.',
  nombreItem: 'Rol',
  tituloModal: "",
  descripcionModal: ""
};

export const initialValues: RolInterface = {
  id: 0,
  nombre: '',
  empresaId: 0,
  activo: true
};

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validationSchema = () =>
  Yup.object().shape({
    nombre: Yup.string().max(120).required('El nombre es un dato requerido')
  });

export const OperacionesFormulario = () => {
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string
  ): Promise<any> => {
    const valores = values.values as RolInterface;

    const valoresForm = {
      nombre: valores.nombre,
      empresaId: idEmpresa,
      activo: valores.activo
    };

    try {
      const response = await axios.post<ResponseInterface>(
        '/api/roles/create',
        {
          ...valoresForm
        }
      );

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;
      const result = response.data.result;

      return {
        message,
        isSuccess,
        result
      };
    } catch (err) {
      throw `Error al actualizar la informacion del rol`;
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string
  ): Promise<any> => {
    const valores = values.values as RolInterface;

    const valoresForm = {
      id: valores.id,
      nombre: valores.nombre,
      empresaId: idEmpresa,
      activo: valores.activo
    };

    try {
      const response = await axios.post<ResponseInterface>(
        '/api/roles/update',
        {
          ...valoresForm
        }
      );

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;
      const result = response.data.result;

      return {
        message,
        isSuccess,
        result
      };
    } catch (error) {
      throw `Error al actualizar la informacion del rol`;
    }
  };

  return {
    createItemCatalogo,
    updateItemCatalogo
  };
};

interface ProprsFormulario {
  dataModal: any;
  onSubmit: (
    _values: any,
    {
      resetForm,
      setErrors,
      setStatus,
      setSubmitting
    }: {
      resetForm: any;
      setErrors: any;
      setStatus: any;
      setSubmitting: any;
    }
  ) => Promise<void>;
  handleCreateItemClose: any;
}

export const Formulario = ({
  dataModal,
  onSubmit,
  handleCreateItemClose
}: ProprsFormulario) => {
  const ModalType = useAppSelector(
    (state: RootState) => state.page.slots.ModalType
  );

  return (
    <Formik
      initialValues={dataModal.id === undefined ? initialValues : dataModal}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          {ModalType === 'Rol' ? (
            <>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={12}>
                    <Grid container spacing={1}>
                      {dataModal.id !== undefined && (
                        <>
                          <Grid item xs={12} md={9}>
                            {' '}
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControlLabel
                              control={
                                <Switch
                                  name="activo"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.activo || false}
                                  color="success"
                                  checked={values.activo || false}
                                />
                              }
                              label={values.activo ? 'Activo' : 'Inactivo'}
                              labelPlacement="start"
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={6}>
                        <TextField
                          error={Boolean(touched.nombre && errors.nombre)}
                          fullWidth
                          helperText={touched.nombre && errors.nombre}
                          label={'Nombre'}
                          name="nombre"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.nombre}
                          variant="outlined"
                          autoComplete="off"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button
                  color="secondary"
                  onClick={handleCreateItemClose}
                  size="small"
                >
                  {'Cancelar'}
                </Button>
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                  size="small"
                >
                  {dataModal.id === undefined
                    ? `Agregar Registro`
                    : 'Guardar Cambios'}
                </Button>
              </DialogActions>
            </>
          ) : ( // SI ESTA CAMBIANDO LOS PERMISOS DE UN ROL
            <>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                  <Grid item xs={12} lg={12}>
                    <Grid container spacing={1}>
                      <GridMenu />
                    </Grid>
                  </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                {/* <Button
                  color="secondary"
                  onClick={handleCreateItemClose}
                  size="small"
                >
                  {'Cancelar'}
                </Button>
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                  size="small"
                >
                  {dataModal.id === undefined
                    ? `Agregar Registro`
                    : 'Gaurdar Cambios'}
                </Button> */}
              </DialogActions>
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

//=======================================================================================
//          CONFIGURACION CARDVIEW
//=======================================================================================

export const CardResult = ({ idKey, item, isItemSelected }: Props) => {
  const location = useLocation();
  return (
    <Grid item xs={12} sm={6} md={4} key={idKey}>
      <CardWrapper
        className={clsx({
          'Mui-selected': isItemSelected
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
            <span>{getItemActiveLabel(item.activo)}</span>
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
            <Avatar
              sx={{
                width: 75,
                height: 75,
                mr: 2
              }}
              src={item.photoURL}
            />
            <Box>
              <Link variant="h5" component={RouterLink} to={``}>
                {item.nombre} {item.apellido}
              </Link>{' '}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                ({item.email})
              </Typography>
              <Typography
                sx={{
                  pt: 0.3
                }}
                variant="subtitle2"
              >
                {item.userRol}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
      </CardWrapper>
    </Grid>
  );
};

//=======================================================================================
//          CONFIGURACION ENCABEZADO DEL GRID DE RESULTADOS
//=======================================================================================
export const EncabezadoGrid = () => {
  return (
    <TableRow>
      {/* <TableCell padding="checkbox">
            <Checkbox
                checked={selectedAllItems}
                indeterminate={selectedSomeItems}
                onChange={handleSelectAllItem}
            />
        </TableCell> */}
      <TableCell>{'Nombre'}</TableCell>
      <TableCell>{'Activo'}</TableCell>
      <TableCell>{'Permisos'}</TableCell>
      <TableCell align="center">{'Acciones'}</TableCell>
    </TableRow>
  );
};

//=======================================================================================
//          CONFIGURACION DEL GRID DE RESULTADOS
//=======================================================================================
export const GridResult = ({
  idKey,
  item,
  isItemSelected,
  handleEditItem,
  handleConfirmDelete
}: Props) => {
  const { dispatch } = usePage(PAGE_SLOT);
  const RolSeleccinado: RolInterface = useAppSelector(
    (state: RootState) => state.page.slots.RolSeleccionado
  );

  const open = useAppSelector((state: RootState) => state.page.isOpenModal);

  useEffect(() => {
    if (!open) {
      dispatch(createSlot({ ModalType: 'Rol' }));
    titulos.tituloModal = ``;
    titulos.descripcionModal = ``;

    }
  }, [open]);

  const handleClickPermisos = (item: any) => {
    dispatch(createSlot({ ModalType: 'Permisos' }));
    titulos.tituloModal = `Administrar permisos del rol \"${item.nombre}\"`;
    titulos.descripcionModal = `Àsignar permisos al rol \"${item.nombre}\"`;
    dispatch(createSlot({ RolSeleccionado: item }));
    CargaMenus(item.id);
    dispatch(setIsOpenModal(true));
  };

  const CargaMenus = async (id_rol: number) => {
    try {
      const response = await axios.get(`/api/roles/getmenubyrol/${id_rol}`, {
        headers: { 'Content-Type': 'application/text' }
      });

      dispatch(
        createSlot({ MENUS: response.data.result as MenuByRolInterface[] })
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <TableRow hover key={idKey} selected={isItemSelected}>
      <TableCell>
        <Box>
          <Box display="flex" alignItems="center">
            <Box>
              <Link variant="h5" component={RouterLink} to={``}>
                {item.nombre}
              </Link>
              <Typography noWrap variant="h5">
                {/* {item.apellido} */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography>{getItemActiveLabel(item.activo)}</Typography>
      </TableCell>

      <TableCell>
        <Tooltip title={'Permisos'} arrow color="warning">
          <IconButton onClick={() => handleClickPermisos(item)} color="primary">
            <KeyTwoToneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>

      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={'Editar'} arrow>
            <IconButton onClick={() => handleEditItem(item)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Eliminar'} arrow color="warning">
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
};

const EncabezadoGridMenu = () => {
  return (
    <TableRow>
      <TableCell>{'Opción'}</TableCell>
      {/* <TableCell>{'Activo'}</TableCell> */}
      <TableCell align="center">{'Acciones'}</TableCell>
    </TableRow>
  );
};

const GridMenu = () => {
  const { dispatch } = usePage(PAGE_SLOT);
  const { enqueueSnackbar } = useSnackbar();

  const RolSeleccionado: RolInterface = useAppSelector(
    (state: RootState) => state.page.slots.RolSeleccionado
  );

  const items: MenuInterface[] = useAppSelector(
    (state: RootState) => state.page.slots.MENUS
  );

  const CargaMenus = async () => {
    try {
      const response = await axios.get(
        `/api/roles/getmenubyrol/${RolSeleccionado.id}`,
        {
          headers: { 'Content-Type': 'application/text' }
        }
      );

      dispatch(
        createSlot({ MENUS: response.data.result as MenuByRolInterface[] })
      );

      dispatch(createSlot({ ModalType: 'Permisos' }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChanguePermiso = async (item: MenuInterface) => {
    try {
      const response = await axios.post<ResponseInterface>(
        `/api/roles/cambiarpermiso/${RolSeleccionado.id}`,
        item
      );

      if (response.data.isSuccess) {
        CargaMenus();
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  };

  return items ? (
    <>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <EncabezadoGridMenu />
          </TableHead>
          <TableBody>
            {items.map((item: any) => (
              <TableRow hover key={item.id} selected={false}>
                <TableCell>
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Link variant="h5" component={RouterLink} to={''}>
                          {item.nombre}
                        </Link>
                        <Typography noWrap variant="h5">
                          {/* {item.apellido} */}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                {/* <TableCell>
                  <Typography>{getItemActiveLabel(item.activo)}</Typography>
                </TableCell> */}

                <TableCell align="center">
                  <Typography noWrap>
                    <Tooltip
                      title={item.acceso ? 'Denegar' : 'Permitir'}
                      arrow
                      placement="left"
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            name="acceso"
                            onChange={(e) => {
                              handleChanguePermiso(item);
                            }}
                            value={item.acceso || false}
                            color="success"
                            checked={item.acceso || false}
                          />
                        }
                        label={item.acceso ? '' : ''}
                        labelPlacement="start"
                      />
                    </Tooltip>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <></>
  );
};

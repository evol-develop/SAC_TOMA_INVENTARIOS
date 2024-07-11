import { Link as RouterLink, useLocation } from 'react-router-dom';
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
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import { entidades } from 'src/config/entities';
import clsx from 'clsx';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import {
  getItemActiveLabel,
  getUserRoleLabel
} from '../catalogos/catalogoGenerico/ConfigCatalogo';
import { createItem, updateItem } from 'src/api/genericApi';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { UsuarioAdicionalesInterface } from 'src/interfaces/UsuarioAdicionalesInterface';
import { ComponenteSelect } from 'src/components/multiSelect/ComponenteSelect';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { Styled } from '../catalogos/catalogoGenerico/Styled';
import { LocalStyled } from './LocalStyled';
import { useState } from 'react';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import { usePage } from 'src/hooks/usePage';
import { addItemSlot, updateItemSlot } from 'src/store/slices/page';
import { Result } from '../../interfaces/responseInterface';
import { crearUsuario } from 'src/api/userApi';
// import { NotificacionesInterface } from 'src/interfaces/entidades/notificacionesInterface';

export const PAGE_SLOT = entidades.USUARIOS;
export const ENDPOINTDELETE = '/api/user/delete';

const { Input, AvatarWrapper, ButtonUploadWrapper } = LocalStyled();
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

export const titulos = {
  titulo: 'Administración de Usuarios',
  descripcion:
    'Todos los aspectos relacionados con los Usuarios pueden ser administrados aquí.',
  nombreItem: 'Usuario'
};

export const initialValues: UsuarioAdicionalesInterface = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  userRol: null,
  photoURL: '',
  activo: true,
  idUsuario: '',
  idEmpresa: '',
  coverPhotoURL: '',
  photoNameFile: '',
  coverPhotoNameFile: '',
  password: '',
  confirmPassword: ''
};

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validationSchema = () =>
  Yup.object().shape({
    nombre: Yup.string().max(120).required('La nombre es un dato requerido'),
    apellido: Yup.string()
      .max(120)
      .required('El Apellido es un dato requerido'),
    telefono: Yup.string()
      .max(10)
      .required('La teléfono es un dato requerido')
      .matches(phoneRegExp, 'El Teléfono no es un numero valido'),
    email: Yup.string()
      .max(120)
      .required('La correo es un dato requerido')
      .email(),
    password: Yup.string().max(255),
    confirmPassword: Yup.string()
      .max(255)
      .when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref('password')],
          'El paswword debe de coincidir'
        )
      })
  });

export const OperacionesFormulario = () => {
  const { dispatch } = usePage(PAGE_SLOT);
  const createItemCatalogo = async (
    values: any,
    idEmpresa: string
  ): Promise<any> => {
    const valores = values.values as UsuarioAdicionalesInterface;
    const userRol = values['globlaState']['ROL'];

    const valoresForm = {
      email: valores.email,
      nombre: valores.nombre,
      apellido: valores.apellido,
      password: valores.password,
      userRoll: userRol,
      empresaId: idEmpresa,
      telefono: valores.telefono
    };

    if (userRol == '') {
      throw 'El Rol de Usuario es un dato obligatorio.';
    }

    try {
      const response = await axios.post<ResponseInterface>('/api/user/create', {
        ...valoresForm
      });

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;
      const result = response.data.result;
      if (isSuccess) {
        //crea usuario firebase      
        await crearUsuario(valores.email)

        // const notificacion : NotificacionesInterface ={
        //   id:null,
        //   de:'SAC-Control-Obra',
        //   para: 'admin@admin.com',
        //   fecha: new Date(),
        //   fechaLeido: null,
        //   leido:false,
        //   idEmpresa:idEmpresa.toString(),
        //   tipo:'SISTEMA',
        //   mensaje:`Se dio de alta el Usuario: ${valores.email}`          
        // }

        // await createItem(entidades.NOTIFICACIONES, notificacion)
      }

      return {
        message,
        isSuccess,
        result
      };
    } catch (err) {
      console.log(err)
      throw `Error al actualizar la informacion del usuario`;
    }
  };

  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string
  ): Promise<any> => {
    const valores = values.values as UsuarioAdicionalesInterface;
    const userRoll = values['globlaState']['ROL'];

    // const usuario = { ...valores, userRoll: userRoll, empresaId: idEmpresa }



    const valoresForm = {
      email: valores.email,
      nombre: valores.nombre,
      apellido: valores.apellido,
      password: valores.password,
      userRoll: userRoll,
      empresaId: idEmpresa,
      telefono: valores.telefono,
      activo: valores.activo
    };

    try {
      const response = await axios.post<ResponseInterface>('/api/user/update', {
        ...valoresForm
      });

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;
      const result = response.data.result;

      return {
        message,
        isSuccess,
        result
      };
    } catch (error) {
      throw `Error al actualizar la informacion del usuario`;
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
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.apellido && errors.apellido)}
                      fullWidth
                      helperText={touched.apellido && errors.apellido}
                      label={'Apellido'}
                      name="apellido"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.apellido}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      label={'Correo'}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.telefono && errors.telefono)}
                      fullWidth
                      helperText={touched.telefono && errors.telefono}
                      label={'Teléfono'}
                      name="telefono"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.telefono}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>

                  {dataModal.id === undefined && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          helperText={touched.password && errors.password}
                          label={'Contraseña'}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.password}
                          variant="outlined"
                          autoComplete="off"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          error={Boolean(
                            touched.confirmPassword && errors.confirmPassword
                          )}
                          fullWidth
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                          label={'Confirmar contraseña'}
                          name="confirmPassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.confirmPassword}
                          variant="outlined"
                          autoComplete="off"
                          size="small"
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={6}>
                    <ComponenteSelect
                      label="Rol de Usuario"
                      tipo="ROL"
                      defaultValue={
                        dataModal.id !== undefined
                          ? { label: values.userRoll, value: values.userRoll }
                          : { label: '', value: '' }
                      }
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
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={Boolean(errors.submit) || isSubmitting}
              variant="contained"
              size="small"
            >
              {dataModal.id === undefined
                ? `Agregar Registro`
                : 'Guardar Cambios'}
            </Button>
          </DialogActions>
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
              <Link
                variant="h5"
                component={RouterLink}
                to={``}
              >
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

          {/* <Avatar
                            sx={{
                                width: 50,
                                height: 50,
                                mr: 2
                            }}
                            src={item.photoURL}
                        />
                        <Box>
                            <Box>
                                {item.nombre} {item.apellido}
                            </Box>
                            <Typography
                                sx={{
                                    pt: 0.3
                                }}
                                variant="subtitle2"
                            >
                                {item.userRol}
                            </Typography>
                            <Typography
                                sx={{
                                    pt: 1
                                }}
                                variant="h6"
                            >
                                {item.email}
                            </Typography>
                        </Box> */}
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
      <TableCell>{'Correo'}</TableCell>
      <TableCell>{'Teléfono'}</TableCell>
      <TableCell>{'Nivel'}</TableCell>

      <TableCell>{'Activo'}</TableCell>
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
  const location = useLocation();

  // console.log(item)
  return (
    <TableRow hover key={idKey} selected={isItemSelected}>
      <TableCell>
        <Box>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                mr: 1,
                width: 30,
                height: 30
              }}
              src={item.photoURL}
            />
            <Box>
              <Link
                variant="h5"
                component={RouterLink}
                to={``}
              >
                {item.nombre + ' ' + item.apellido}
              </Link>
              <Typography noWrap variant="h5">
                {item.userRol}
              </Typography>
            </Box>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography> {item.email} </Typography>
      </TableCell>
      <TableCell>
        <Typography>{item.telefono}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{item.userRoll}</Typography>
      </TableCell>

      <TableCell>
        <Typography>{getItemActiveLabel(item.activo)}</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={'Editar'} arrow>
            <IconButton onClick={() => handleEditItem(item)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title={'Eliminar'} arrow color="warning">
            <IconButton
              onClick={() => handleConfirmDelete(item)}
              color="primary"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

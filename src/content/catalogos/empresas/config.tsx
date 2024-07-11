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
  Typography
} from '@mui/material';
import { entidades } from 'src/config/entities';
import clsx from 'clsx';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import { getItemActiveLabel } from '../catalogoGenerico/ConfigCatalogo';
import { createItem, updateItem } from 'src/api/genericApi';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Styled } from '../catalogoGenerico/Styled';
// import { TipoMedicionInterface } from 'src/interfaces/entidades/tipoMedicionInterface';
import { ComponenteSelect } from 'src/components/multiSelect/ComponenteSelect';
import { ClasificacionMedicionType } from 'src/types/ClasificacionMedicionType';

import Label from 'src/components/Label';
import { phoneRegExp } from 'src/content/Users/config';
import { EmpresaInterface } from 'src/interfaces/empresaInterface';
import axios from 'src/utils/axios';
import { crearUsuario } from 'src/api/userApi';
import { addItemSlot, updateItemSlot } from 'src/store/slices/page';
import { usePage } from 'src/hooks/usePage';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';

export const PAGE_SLOT = entidades.EMPRESAS;
export const ENDPOINTDELETE = 'empresas/delete';

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
  titulo: 'Administración de Empresas',
  descripcion:
    'Todos los aspectos relacionados con las Empresas pueden ser administrados aquí.',
  nombreItem: 'Empresa'
};

export const initialValues: EmpresaInterface = {
  id: '',
  nombre: '',
  nombreCorto: '',
  representante: '',
  telefono: '',
  correo: '',
  direccion: '',
  isActive: true,
  pictureURL: ''
};

export const validationSchema = () =>
  Yup.object().shape({
    nombre: Yup.string().max(120).required('La nombre es un dato requerido'),
    nombreCorto: Yup.string()
      .max(120)
      .required('La nombre corto es un dato requerido'),
    representante: Yup.string()
      .max(120)
      .required('La representante es un dato requerido'),
    telefono: Yup.string()
      .max(10)
      .required('La telefono es un dato requerido')
      .matches(phoneRegExp, 'El Telefono no es un numero valido'),
    correo: Yup.string()
      .max(120)
      .required('La correo es un dato requerido')
      .email(),
    direccion: Yup.string()
      .max(120)
      .required('La direccion es un dato requerido')
  });

export const OperacionesFormulario = () => {
  const { dispatch } = usePage(PAGE_SLOT);

  const createItemCatalogo = async (
    values: any,
    idEmpresa: string
  ): Promise<any> => {
    // const clasificacion = values['globlaState']['EMPRESAS'];

    // if (clasificacion == '') {
    //   throw 'La clasificacion es un dato obligatorio.';
    // }

    let valores = values.values as EmpresaInterface;
    valores.id = idEmpresa;
    valores.isActive = true;

    const response = await axios.post<ResponseInterface>(
      'api/empresas/PostEmpresa',
      valores
    );
    
    await crearUsuario(valores.correo);

    return response.data
  };

  const updateItemCatalogo = async (values: any, id: string): Promise<any> => {
    const clasificacion = values['globlaState']['EMPRESAS'];
    const valores = values.values as EmpresaInterface;

    const item = { ...valores, clasificacion: clasificacion };
    const response = await axios.put<ResponseInterface>(
      'api/empresas/PutEmpresa',
      item
    );

    return response.data;
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
  const isEditing = useAppSelector((state: RootState) => state.page.isEditing)

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
                              name="isActive"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.isActive || false}
                              color="success"
                              checked={values.isActive || false}
                            />
                          }
                          label={values.isActive ? 'Activo' : 'Inactivo'}
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
                      error={Boolean(touched.nombreCorto && errors.nombreCorto)}
                      fullWidth
                      helperText={touched.nombreCorto && errors.nombreCorto}
                      label={'Nombre Corto'}
                      name="nombreCorto"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.nombreCorto}
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
                      label={'Telefono'}
                      name="telefono"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.telefono}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={isEditing}
                      error={Boolean(touched.correo && errors.correo)}
                      fullWidth
                      helperText={touched.correo && errors.correo}
                      label={'Correo'}
                      name="correo"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.correo}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.direccion && errors.direccion)}
                      fullWidth
                      helperText={touched.direccion && errors.direccion}
                      label={'Direccion'}
                      name="direccion"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.direccion}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(
                        touched.representante && errors.representante
                      )}
                      fullWidth
                      helperText={touched.representante && errors.representante}
                      label={'Representante'}
                      name="representante"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.representante}
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
              startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
              disabled={Boolean(errors.submit) || isSubmitting}
              variant="contained"
              size="small"
            >
              {dataModal.id === undefined
                ? `Agregar Registro`
                : 'Gaurdar Cambios'}
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
  return <></>;
};

//=======================================================================================
//          CONFIGURACION ENCABEZADO DEL GRID DE RESULTADOS
//=======================================================================================
export const EncabezadoGrid = () => {
  return (
    <TableRow>
      <TableCell>{'Nombre'}</TableCell>
      <TableCell>{'Descripcion'}</TableCell>
      <TableCell>{'Clasificación'}</TableCell>

      <TableCell>{'Activo'}</TableCell>
      <TableCell align="center">{'Acciones'}</TableCell>
    </TableRow>
  );
};

// const getClasificacionLabel = (clasificacion) => {

//     let label =  <Label color={'success'}> {clasificacion}</Label>
//         debugger
//     // switch (clasificacion) {
//     //             case 'OBRAS':
//     //                 label = <Label color={'success'}> {clasificacion}</Label>
//     //                 break;
//     //             case 'TERRACERIAS':
//     //                 label = <Label color={'info'}> {clasificacion}</Label>
//     //                 break;
//     //             case 'VIADUCTOS':
//     //                 label = <Label color={'primary'}> {clasificacion}</Label>
//     //                 break;
//     //             case 'SISTEMA DE VIA':
//     //                 label = <Label color={'warning'}> {clasificacion}</Label>
//     //                 break;
//     // }

//     return  <Label color={'success'}> {'clasificacion'}</Label>
// }

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

  const getClasificacionLabel = (clasificacion: string) => {
    const cla =
      clasificacion == 'SISTEMA DE VIA' ? 'SISTEMADEVIA' : clasificacion;
    const map = {
      OBRAS: {
        text: 'OBRAS',
        color: 'success'
      },
      TERRACERIAS: {
        text: 'TERRACERIAS',
        color: 'info'
      },
      VIADUCTOS: {
        text: 'VIADUCTOS',
        color: 'primary'
      },
      SISTEMADEVIA: {
        text: 'SISTEMAS DE VIAS',
        color: 'info'
      }
    };

    const { text, color } = map[cla];
    return <Label color={color}>{text}</Label>;
  };

  return (
    <TableRow hover key={idKey} selected={isItemSelected}>
      <TableCell>
        <Typography> {item.nombre} </Typography>
      </TableCell>
      <TableCell>
        <Typography> {item.descripcion} </Typography>
      </TableCell>

      <TableCell>
        <Typography>{getClasificacionLabel(item.clasificacion)}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{getItemActiveLabel(item.isActive)}</Typography>
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

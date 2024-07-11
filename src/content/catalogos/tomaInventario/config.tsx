import { entidades } from 'src/config/entities';
// import { TipoMedicionInterface } from 'src/interfaces/entidades/tipoMedicionInterface';
// import { LocalStyled } from '../obras/LocalStyled';
import { Styled } from '../catalogoGenerico/Styled';
// import { ObrasInterface } from 'src/interfaces/entidades/obrasInterface';
import * as Yup from 'yup';
import { usePage } from 'src/hooks/usePage';
import { UsuarioAdicionalesInterface } from 'src/interfaces/UsuarioAdicionalesInterface';
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
  TableCell,
  TableRow,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography
} from '@mui/material';
import { ComponenteSelect } from 'src/components/multiSelect/ComponenteSelect';
import clsx from 'clsx';
import { getItemActiveLabel } from '../catalogoGenerico/ConfigCatalogo';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/lab';

import { ReactElement, JSXElementConstructor, useState, useRef } from 'react';

// import { TiposObraType } from 'src/interfaces/entidades/obrasInterface';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { createSlot } from 'src/store/slices/page';
// import { ConceptosGastosInterface } from 'src/interfaces/entidades/conceptosGastosInterface';

export const ENDPOINTDELETE = 'conceptosgastos/delete';

export const PAGE_SLOT = entidades.CONCEPTOS_GASTOS;
// const { Input, AvatarWrapper, ButtonUploadWrapper } = LocalStyled();
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
  titulo: 'Administración de Conceptos de Gastos',
  descripcion:
    'Todos los aspectos relacionados con los conceptos de gastos pueden ser administrados aquí.',
  nombreItem: 'Concepto de Gasto'
};

// export const initialValues: ConceptosGastosInterface = {
//   id: 0,
//   nombre: '',
//   descripcion: '',
//   activo: true,
//   requiereAut: false,
//   tipoGasto: null,
//   tipoGastoId: 0,
//   unidad: null,
//   unidadId: 0,
//   empresa: null,
//   insumoId: 0
// };

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
    // const valores = values.values as ConceptosGastosInterface;

    const IdTipoGasto = values['globlaState']['TIPOINSUMO'];
    //const IdUnidades = values['globlaState']['UNIDADES'];
    const IdInsumo = values['globlaState']['INSUMO'];

    if (IdInsumo === undefined || IdInsumo.length === 0) {
      throw `Selecciona un insumo`;
    }

    // if (IdUnidades === undefined || IdUnidades.length === 0) {
    //   throw `Selecciona una unidad`;
    // }
    
    // const valoresForm = {
    //   id: valores.id,
    //   nombre: valores.nombre,
    //   descripcion: valores.descripcion,
    //   activo: valores.activo,
    //   requiereAut: valores.requiereAut,
    //   tipoGasto: null,
    //   tipoGastoId: 1,
    //   unidad: null,
    //   // unidadId: parseInt(IdUnidades),
    //   unidadId: 1,
    //   empresaId: idEmpresa,
    //   empresa: null,
    //   insumoId: parseInt(IdInsumo)
    // };

    // try {
    //   const response = await axios.post<ResponseInterface>(
    //     '/api/conceptosgastos/create',
    //     {
    //       ...valoresForm
    //     }
    //   );

    //   const message = response.data.message;
    //   const isSuccess = response.data.isSuccess;
    //   const result = response.data.result;

    //   return {
    //     message,
    //     isSuccess,
    //     result
    //   };
    // } catch (err) {
    //   throw `Error al actualizar la informacion del concepto de gasto`;
    // }
  };
// 
  const updateItemCatalogo = async (
    values: any,
    idEmpresa: string
  ): Promise<any> => {
    // const valores = values.values as ConceptosGastosInterface;

    const IdTipoGasto = values['globlaState']['TIPOINSUMO'];
    //const IdUnidades = values['globlaState']['UNIDADES'];
    const IdInsumo = values['globlaState']['INSUMO'];

    if (IdInsumo === undefined || IdInsumo.length === 0) {
      throw `Selecciona un insumo`;
    }

    // if (IdUnidades === undefined || IdUnidades.length === 0) {
    //   throw `Selecciona una unidad`;
    // }

    // const valoresForm = {
    //   id: valores.id,
    //   nombre: valores.nombre,
    //   descripcion: valores.descripcion,
    //   activo: valores.activo,
    //   requiereAut: valores.requiereAut,
    //   tipoGasto: valores.tipoGasto,
    //   tipoGastoId: 1,
    //   unidad: valores.unidad,
    //   // unidadId: parseInt(IdUnidades),
    //   unidadId: 1,
    //   empresaId: idEmpresa,
    //   insumoid: parseInt(IdInsumo)
    // };

    // try {
    //   const response = await axios.post<ResponseInterface>(
    //     '/api/conceptosgastos/update',
    //     {
    //       ...valoresForm
    //     }
    //   );

    //   const message = response.data.message;
    //   const isSuccess = response.data.isSuccess;
    //   const result = response.data.result;

    //   return {
    //     message,
    //     isSuccess,
    //     result
    //   };
    // } catch (error) {
    //   throw `Error al actualizar la informacion del concepto de gasto`;
    // }
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
  const [FechaInicio, setFechaInicio] = useState(dataModal.fechaInicio || null);
  const [FechaFin, setFechaFin] = useState(dataModal.fechaFin || null);
  const inputFechaRef = useRef<HTMLInputElement>(null);

  return (
    <Formik
      // initialValues={dataModal.id === undefined ? initialValues : dataModal}
      initialValues={dataModal.id === undefined ? dataModal : dataModal}
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

                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      rows={3}
                      error={Boolean(touched.descripcion && errors.descripcion)}
                      fullWidth
                      helperText={touched.descripcion && errors.descripcion}
                      label={'Descripción'}
                      name="descripcion"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.descripcion}
                      variant="outlined"
                      autoComplete="off"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="requiereAut"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.requiereAut || false}
                          color="success"
                          checked={values.requiereAut || false}
                        />
                      }
                      label={
                        values.requiereAut
                          ? 'Si Requiere Autorización'
                          : 'No Requiere Autorización'
                      }
                      labelPlacement="start"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <ComponenteSelect
                      label="Insumo"
                      tipo="INSUMO"
                      defaultValue={
                        dataModal.insumo?.id !== undefined
                          ? {
                              label: `${values.insumo.descripcion} (${values.insumo.clave})`,
                              value: values.insumo.id
                            }
                          : { label: '', value: '' }
                      }
                    />
                  </Grid>

                  {/* <Grid item xs={6}>
                    <ComponenteSelect
                      label="Unidades"
                      tipo="UNIDADES"
                      defaultValue={
                        dataModal.unidad?.id !== undefined
                          ? {
                              label: `${values.unidad.nombre} (${values.unidad.clave})`,
                              value: values.unidad.id
                            }
                          : { label: '', value: '' }
                      }
                    />
                  </Grid> */}
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
                {item.nombre}
              </Link>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {''}
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
      <TableCell>{'Insumo'}</TableCell>
      <TableCell>{'Unidad'}</TableCell>
      <TableCell>{'Requiere Autorización'}</TableCell>
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
  return (
    <TableRow hover key={idKey} selected={isItemSelected}>
      <TableCell>
        <Box>
          <Box display="flex" alignItems="center">
            <Box>
              <Link
                variant="h5"
                component={RouterLink}
                to={`/${
                  location.pathname.split('/')[1]
                }/management/conceptosgastos/single/${item.Id}`}
              >
                {item.nombre}
              </Link>
              <Typography noWrap variant="h5">
                {/* {item.clave} */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography>{item.insumo?.descripcion} ({item.insumo?.clave})</Typography>
      </TableCell>
      <TableCell>
        <Typography>
          {item.unidad?.nombre} ({item.unidad?.clave})
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{item.requiereAut ? 'Si' : 'No'}</Typography>
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

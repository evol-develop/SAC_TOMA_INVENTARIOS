//#region Imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  useTheme
} from '@mui/material';
import { Formik } from 'formik';
import DataTable from 'react-data-table-component';
import { useAppSelector } from 'src/hooks/storeHooks';
import { usePage } from 'src/hooks/usePage';
import { RootState } from 'src/store/store';
import * as Yup from 'yup';
import { ENDPOINTDELETE, PAGE_SLOT } from './config';
import {
  addItemSlot,
  createSlot,
  deleteItemSlot,
  setDataModal,
  setIsLoading,
  setIsOpenModal,
  updateItemSlot
} from 'src/store/slices/page';
import { useEffect, useState } from 'react';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import axios from 'src/utils/axios';
import { ComponenteSelect } from 'src/components/multiSelect/ComponenteSelect';
// import GastosInterface from 'src/interfaces/entidades/gastosInterface';
import useRefMounted from 'src/hooks/useRefMounted';
import { Styled } from 'src/content/catalogos/catalogoGenerico/Styled';
import { AvatarError } from 'src/content/index/Styles';

import CloseIcon from '@mui/icons-material/Close';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
// import { ObrasInterface } from 'src/interfaces/entidades/obrasInterface';
import { FechaConFormato } from 'src/components/FechaFormato';
import { uploadFile } from 'src/api/storageApi';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import { useSnackbar } from 'notistack';
import Label from 'src/components/Label';
import { APP } from 'src/config';
import { encrypt } from 'src/utils/encrypt';
//#endregion

const { DialogWrapper, Transition, ButtonError, Input, ButtonUploadWrapper } =
  Styled();

const validationSchema = () =>
  Yup.object().shape({
    cantidad: Yup.number().required('Cantidad es requerido'),
    precio: Yup.number().required('Precio es requerido'),
    comentarios: Yup.string().required('Comentarios es requerido')
  });

export const GridRegistros = () => {
  const { init, dispatch } = usePage(PAGE_SLOT);
  const isMountedRef = useRefMounted();
  const [isEditing, setIsEditing] = useState(false);
  const open = useAppSelector((state: RootState) => state.page.isOpenModal);
  const [isLoadingArchivo, setIsLoadingArchivo] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const data = useAppSelector(
    (state: RootState) => state.page.slots.REPGASTOSOBRA
  ); //as GastosInterface[]

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemArchivo, setItemArchivo] = useState(null);

  const obraSeleccionadaSlot = useAppSelector(
    (state: RootState) => state.page.slots.OBRAS
  );
  const BuscarDataSlot = useAppSelector(
    (state: RootState) => state.page.slots.BuscarData
  );
  const ImprimiendoSlot = useAppSelector(
    (state: RootState) => state.page.slots.Imprimiendo
  );
  const GrupoSeleccionadoSlot = useAppSelector(
    (state: RootState) => state.page.slots.GRUPOINSUMO
  );
  const MultiselectObras = useAppSelector(
    (state: RootState) => state.page.slots.MultiselectObras
  );
  const TipoGastoSeleccionadoSlot = useAppSelector(
    (state: RootState) => state.page.slots['TIPOINSUMO']
  );
  // const dataModal = useAppSelector<GastosInterface>(
  //   (state: RootState) => state.page.dataModal
  // );
  const dataModal = useAppSelector<any>(
    (state: RootState) => state.page.dataModal
  );

  const FechaInicio = useAppSelector(
    (state: RootState) => state.page.slots.FechaInicio
  );
  const FechaFin = useAppSelector(
    (state: RootState) => state.page.slots.FechaFin
  );
  const Empresa = useAppSelector((state: RootState) => state.empresa);

  const [ObraSeleccionada, setObraSeleccionada] = useState();

  //const [Obras, setObras] = useState<ObrasInterface[]>([]);
  const [Obras, setObras] = useState<any[]>([]);
  
  const theme = useTheme();

  const onChangeArchivo = async (event) => {
    dispatch(setIsLoading(true));
    setIsLoadingArchivo(true);
    const file = event.target.files[0];
    const archivoAnterior = itemArchivo.nombreArchivo;

    await uploadFile('COMPROBANTES', file, archivoAnterior)
      .then(async (file) => {
        let message = '';

        try {
          const response = await axios.post<ResponseInterface>(
            'api/gastos/update',
            {
              ...itemArchivo,
              urlComprobante: file.fullPath,
              nombreComprobante: file.nombre
            }
          );

          message = response.data.message;
          const isSuccess = response.data.isSuccess;
          const result = response.data.result;

          if (isSuccess) {
            dispatch(updateItemSlot({ state: PAGE_SLOT, data: result }));
          }
        } catch (err) {
          console.error(err);
          setIsLoadingArchivo(false);
          dispatch(setIsLoading(false));
          setItemArchivo(null);
        }

        enqueueSnackbar('Se cargo correctamente el comprobante...', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          TransitionComponent: Zoom
        });
        // })
      })
      .catch((err) => {
        setIsLoadingArchivo(false);
        setItemArchivo(null);
      });
    setIsLoadingArchivo(false);
    dispatch(setIsLoading(false));

    setItemArchivo(null);
  };

  const ImprimirReporte = async () => {
    if (ImprimiendoSlot) {
      dispatch(setIsLoading(true));

      var tipo = 0;
      if (TipoGastoSeleccionadoSlot) {
        tipo = TipoGastoSeleccionadoSlot;
      }

      try {
        let obras = '';
        MultiselectObras.forEach((element) => {
          obras += element + ',';
        });

        let obrasEncriptadas = encrypt(obras);
        console.log(obrasEncriptadas);
        

        const url = `${
          APP.URL_API
        }api/reportes/RepGastosByObra?o=${obrasEncriptadas}&t=${tipo}&g=${0}&fi=${FechaInicio}&ff=${FechaFin}&e=${encrypt(Empresa.id.toString())}`;

        window.open(url, '_blank');
      } catch (err) {
        console.error(err);
        dispatch(setIsLoading(false));
      }
      dispatch(setIsLoading(false));
      dispatch(createSlot({ ['Imprimiendo']: false }));
    }
  };

  const getData = async () => {
    if (BuscarDataSlot) {
      dispatch(setIsLoading(true));
      try {

        let obras = '';
        MultiselectObras.forEach((element) => {
          obras += element + ',';
        });
        let obrasEncriptadas = encrypt(obras);

        const response = await axios.get(`/api/gastos/getrepgastosbyobra`, {
          headers: { 'Content-Type': 'application/text' },
          params: {
            obrasId: obrasEncriptadas,
            tipoGastoId: TipoGastoSeleccionadoSlot,
            grupoGastoId: GrupoSeleccionadoSlot,
            fechaInicio: FechaInicio,
            fechaFin: FechaFin
          }
        });

        if (isMountedRef.current) {
          dispatch(
            createSlot({
              [PAGE_SLOT]: response.data.result
            })
          );

          dispatch(createSlot({ ENDPOINTDELETE: ENDPOINTDELETE }));
        }
      } catch (err) {
        console.error(err);
        dispatch(setIsLoading(false));
      }
      dispatch(setIsLoading(false));
      dispatch(createSlot({ ['BuscarData']: false }));
    }
  };

  const handleActionButtonClick = (row, id) => {
    if (itemArchivo === null) {
      setItemArchivo(row);
      console.log(itemArchivo);
    }
  };

  const ObtieneObras = async () => {
    try {
      const response = await axios.get<ResponseInterface>(
        `/api/obras/getobras`,
        {
          headers: { 'Content-Type': 'application/text' }
        }
      );

     // setObras(response.data.result as ObrasInterface[]);
      setObras(response.data.result as any[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    //ObtieneObras();
    getData();
  }, [BuscarDataSlot]);

  useEffect(() => {
    //ObtieneObras();
    ImprimirReporte();
  }, [ImprimiendoSlot]);

  const columns = [
    {
      name: 'Fecha',
      selector: (row) => row.fechaRegistro,
      cell: (item) => (
        <FechaConFormato fecha={item.fechaRegistro} formato={'dd/MM/yyyy'} />
      ),
      sortable: true,
      width: '15%'
    },
    {
      name: 'Insumo',
      selector: (row) => row.insumo.descripcion,
      cell: (row) => (
        <Tooltip
          title={
            <Box>
              <Typography variant="body2">
                {`Grupo Insumo: ${row.insumo.grupoInsumos.descripcion}`}
              </Typography>
              <Typography variant="body2">
                {`Tipo Insumo: ${row.insumo.tipoInsumo.nombre}`}
              </Typography>
            </Box>
          }
          arrow
          color="warning"
          placement="left"
        >
          <Box>{row.insumo.descripcion}</Box>
        </Tooltip>
      ),
      sortable: true,
      width: '25%'
    },
    {
      name: 'Concepto',
      selector: (row) => row.concepto,
      sortable: true,
      cell: (row) => (
        <Tooltip
          title={
            <Box>
              <Typography variant="body2">
                {`Comentarios: ${row.comentarios}`}
              </Typography>
            </Box>
          }
          arrow
          color="warning"
          placement="left"
        >
          <Box>{row.concepto}</Box>
        </Tooltip>
      ),
      width: '25%'
    },
    {
      name: 'Gastado',
      selector: (row) => row.gastado,
      sortable: true,
      cell: (row) => (
        <>
          {row.gastado.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}
        </>
      ),
      right: true
    }
  ];

  //const [initialValues, setInitialValues] = useState<GastosInterface>({

    const [initialValues, setInitialValues] = useState<any>({
    id: 0,
    empresa: null,
    empresaId: 0,
    obrasId: 0,
    conceptoId: 0,
    autorizado: false,
    cantidad: 0,
    precio: 0,
    comentarios: '',
    urlComprobante: '',
    fechaRegistro: FechaInicio,
    colaboradorId: 0,
    formaPagoId: 0,
    proveedorId: 0,
    descripcion: '',
    insumos: [],
    facturaFiscal: false
  });

  const onRowClicked = (row) => ({});

  const handleCreateItemClose = () => {
    dispatch(setIsOpenModal(false));
    dispatch(setDataModal({}));
    setIsEditing(false);
  };

  const onSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    _values.fechaRegistro = FechaInicio;
    _values.obrasId = ObraSeleccionada;
    // _values.conceptoId = conceptoSeleccionado;
    // _values.colaboradorId = ColaboradorSeleccionado;
    dispatch(setIsLoading(true));

    let enpoint = 'api/gastos/create';
    if (isEditing) {
      enpoint = 'api/gastos/update';
    }

    try {
      const response = await axios.post<ResponseInterface>(enpoint, {
        ..._values
      });

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;
      const result = response.data.result;

      if (isSuccess) {
        // dispatch(updateItemSlot({state: PAGE_SLOT, data: response.data.result as PaquetesInterface[] }))
        if (isEditing) {
          dispatch(
            updateItemSlot({
              state: PAGE_SLOT,
              data: response.data.result //as GastosInterface
            })
          );
        } else {
          dispatch(
            addItemSlot({
              state: PAGE_SLOT,
              data: response.data.result //as GastosInterface
            })
          );
        }
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        setIsEditing(false);
      } else {
        resetForm();
        setStatus({ success: false });
        setSubmitting(false);
      }
      handleCreateItemSuccess(isSuccess, message);
      dispatch(setIsLoading(true));
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
      dispatch(setIsLoading(false));
    }
    dispatch(setIsLoading(false));
  };

  const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
    dispatch(setIsOpenModal(!isSuccess));
    dispatch(setDataModal({}));
    enqueueSnackbar(message, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  // const handleEditItem = (item: PaquetesInterface) => {
  const handleEditItem = (item) => {
    setIsEditing(true);
    dispatch(setIsOpenModal(true));
    dispatch(setDataModal(item));
  };

  const handleDeleteCompleted = async () => {
    try {
      const response = await axios.post<ResponseInterface>(
        `api/gastos/delete/${itemToDelete?.id}`
      );

      const message = response.data.message;
      const isSuccess = response.data.isSuccess;
      if (isSuccess) {
        dispatch(deleteItemSlot({ state: PAGE_SLOT, data: itemToDelete.id }));
        enqueueSnackbar('El Registro ha sido eliminado con exito', {
          variant: 'warning',
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
  };

  const closeConfirmDelete = () => {
    setItemToDelete(null);
    setOpenConfirmDelete(false);
    setIsEditing(false);
  };
  // const handleConfirmDelete = (item: PaquetesInterface) => {
  const handleConfirmDelete = (item) => {
    setItemToDelete(item);
    setOpenConfirmDelete(true);
  };

  useEffect(() => {
    if (dataModal.id !== undefined) {
      //let valores: GastosInterface = {
        let valores: any = {
        id: dataModal.id,
        empresa: dataModal.empresa,
        empresaId: dataModal.empresaId,
        obras: dataModal.obras,
        obrasId: dataModal.obrasId,
        concepto: dataModal.concepto,
        conceptoId: dataModal.conceptoId,
        autorizado: dataModal.autorizado,
        cantidad: dataModal.cantidad,
        precio: dataModal.precio,
        comentarios: dataModal.comentarios,
        urlComprobante: dataModal.urlComprobante,
        fechaRegistro: dataModal.fechaRegistro,
        colaborador: dataModal.colaborador,
        colaboradorId: dataModal.colaboradorId,
        formaPagoId: dataModal.formaPagoId,
        proveedorId: dataModal.proveedorId,
        descripcion: dataModal.descripcion,
        insumos: dataModal.insumos,
        facturaFiscal: dataModal.facturaFiscal
      };
      setInitialValues(valores);
    } else {
      //let valores: GastosInterface = {
      let valores: any = {
        id: 0,
        empresa: null,
        empresaId: 0,
        obrasId: 0,
        conceptoId: 0,
        autorizado: false,
        cantidad: 0,
        precio: 0,
        comentarios: '',
        urlComprobante: '',
        fechaRegistro: FechaInicio,
        colaboradorId: 0,
        formaPagoId: 0,
        proveedorId: 0,
        descripcion: '',
        insumos: [],
        facturaFiscal: false
      };
      setInitialValues(valores);
    }
  }, [dataModal]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    //si data tiene items, sumar todo lo gastado
    if (data && data.length > 0) {
      let total = 0;
      data.forEach((item) => {
        total += item.gastado;
      });

      dispatch(createSlot({ ['TotalGastado']: total }));
    }
  }, [data]);

  return (
    <>
      <Container sx={{ paddingTop: 1 }}>
        {data && data.length > 0 && (
          <Card sx={{ display: 'flex', paddingBottom: 1 }}>
            <Grid
              sx={{
                px: 4
              }}
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>
                <div style={{ width: '100%' }}>
                  <DataTable
                    columns={columns}
                    data={data}
                    highlightOnHover
                    striped
                    onRowClicked={onRowClicked}
                  />
                </div>
              </Grid>
            </Grid>
          </Card>
        )}
      </Container>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateItemClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {`Agrega un gasto para la obra: ${
              Obras?.find((x) => x.id == ObraSeleccionada)?.nombre
            } (${Obras?.find((x) => x.id == ObraSeleccionada)?.clave})`}
          </Typography>
          <Typography variant="subtitle2">{'Ingresa los datos.'}</Typography>
        </DialogTitle>

        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={3}>
                    {/* <Grid item xs={12} md={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="autorizado"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.autorizado || false}
                            color="success"
                            checked={values.autorizado || false}
                          />
                        }
                        label={
                          values.aurotizado ? 'Autorizado' : 'No Autorizado'
                        }
                        labelPlacement="start"
                      />
                    </Grid> */}
                    <Grid item xs={12} lg={12}>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        paddingBottom={1}
                        paddingRight={0}
                      >
                        <ComponenteSelect
                          label="Colaborador"
                          tipo="COLABORADOR"
                          defaultValue={
                            dataModal.colaborador?.id !== undefined
                              ? {
                                  label: `${values.colaborador.nombre} ${values.colaborador.apellido}`,
                                  value: values.colaborador.id
                                }
                              : { label: '', value: '' }
                          }
                        />
                      </Grid>

                      <Grid container spacing={1}>
                        {false && (
                          <Grid item xs={6}>
                            <ComponenteSelect
                              hidden
                              isEditing={!isEditing}
                              label="Obra"
                              tipo="OBRAS"
                              defaultValue={
                                dataModal.obras?.id !== undefined
                                  ? {
                                      label: `${values.obras.nombre} (${values.obras.clave})`,
                                      value: values.obras.id
                                    }
                                  : ObraSeleccionada
                                  ? {
                                      label: `${
                                        Obras.find(
                                          (x) => x.id == ObraSeleccionada
                                        ).nombre
                                      } (${
                                        Obras.find(
                                          (x) => x.id == ObraSeleccionada
                                        ).clave
                                      })`,
                                      value: ObraSeleccionada
                                    }
                                  : { label: '', value: '' }
                              }
                            />
                          </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                          <ComponenteSelect
                            label="Concepto"
                            tipo="CONCEPTOGASTOS"
                            defaultValue={
                              dataModal.concepto?.id !== undefined
                                ? {
                                    label: values.concepto.nombre,
                                    value: values.concepto.id
                                  }
                                : { label: '', value: '' }
                            }
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            error={Boolean(touched.cantidad && errors.cantidad)}
                            fullWidth
                            helperText={touched.cantidad && errors.cantidad}
                            label={'Cantidad'}
                            name="cantidad"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.cantidad}
                            variant="outlined"
                            autoComplete="off"
                            type="number"
                            inputProps={{
                              min: 0
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6} md={2}>
                          <TextField
                            error={Boolean(touched.precio && errors.precio)}
                            fullWidth
                            helperText={touched.precio && errors.comentarios}
                            label={'Precio'}
                            name="precio"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.precio}
                            variant="outlined"
                            autoComplete="off"
                            type="number"
                            size="small"
                          />
                        </Grid>
                        <Grid item sm={12} md={2}>
                          <Label>
                            Total:{' '}
                            {(values.cantidad * values.precio).toLocaleString(
                              'es-MX',
                              {
                                style: 'currency',
                                currency: 'MXN'
                              }
                            )}
                          </Label>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            multiline
                            rows={3}
                            error={Boolean(
                              touched.comentarios && errors.comentarios
                            )}
                            fullWidth
                            helperText={
                              touched.comentarios && errors.comentarios
                            }
                            label={'Comentarios'}
                            name="comentarios"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.comentarios}
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
                  <Button color="secondary" onClick={handleCreateItemClose}>
                    {'Cancelar'}
                  </Button>
                  <Button
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {!isEditing ? 'Agregar Registro' : 'Guardar Cambios'}
                  </Button>
                </DialogActions>
              </form>
            );
          }}
        </Formik>
      </Dialog>

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
            {/* {itemToDelete ? itemToDelete.paquete.numeroPaquete : ''} */}
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

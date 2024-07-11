import { DatePicker } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Zoom
} from '@mui/material';
import { Formik } from 'formik';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ComponenteSelect } from 'src/components/multiSelect/ComponenteSelect';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useSnackbar } from 'notistack';
import { usePage } from 'src/hooks/usePage';
import useRefMounted from 'src/hooks/useRefMounted';
import { createSlot } from 'src/store/slices/page';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import PrintTwoToneIcon from '@mui/icons-material/PrintTwoTone';
import Label from 'src/components/Label';
import MultiSelect from 'src/components/multiSelect/componenteMultiSelect';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import { ObrasInfoInterface } from 'src/interfaces/entidades/Vistas/obrasInfoInterface';

const initialValues = {};

export const Parametros = () => {
  let DataEncontrada = useAppSelector(
    (state: RootState) => state.page.slots.REPGASTOSOBRA
  );

  const [FechaInicio, setFechaInicio] = useState<Date>();
  const [FechaFin, setFechaFin] = useState<Date>();

  const [isDisabled, setIsDisabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);

  const TotalGastado = useAppSelector(
    (state: RootState) => state.page.slots.TotalGastado
  );

  const { enqueueSnackbar } = useSnackbar();

  const inputRef = useRef<HTMLInputElement>(null);
  const inputFechaInicioRef = useRef<HTMLInputElement>(null);
  const inputFechaFinRef = useRef<HTMLInputElement>(null);

  const isMountedRef = useRefMounted();
  const { dispatch } = usePage();

  const Obras = useAppSelector((state: RootState) => state.page.slots.OBRAS);

  const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
    enqueueSnackbar(message, {
      variant: isSuccess ? 'success' : 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const [ShowPrintButton, setShowPrintButton] = useState(false);
  useEffect(() => {
    if (DataEncontrada !== undefined && DataEncontrada !== null) {
      if (DataEncontrada.length > 0) {
        setShowPrintButton(true);
      } else {
        setShowPrintButton(false);
      }
    }
  }, [DataEncontrada]);

  useEffect(() => {
    setFechaInicio(new Date());
    setFechaFin(new Date());
    CargaObras();
  }, []);

  const CargaObras = async () => {
    try {
      const response = await axios.get<ResponseInterface>(
        `/api/obras/getobras`,
        {
          headers: { 'Content-Type': 'application/text' }
        }
      );

      let opcionTodas: ObrasInfoInterface = {
        id: 0,
        nombre: 'TODAS',
        descripcion: 'TODAS',
        idTipoObra: 1,
        presupuesto: 0,
        gastado: 0,
        saldoObra: 0,
        fechaInicio: new Date(),
        fechaFin: new Date(),
        ingresos: 0,
        disponibleIngresos: 0,
        Asentamiento: null
      };

      dispatch(
        createSlot({ ['OBRAS']: [opcionTodas, ...response.data.result] })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const ImprimirReporte = () => {
    dispatch(createSlot({ ['Imprimiendo']: true }));
  };

  const AbrirModal = () => {
    dispatch(createSlot({ ['BuscarData']: true }));

    // if (obra === '' || obra === null || obra === undefined) {
    //   console.log('Debe seleccionar una obra');
    //   return;
    // }

    // dispatch(setIsOpenModal(true));
  };

  useEffect(() => {
    dispatch(createSlot({ ['FechaInicio']: FechaInicio?.toJSON() }));
  }, [FechaInicio]);

  useEffect(() => {
    dispatch(createSlot({ ['FechaFin']: FechaFin?.toJSON() }));
  }, [FechaFin]);

  const onSubmit = () => {};

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ errors, handleChange, handleSubmit, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <Container>
              <Card>
                <Box p={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} lg={12}>
                      <Grid container spacing={2} alignItems={'center'}>
                        <Grid item xs={12} md={6}>
                          <MultiSelect options={Obras} slotName="Obras" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ComponenteSelect
                            label="Tipo de Insumo"
                            tipo="TIPOINSUMO"
                            opcionTodos={true}
                            defaultValue={{ label: 'TODOS', value: '0' }}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <DatePicker
                            maxDate={new Date()}
                            inputRef={inputFechaInicioRef}
                            value={FechaInicio}
                            inputFormat="dd/MM/yyyy"
                            onChange={(newValue) => {
                              setFechaInicio(newValue);
                            }}
                            label="Fecha de Inicio"
                            renderInput={(params) => (
                              <TextField
                                placeholder={'Fecha de Registro'}
                                {...params}
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <DatePicker
                            maxDate={new Date()}
                            inputRef={inputFechaFinRef}
                            value={FechaFin}
                            inputFormat="dd/MM/yyyy"
                            onChange={(newValue) => {
                              setFechaFin(newValue);
                            }}
                            label="Fecha Fin"
                            renderInput={(params) => (
                              <TextField
                                placeholder={Date.now().toString()}
                                {...params}
                                size="small"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={1} alignItems="start">
                          <Button
                            variant="contained"
                            endIcon={<SendTwoToneIcon />}
                            onClick={() => AbrirModal()}
                            //type="submit"
                          >
                            Buscar
                          </Button>
                        </Grid>
                        {ShowPrintButton && (
                          <Grid item xs={2} alignItems="start">
                            <Button
                              variant="outlined"
                              endIcon={<PrintTwoToneIcon />}
                              onClick={() => ImprimirReporte()}
                              //type="submit"
                            >
                              Imprimir
                            </Button>
                          </Grid>
                        )}

                        {ShowPrintButton && (
                          <Grid
                            item
                            xs={3}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent="flex-end"
                          >
                            <Label color="primary" fontSize={20}>
                              {`Gastado: ${TotalGastado?.toLocaleString(
                                'es-MX',
                                {
                                  style: 'currency',
                                  currency: 'MXN'
                                }
                              )}`}
                            </Label>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {isLoading && <LinearProgress />}
                </Box>
              </Card>
            </Container>
          </form>
        )}
      </Formik>
    </>
  );
};

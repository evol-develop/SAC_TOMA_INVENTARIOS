import { forwardRef, useEffect, useRef, useState } from 'react';
import * as ScanditSDK from 'scandit-sdk';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Camera } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Slide,
  Table,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardHeader,
  CardContent,
  Container
} from '@mui/material';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Html5Qrcode,
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats
} from 'html5-qrcode';
import useSound from 'use-sound';
import sound from '../../assets/sonidos/beep.mp3';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
//importar archivo de estilos css
import './estilos.css';
import ScannerIcon from '@mui/icons-material/Scanner';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PublishIcon from '@mui/icons-material/Publish';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import { sucursalInterface } from 'src/interfaces/sucursalInterface';
import { Loading } from '../Loading';
import { usePage } from 'src/hooks/usePage';
import { createSlot, setIsLoading } from 'src/store/slices/page';
import { ToastCompletado, ToastError } from '../SweetAlert2/alerts';
import { set } from 'nprogress';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandLess } from '@mui/icons-material';
import ConfirmDialog from '../ConfirmDialog';
import { APP } from 'src/config';
import { TransitionProps } from '@mui/material/transitions';
import { AnyIfEmpty } from 'react-redux';
import { SnackbarProvider, useSnackbar } from 'notistack';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Configura el área de escaneo
const restrictedArea = {
  left: 0.1,
  right: 0.9,
  top: 0.5, // 50% del alto desde la parte superior
  bottom: 0.5 // 50% del alto desde la parte inferior
};

const scanAreaBorderStyle = {
  position: 'absolute',
  border: '5px solid cyan',
  width: `${(restrictedArea.right - restrictedArea.left) * screenWidth}px`,
  height: `40px`,
  top: `${restrictedArea.top * screenHeight - 5}px`,
  left: `${restrictedArea.left * screenWidth}px`,
  pointerEvents: 'none' // Para asegurarte de que el borde no interfiera con los eventos de clic
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function PantallaPrincipal() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { dispatch } = usePage();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const readerRef = useRef(null);
  const dialogRef = useRef(null);
  const [showUltimoLeidoEnHeader, setShowUltimoLeidoEnHeader] = useState(true);

  const ListadoActual = useAppSelector(
    (state: RootState) => state.page.slots.ListadoActual
  );

  const [CodigosNombres, setCodigosNombres] = useState([]);

  const [ButtonSeleccted, setButtonSeleccted] = useState('Scanner');

  const dataSucursal = useAppSelector(
    (state: RootState) => state.empresa.sucursal
  ) as unknown as sucursalInterface;

  const [AbrirSegundoModal, setAbrirSegundoModal] = useState(false);

  const [ExpandeInfoRenglon, setExpandeInfoRenlgon] = useState({});

  const handleRowClick = (index) => {
    //setExpandeInfoRenlgon((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  //Obtiene la descripcion del articulo y la existencia
  const [codigosNombres] = useState([]);

  async function getCode(code: string) {
    code = code.trimEnd().trimStart();

    let art = codigosNombres.find((x) => x.codigo === code);

    if (!art) {
      try {
        const response = await axios.post<ResponseInterface>(
          `/api/colores/leerCodigo/${code}`
        );

        let registro = {
          codigo: code,
          desc_art: response.data.result.articulo.desc_art.trim(),
          existencia: response.data.result.existencia,
          fecha_ultimo_inventario: response.data.result.fecha_ultimo_inventario
        };

        // Evitar múltiples actualizaciones no controladas
        setCodigosNombres((prev) => {
          const exists = prev.some((x) => x.codigo === code);
          if (!exists) {
            return [...prev, registro];
          }
          return prev;
        });
      } catch (error) {
        console.error('Error fetching code:', error);
      }
    }
  }

  const [isDialogMounted, setIsDialogMounted] = useState(false);

  useEffect(() => {
    setShowUltimoLeidoEnHeader(false);
    setButtonSeleccted('Scanner');
  }, []);

  const modificarCodigos = () => {
    if (ButtonSeleccted === 'Camera') {
      setButtonSeleccted('Scanner');
      setShowUltimoLeidoEnHeader(false);
    }
  };

  const [isOpenn, setOpenn] = useState(true);

  const handleClose = () => {
    setOpenn(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleDelete = (codigo) => {
    const registrosActuales = ListadoActual.filter((x) => x.codigo !== codigo);
    dispatch(createSlot({ ['ListadoActual']: registrosActuales }));
  };

  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);

  const [TodoBien, setTodoBien] = useState(false);
  const [SinRegistros, setSinRegistros] = useState(false);

  useEffect(() => {
    if (TodoBien) {
      setTimeout(() => {
        setTodoBien(false);
        setAbrirSegundoModal(false);
      }, 5000);
    }
  }, [TodoBien]);

  useEffect(() => {
    if (SinRegistros) {
      setTimeout(() => {
        setSinRegistros(false);
      }, 5000);
    }
  }, [SinRegistros]);

  const [ConfirmandoInventario, setConfirmandoInventario] = useState(false);
  const [Ubicacion, setUbicacion] = useState('');

  const GuardaInventario = async (guardaUbicacion: boolean) => {
    if (ConfirmandoInventario) {
      return;
    }

    setConfirmandoInventario(true);

    try {
      dispatch(setIsLoading(true));

      if (ListadoActual.length === 0) {
        ToastError('No hay códigos escaneados');
        dispatch(setIsLoading(false));
        setSinRegistros(true);
        setConfirmandoInventario(false);
        return;
      }

      debugger;

      await axios
        .post<ResponseInterface>(
          `/api/colores/guardarInventario/${
            dataSucursal != undefined ? dataSucursal.clave_sucursal : 0
          }`,
          {
            model: ListadoActual,
            Ubicacion,
            guardaUbicacion
          },
          { timeout: 60000 } // ⏰ 60 segundos de espera máxima
        )
        .then(() => {
          debugger;
          setCodigosNombres([]);
          setTodoBien(true);
          dispatch(createSlot({ ['ListadoActual']: [] }));
          enqueueSnackbar('Datos guardados con exito', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          });
        })
        .catch((error: any) => {
          debugger;
          let message = 'Error al guardar datos';

          if (error?.isAxiosError) {
            if (error.code === 'ECONNABORTED') {
              message = 'La solicitud tardó demasiado. Verifica tu conexión.';
            } else if (!navigator.onLine) {
              message = 'Estás desconectado de internet.';
            } else if (error.message.includes('Network Error')) {
              message = 'Error de red. Revisa tu conexión.';
            } else if (error.response) {
              message = `Error ${error.response.status}: ${
                error.response.data?.message ?? 'Error del servidor'
              }`;
            } else {
              message = error.message;
            }
          } else {
            message =
              (error as Error)?.message ?? 'Error en la conexión.';
          }

          enqueueSnackbar(`ERROR: ${message}`, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          });

          setTodoBien(false);
        })
        .finally(() => {
          debugger;
          dispatch(setIsLoading(false));
          setConfirmandoInventario(false);
          setShowUbicacionInput(false);
          setUbicacion('');
        });
    } catch (error) {
      debugger;
      enqueueSnackbar('ERROR!: ' + error, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
      dispatch(setIsLoading(false));
      setTodoBien(false);
      setConfirmandoInventario(false);
      setShowUbicacionInput(false);
    }
  };

  const [ShowAlertNoDataToPublish, setShowAlertNoDataToPublish] =
    useState(false);
  const AbreSegundoModal = () => {
    if (ListadoActual.length === 0) {
      setSinRegistros(true);

      setShowAlertNoDataToPublish(true);

      return;
    }

    setAbrirSegundoModal(true);
  };

  useEffect(() => {
    if (ShowAlertNoDataToPublish) {
      setTimeout(() => {
        setShowAlertNoDataToPublish(false);
      }, 5000);
    }
  }, [ShowAlertNoDataToPublish]);

  const [ShowUbicacionInput, setShowUbicacionInput] = useState(false);

  const [TypedCode, setTypedCode] = useState('');

  const handleAddCode = (code: string) => {
    if (code === '') {
      return;
    }

    //actualiza todos a ultimo = 0
    const registrosList = ListadoActual.map((x) => ({
      ...x
    }));

    const existingCode = registrosList?.find((x) => x.codigo === code);

    debugger;

    const maxUltimo = registrosList?.reduce(
      (max, x) => Math.max(max, x.ultimo),
      0
    );
    if (existingCode) {
      existingCode.ultimo = maxUltimo + 1;
      existingCode.cantidad = Number(existingCode.cantidad) + 1;

      //actualiza registro modificado
      dispatch(
        createSlot({
          ['ListadoActual']: [
            ...registrosList.filter((x) => x.codigo !== code),
            existingCode
          ]
        })
      );
    } else {
      const registro = {
        codigo: code,
        cantidad: 1,
        ultimo: maxUltimo + 1
      };

      dispatch(
        createSlot({
          ['ListadoActual']: [...registrosList, registro]
        })
      );
      getCode(code);
    }

    setTypedCode('');
    setShowUltimoLeidoEnHeader(true);
  };

  const handleChangeCantidad = (row: any, value: string) => {
    const registrosList = [...ListadoActual];

    const existingCode = registrosList?.find((x) => x.codigo === row.codigo);

    const maxUltimo = registrosList?.reduce(
      (max, x) => Math.max(max, x.ultimo),
      0
    );

    if (existingCode) {
      const updatedCode = {
        ...existingCode,
        cantidad: value === '' ? '' : Number(value)
      };

      dispatch(
        createSlot({
          ListadoActual: [
            ...registrosList.filter((x) => x.codigo !== row.codigo),
            updatedCode
          ]
        })
      );
    }
  };

  const ActualizaPosicion = (row: any) => {
    const registrosList = [...ListadoActual];

    const existingCode = registrosList?.find((x) => x.codigo === row.codigo);

    const maxUltimo = registrosList?.reduce(
      (max, x) => Math.max(max, x.ultimo),
      0
    );

    if (existingCode) {
      const updatedCode = {
        ...existingCode,
        ultimo: maxUltimo + 1
      };

      dispatch(
        createSlot({
          ListadoActual: [
            ...registrosList.filter((x) => x.codigo !== row.codigo),
            updatedCode
          ]
        })
      );
    }
  };

  const handleDeleteAll = () => {
    setCodigosNombres([]);
    setTodoBien(true);
    dispatch(createSlot({ ['ListadoActual']: [] }));
  };

  return (
    <>
      <Dialog
        sx={{ overflow: 'hidden' }}
        ref={dialogRef}
        fullScreen
        open={isOpenn}
        onClose={() => {}}
      >
        <Container sx={{ overflow: 'hidden' }}>
          <Card
            sx={{ overflow: 'hidden', marginTop: '2vh', marginBottom: '1vh' }}
          >
            {ShowAlertNoDataToPublish && (
              <Alert
                severity="warning"
                action={
                  <IconButton
                    aria-label="close"
                    color="error"
                    size="small"
                    onClick={() => {
                      setShowAlertNoDataToPublish(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                No hay datos para publicar
              </Alert>
            )}
            <CardContent sx={{ overflow: 'hidden' }}>
              <Grid
                sx={{ overflow: 'hidden' }}
                container
                spacing={1}
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between" // Agrega esta línea
              >
                <Grid item>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      overflow: 'hidden'
                      //paddingLeft: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: '10vw',
                        height: 'auto',
                        paddingLeft: 1,
                        display: 'flex',
                        justifyContent: 'center', // Centra horizontalmente
                        alignItems: 'center' // Centra verticalmente
                      }}
                      aria-disabled={
                        ListadoActual?.length === 0 || !showUltimoLeidoEnHeader
                      }
                      onTouchStart={function () {
                        document.getElementById('cleanButton').style.color =
                          'red';
                      }}
                      onTouchEnd={function () {
                        document.getElementById('cleanButton').style.color =
                          'gray';
                      }}
                    >
                      <IconButton
                        color="secondary"
                        sx={{ marginRight: '5vw', cursor: 'pointer' }}
                        onClick={() => handleDeleteAll()}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        width: '10vw',
                        height: 'auto',
                        paddingLeft: 1,
                        display: 'flex',
                        justifyContent: 'center', // Centra horizontalmente
                        alignItems: 'center' // Centra verticalmente
                      }}
                      aria-disabled={
                        ListadoActual?.length === 0 || showUltimoLeidoEnHeader
                      }
                      onClick={modificarCodigos}
                    >
                      <ScannerIcon
                        color={
                          ButtonSeleccted === 'Scanner'
                            ? 'success'
                            : 'secondary'
                        }
                        style={{
                          //fontSize: '70px',
                          marginRight: '5vw'
                        }}
                      />
                    </Box>

                    {/* <Box
                      sx={{
                        width: '10vw',
                        height: 'auto',
                        paddingLeft: 1,
                        display: 'flex',
                        justifyContent: 'center', // Centra horizontalmente
                        alignItems: 'center' // Centra verticalmente
                      }}
                      aria-disabled={
                        scannedCodes.length === 0 || showUltimoLeidoEnHeader
                      }
                      onClick={modificarCodigos}
                    >
                      <Camera
                        color={
                          ButtonSeleccted === 'Camera' ? 'success' : 'secondary'
                        }
                        style={{
                          //fontSize: '70px',
                          marginRight: '5vw'
                        }}
                      />
                    </Box> */}

                    <IconButton
                      color="primary"
                      sx={{ marginLeft: '5vw', cursor: 'pointer' }}
                      onClick={AbreSegundoModal}
                    >
                      <PublishIcon />
                    </IconButton>
                  </Box>
                  <Grid />
                </Grid>
                <Grid item>
                  <div
                    style={{
                      width: '70px',
                      height: 'auto',
                      display: 'flex',
                      justifyContent: 'center', // Centra horizontalmente
                      alignItems: 'center' // Centra verticalmente
                    }}
                    aria-disabled={
                      ListadoActual?.length === 0 || showUltimoLeidoEnHeader
                    }
                    onClick={() => {
                      setOpenConfirmDialog(true);
                    }}
                  >
                    <LogoutIcon />
                  </div>
                </Grid>
              </Grid>

              {openConfirmDialog && (
                <ConfirmDialog
                  open={openConfirmDialog}
                  setOpen={setOpenConfirmDialog}
                  handleAcept={handleLogout}
                  encabezadoText="Confirmación"
                  bodyText="¿Salir de la aplicación?"
                  acceptButtonText="Sí"
                  cancelButtonText="No"
                />
              )}

              {showUltimoLeidoEnHeader && ListadoActual ? (
                [...ListadoActual]
                  .filter(
                    (x) =>
                      x.ultimo ===
                      [...ListadoActual].reduce(
                        (max, x) => Math.max(max, x.ultimo),
                        0
                      )
                  )
                  .map((code, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={3}>
                          <Typography variant="body2">Código:</Typography>
                          <Typography variant="body1">Cantidad:</Typography>
                          <Typography variant="body1">Descripción:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="body1">{code.codigo}</Typography>
                          <Typography variant="body1">
                            {code.cantidad}
                          </Typography>
                          <Typography variant="body1">
                            {CodigosNombres?.find(
                              (x) => x.codigo === code.codigo
                            )?.desc_art || 'No se encontró el artículo'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
              ) : (
                <Box></Box>
              )}
            </CardContent>
          </Card>

          {/* {CodigosNombres && CodigosNombres.map((x) => (
            <p key={x.codigo}>
              {x.codigo} - {x.desc_art}
            </p>
          ))} */}

          {true && (
            <>
              <Card
                sx={{
                  position: 'relative',
                  height: '100vh',
                  minHeight: 400,
                  mt: 0
                }}
              >
                <CardContent>
                  {ButtonSeleccted === 'Camera' ? (
                    <div
                      style={{ overflow: 'auto' }}
                      //onClick={PausarDespausarScanner}
                    >
                      <Box
                        width={'100%'}
                        sx={{ overflow: 'auto' }}
                        id="reader"
                        ref={readerRef}
                      ></Box>
                    </div>
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{ width: '100%' }}
                        display={'flex'}
                        justifyContent={'flex-end'}
                      >
                        <h4>Total registros: {ListadoActual?.length}</h4>
                      </Box>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                          Código
                        </InputLabel>
                        <OutlinedInput
                          autoFocus
                          autoComplete="off"
                          id="outlined-adornment-password"
                          endAdornment={
                            <IconButton
                              onClick={(e: any) => {
                                if (e.target.value === '') {
                                  return;
                                }

                                handleAddCode(TypedCode);
                              }}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          }
                          error={false}
                          fullWidth
                          label={'Codigo'}
                          name="codigo"
                          //evento enter
                          onKeyPress={(e: any) => {
                            if (e.key === 'Enter') {
                              if (e.target.value === '') {
                                return;
                              }

                              handleAddCode(TypedCode);
                            }
                          }}
                          onChange={(e) => setTypedCode(e.target.value)}
                          type="text"
                          value={TypedCode}
                          size="medium"
                          inputProps={{
                            style: { textAlign: 'center' }
                          }}
                        />
                      </FormControl>
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ maxHeight: '55vh', overflowY: 'scroll' }}>
                      <Table
                        size="small"
                        className="table table-responsive"
                        sx={{ overflow: 'auto' }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'background.paper',
                                zIndex: 1
                              }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'background.paper',
                                zIndex: 1
                              }}
                              align="left"
                            >
                              Artículo
                            </TableCell>
                            <TableCell
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'background.paper',
                                zIndex: 1
                              }}
                              align="right"
                            >
                              Cantidad
                            </TableCell>
                            <TableCell
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'background.paper',
                                zIndex: 1
                              }}
                              align="right"
                            ></TableCell>
                            {/* <TableCell
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'background.paper',
                                zIndex: 1
                              }}
                              align="right"
                            >
                              Ult. Mov.
                            </TableCell>
                            <TableCell
                              sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'background.paper',
                                zIndex: 1
                              }}
                              align="right"
                            ></TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ListadoActual &&
                            [...ListadoActual]
                              .sort((a, b) => b.ultimo - a.ultimo) // copia segura + orden descendente
                              .map((row: any, index: number) => (
                                <>
                                  <TableRow
                                    key={row.codigo}
                                    sx={{
                                      fontSize: '0.2rem',
                                      '&:last-child td, &:last-child th': {
                                        border: 0
                                      },
                                      backgroundColor:
                                        row.ultimo ===
                                        [...ListadoActual].reduce(
                                          (max, x) => Math.max(max, x.ultimo),
                                          0
                                        )
                                          ? '#b9b9b9'
                                          : 'white'
                                    }}
                                    onClick={() => handleRowClick(index)}
                                  >
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      sx={{ fontSize: '0.6rem' }}
                                      onClick={() => {
                                        setExpandeInfoRenlgon((prev) => ({
                                          ...prev,
                                          [index]: !prev[index]
                                        }));
                                      }}
                                    >
                                      {row.codigo}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      sx={{ fontSize: '0.6rem' }}
                                      onClick={() => {
                                        setExpandeInfoRenlgon((prev) => ({
                                          ...prev,
                                          [index]: !prev[index]
                                        }));
                                      }}
                                    >
                                      {CodigosNombres.find(
                                        (x) => x.codigo === row.codigo
                                      )?.desc_art ||
                                        'No se encontró el artículo'}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      sx={{ fontSize: '0.6rem' }}
                                    >
                                      <TextField
                                        error={false}
                                        fullWidth
                                        helperText={''}
                                        label={''}
                                        name="cantidad"
                                        onChange={(e) => {
                                          handleChangeCantidad(
                                            row,
                                            e.target.value
                                          );
                                        }}
                                        onBlur={(e) => {
                                          ActualizaPosicion(row);
                                        }}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') {
                                            ActualizaPosicion(row);
                                          }
                                        }}
                                        type="number"
                                        value={row.cantidad}
                                        size="small"
                                        margin="none"
                                        inputProps={{
                                          style: {
                                            textAlign: 'right',
                                            fontSize: '0.6rem',
                                            border: 'none'
                                          }
                                        }}
                                        sx={{ height: '100%' }}
                                      />
                                    </TableCell>
                                    <IconButton
                                      onClick={() => {
                                        setExpandeInfoRenlgon((prev) => ({
                                          ...prev,
                                          [index]: !prev[index]
                                        }));
                                      }}
                                    >
                                      {ExpandeInfoRenglon[index] ? (
                                        <ExpandLess />
                                      ) : (
                                        <ExpandMoreIcon />
                                      )}
                                    </IconButton>
                                    <TableCell
                                      align="left"
                                      sx={{ fontSize: '0.6rem' }}
                                    >
                                      <DeleteIcon
                                        color="error"
                                        onClick={() => handleDelete(row.codigo)}
                                      />
                                    </TableCell>
                                  </TableRow>

                                  <TableRow>
                                    <TableCell
                                      style={{
                                        paddingBottom: 0,
                                        paddingTop: 0
                                      }}
                                      colSpan={4}
                                    >
                                      <Collapse
                                        in={ExpandeInfoRenglon[index]}
                                        timeout="auto"
                                        unmountOnExit
                                      >
                                        <Table>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell
                                                align="left"
                                                sx={{ fontSize: '0.6rem' }}
                                              >
                                                EXISTENCIA
                                              </TableCell>
                                              <TableCell
                                                align="left"
                                                sx={{ fontSize: '0.6rem' }}
                                              >
                                                {
                                                  CodigosNombres.find(
                                                    (x) =>
                                                      x.codigo === row.codigo
                                                  )?.existencia
                                                }
                                              </TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell
                                                align="left"
                                                sx={{ fontSize: '0.6rem' }}
                                              >
                                                ULTIMO INVENTARIO
                                              </TableCell>
                                              <TableCell
                                                align="left"
                                                sx={{ fontSize: '0.6rem' }}
                                              >
                                                {
                                                  CodigosNombres.find(
                                                    (x) =>
                                                      x.codigo === row.codigo
                                                  )?.fecha_ultimo_inventario
                                                }
                                              </TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </>
                              ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
        </Container>
        <Box sx={{ width: '100%' }} display={'flex'} justifyContent={'center'}>
          {' '}
          <p style={{ fontSize: '8px', color: 'gray' }}>
            <span>{`FC. ${APP.FECHA_COMPILACION} `}</span>
            <span>{`v.${APP.VERSION}`}</span>
          </p>
        </Box>
      </Dialog>

      <Dialog
        sx={{ overflow: 'hidden' }}
        fullScreen
        open={AbrirSegundoModal}
        onClose={() => {}}
      >
        <Container sx={{ overflow: 'hidden' }}>
          <Card
            sx={{ overflow: 'hidden', marginTop: '2vh', marginBottom: '1vh' }}
          >
            <CardContent sx={{ overflow: 'hidden' }}>
              <Grid
                sx={{ overflow: 'hidden' }}
                container
                spacing={1}
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between" // Agrega esta línea
              >
                <Grid item>
                  <div
                    style={{
                      width: '95px',
                      height: 'auto',
                      display: 'flex',
                      justifyContent: 'center', // Centra horizontalmente
                      alignItems: 'center', // Centra verticalmente
                      userSelect: 'none'
                    }}
                    aria-disabled={
                      ListadoActual?.length === 0 || showUltimoLeidoEnHeader
                    }
                    onClick={() => setAbrirSegundoModal(false)}
                  >
                    <ArrowBackIcon />
                    Regresar
                  </div>
                  <Grid />
                </Grid>
                <Grid item>
                  <div
                    style={{
                      width: '85px',
                      height: 'auto',
                      display: 'flex',
                      justifyContent: 'center', // Centra horizontalmente
                      alignItems: 'center', // Centra verticalmente
                      userSelect: 'none',
                      textAlign: 'center'
                    }}
                    aria-disabled={
                      ListadoActual?.length === 0 || showUltimoLeidoEnHeader
                    }
                    onClick={() => setAbrirSegundoModal(false)}
                  >
                    Preview Inventario Final
                  </div>
                  <Grid />
                </Grid>
                <Grid item>
                  <div
                    style={{
                      width: '85px',
                      height: 'auto',
                      display: 'flex',
                      justifyContent: 'center', // Centra horizontalmente
                      alignItems: 'center', // Centra verticalmente
                      color: ConfirmandoInventario ? 'gray' : 'green',
                      userSelect: 'none'
                    }}
                    aria-disabled={
                      ListadoActual?.length === 0 || showUltimoLeidoEnHeader
                    }
                    onClick={() => {
                      if (ConfirmandoInventario) {
                        return;
                      }

                      setShowUbicacionInput(true);
                    }}
                  >
                    <CheckIcon />
                    Confirmar inventario
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {ShowUbicacionInput && (
            <>
              <Dialog
                open={ShowUbicacionInput}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>
                  ¿Actualizar ubicación de los articulos?
                </DialogTitle>
                <DialogContent
                  sx={{
                    height: '10lvh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TextField
                    size="small"
                    value={Ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    label={'Ubicación'}
                    focused
                  />
                </DialogContent>
                <Divider />
                <DialogActions
                  sx={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowUbicacionInput(false);
                      GuardaInventario(false);
                    }}
                  >
                    No Actualizar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setShowUbicacionInput(false);
                      GuardaInventario(true);
                    }}
                  >
                    Actualizar
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          <Box
            sx={{ width: '100%' }}
            display={'flex'}
            justifyContent={'flex-end'}
          >
            <h4>Total registros: {ListadoActual?.length}</h4>
          </Box>
          {isLoading && (
            <>
              <LinearProgress />
            </>
          )}
          {/* ALERTAS * * * * * * * * * * * * * * * * * * * * * * * * */}
          {/* ALERTAS * * * * * * * * * * * * * * * * * * * * * * * * */}
          {/* ALERTAS * * * * * * * * * * * * * * * * * * * * * * * * */}
          <Collapse in={TodoBien}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setTodoBien(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Datos guardados correctamente
            </Alert>
          </Collapse>
          <Collapse in={SinRegistros}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setSinRegistros(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              No hay registros para subir
            </Alert>
          </Collapse>
          {/* ALERTAS * * * * * * * * * * * * * * * * * * * * * * * * */}
          {/* ALERTAS * * * * * * * * * * * * * * * * * * * * * * * * */}
          {/* ALERTAS * * * * * * * * * * * * * * * * * * * * * * * * */}
          <>
            <Card
              sx={{
                position: 'relative',
                height: '100vh',
                minHeight: 400,
                mt: 0,
                overflow: 'scroll'
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    flexWrap: 'wrap' // Permite que los elementos se bajen si es necesario
                  }}
                >
                  <span
                    style={{
                      fontSize: '8px',
                      marginRight: '1rem',
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    CC - Cantidad Capturada
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      marginRight: '1rem',
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    EA - Existencia Actual
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      marginRight: '1rem',
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    CA - Cantidad Afectada
                  </span>
                  <span
                    style={{
                      fontSize: '8px',
                      marginRight: '1rem',
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    EF - Existencia Final
                  </span>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ maxHeight: '55vh', overflow: 'auto' }}>
                    <Table
                      size="small"
                      className="table table-responsive"
                      sx={{ overflow: 'scroll', minWidth: 800 }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                          >
                            #
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="left"
                          >
                            Artículo
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="left"
                          >
                            Mov
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="right"
                          >
                            CC
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="right"
                          >
                            EA
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="right"
                          >
                            CA
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="right"
                          >
                            EF
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              top: 0,
                              backgroundColor: 'background.paper',
                              zIndex: 1
                            }}
                            align="right"
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ListadoActual?.map((row) => (
                          <TableRow
                            key={row.codigo}
                            sx={{
                              fontSize: '0.2rem',
                              '& td, & th': {
                                // ⬅️ Aplica el color del texto a todas las celdas
                                color:
                                  row.cantidad <
                                  CodigosNombres.find(
                                    (x) => x.codigo.trim() === row.codigo.trim()
                                  )?.existencia
                                    ? '#fff' // Blanco si la cantidad es menor
                                    : row.cantidad >
                                      CodigosNombres.find(
                                        (x) =>
                                          x.codigo.trim() === row.codigo.trim()
                                      )?.existencia
                                    ? '#0a3d0a' // Verde oscuro si la cantidad es mayor
                                    : 'inherit'
                              },
                              backgroundColor:
                                row.cantidad <
                                CodigosNombres.find(
                                  (x) => x.codigo.trim() === row.codigo.trim()
                                )?.existencia
                                  ? '#ff6b6b'
                                  : row.cantidad >
                                    CodigosNombres.find(
                                      (x) =>
                                        x.codigo.trim() === row.codigo.trim()
                                    )?.existencia
                                  ? '#aefcba'
                                  : 'transparent',
                              '&:last-child td, &:last-child th': {
                                border: 0
                              }
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                fontSize: '0.6rem'
                              }}
                            >
                              {row.codigo}
                            </TableCell>
                            <TableCell align="left" sx={{ fontSize: '0.6rem' }}>
                              {CodigosNombres.find(
                                (x) => x.codigo === row.codigo
                              )?.desc_art || 'No se encontró el artículo'}
                            </TableCell>
                            <TableCell align="left" sx={{ fontSize: '0.6rem' }}>
                              {CodigosNombres.find(
                                (x) => x.codigo === row.codigo
                              )?.existencia < row.cantidad
                                ? 'Entrada'
                                : CodigosNombres.find(
                                    (x) => x.codigo === row.codigo
                                  )?.existencia > row.cantidad
                                ? 'Salida'
                                : 'N/M'}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: '0.6rem' }}
                            >
                              {row.cantidad}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: '0.6rem' }}
                            >
                              {
                                CodigosNombres.find(
                                  (x) => x.codigo === row.codigo
                                )?.existencia
                              }
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: '0.6rem' }}
                            >
                              {CodigosNombres.find(
                                (x) => x.codigo === row.codigo
                              )?.existencia < row.cantidad
                                ? row.cantidad -
                                  CodigosNombres.find(
                                    (x) => x.codigo === row.codigo
                                  )?.existencia
                                : CodigosNombres.find(
                                    (x) => x.codigo === row.codigo
                                  )?.existencia - row.cantidad}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: '0.6rem' }}
                            >
                              {row.cantidad}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        </Container>
      </Dialog>
    </>
  );
}

export default PantallaPrincipal;

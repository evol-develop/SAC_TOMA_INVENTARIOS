import { useEffect, useRef, useState } from 'react';
import * as ScanditSDK from 'scandit-sdk';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Camera } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  OutlinedInput,
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
import { setIsLoading } from 'src/store/slices/page';
import { ToastCompletado, ToastError } from '../SweetAlert2/alerts';
import { set } from 'nprogress';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandLess } from '@mui/icons-material';

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

function Scandit() {
  const [TypedCode, setTypedCode] = useState('');
  const { authState, authLocalState, logout } = useAuth();
  const navigate = useNavigate();
  const { dispatch } = usePage();
  const [isInitialized, setIsInitialized] = useState(false);

  const readerRef = useRef(null);
  const dialogRef = useRef(null);
  const [show, setShow] = useState(true);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanCounts, setScanCounts] = useState<
    { codigo: string; cantidad: number }[]
  >([]);
  const [CodigosNombres, setCodigosNombres] = useState([]);

  const [LastScan, setLastScan] = useState(null);

  const beepSoundRef = useRef(null);

  const [ButtonSeleccted, setButtonSeleccted] = useState('Scanner' || 'Camera');

  const [ActualCode, setActualCode] = useState('');

  const dataSucursal = useAppSelector(
    (state: RootState) => state.empresa.sucursal
  ) as unknown as sucursalInterface;

  const [AbrirSegundoModal, setAbrirSegundoModal] = useState(false);

  //lista de 30 elementos con propiedades codigo, cantidad y desc_art
  const [CodigosNombresPrubas, setCodigosNombresPruebas] = useState([
    { codigo: '1000', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1001', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1002', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1003', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1004', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1005', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1006', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1007', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1008', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1009', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1010', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1011', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1012', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1013', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1014', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1015', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1016', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1017', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1018', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1019', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1020', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1021', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1022', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1023', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1024', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1025', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1026', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1027', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1028', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1029', desc_art: 'No encontrado', cantidad: 1 },
    { codigo: '1030', desc_art: 'No encontrado', cantidad: 1 }
  ]);
  const [openRows, setOpenRows] = useState({});

  const handleRowClick = (index) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const initScanditSdk = async () => {
    try {
      await ScanditSDK.configure(
        'AdSU9BnqPSd+EY4D4gBw7bMAwyuYLIgrYlTE74Zn8Qq8bG4p4Eth5tBapGRIA9vIu3GtAeR3ucrGThquPXyZtshdbHstGG+R3yFvlZwyTD8LKcq4EUOlEYBzJPH9e3fXJ3aC9DkBMay+d43opinU0WJGfS45Fm0rkynfdaJnDjNuZMaNcknExU5zM2Mmf96MEzpHQt5aTfGDZu4bXVkM7t8ifqNkF7xMtAnMTotsx8pkVaSG4Ek8QNt18ABmYq/3f1VcuBxeKvsrcIaq9104Bow7WATiefZ2Lj4eGOBjD+3gLOMHCmRsbKh1cxjKX1kLJEAZyz9b0TiOFIFl/UW+Gz4mGxOWcgTIXlQvl51StQrEbnJEIT32ctFQna6lXc7oLhD5nWFgbjN8BBXun2ZBACRW/1C3XOe8eD7yzZtFd4MPZaZ/ngnRetgknVarRwoG9Xt01x9fUzqVbWNRJHYByZhYBbnJGY9MvTaAal4jhkNwcnSjYzROS0V0nvM3V2cLm2t3JEMPD5uGdOHT40ZqHnRbkrtJFS0ttLupP6u4MD1fO4yLrXipapUE/i9PCap9VD2wyI8hYgHYNoo43DnKwVWju+wusWbCaCSs4mT06yLVYVMM4ThstjDo7YBm/qV96Bx143TrgEiMOwVsD7WNTsQxnlJPpb0u4xtDhRJOMoYhVnahaxYqVk5L2tIFk8Gr9uv8saugDoYQZGJvrXnfTlHPSOthMANDBi5kWI3ay6G9+FVpGkUYDUW4dS4/4HaSxdCdXNUe4Q/38dWq4a1aBl4+021Ehx4QHF2BY7Cb8A67IpzX/qt+DKHi51f62r1vq4Qq867xcUyLZl0R7QD42NmvlvMj2PxG8pQOi+HDUEN4SfCQ9FfTMvrVhjlaz6OS3fZMIBR8p8I8Xh0HhAotjySM5i4Af3x+2go8uSJSxaKgR/6/6yEdbgTR1EPzs/JOIztk+9aRsLFD6N02u49DyPh1oO1Wt/Z3GFnOhzh1tDbITChLdnYqZwzMJeVru//jHwKLJqKy2VBAPPecRwpNwloNnjmaBOq7CNwJItPxfVB7uWft4T0NRPlXVEtPuDSTP60SN+XDUYEbNNoWKS8lgyf4lV0mWBb0XmQ65cHy1GZO68nIMPou/O6wc4JgSX3/CYMUHr17jUaCDufwKi1+axuxcSYnylx0u36KRJPYu21gPfAxtU0wGs4Jl3TtZzt0ejROE+Bg',
        {
          engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/'
        }
      );
      const scanner = await ScanditSDK.BarcodePicker.create(
        document.getElementById('your-element-id'),
        {
          playSoundOnScan: true,
          vibrateOnScan: true,
          hideLogo: true
        }
      );

      scanner.setLaserArea({
        x: restrictedArea.left,
        y: restrictedArea.top,
        width: restrictedArea.right - restrictedArea.left,
        height: restrictedArea.bottom - restrictedArea.top
      });

      scanner.applyScanSettings(
        new ScanditSDK.ScanSettings({
          enabledSymbologies: [
            ScanditSDK.Barcode.Symbology.EAN8,
            ScanditSDK.Barcode.Symbology.EAN13,
            ScanditSDK.Barcode.Symbology.UPCA,
            ScanditSDK.Barcode.Symbology.UPCE,
            ScanditSDK.Barcode.Symbology.CODE128,
            ScanditSDK.Barcode.Symbology.CODE39,
            ScanditSDK.Barcode.Symbology.CODE93,
            ScanditSDK.Barcode.Symbology.INTERLEAVED_2_OF_5,
            ScanditSDK.Barcode.Symbology.QR,
            ScanditSDK.Barcode.Symbology.GS1_DATABAR_EXPANDED,
            ScanditSDK.Barcode.Symbology.CODABAR,
            ScanditSDK.Barcode.Symbology.DATA_MATRIX,
            ScanditSDK.Barcode.Symbology.PDF417
          ],
          codeDuplicateFilter: 2000,
          maxNumberOfCodesPerFrame: 1,
          searchArea: {
            x: restrictedArea.left,
            y: restrictedArea.top,
            width: restrictedArea.right - restrictedArea.left,
            height: restrictedArea.bottom - restrictedArea.top
          }
        })
      );

      scanner.on('scan', (event) => {
        const scannedData = event.barcodes[0]?.data;
        if (scannedData) {
          setScannedCodes((prevCodes) => [
            ...prevCodes,
            { codigo: scannedData.trimEnd().trimStart(), cantidad: 1 }
          ]);
        }
      });
    } catch (error) {}
  };

  //Obtiene la descripcion del articulo y la existencia
  const [codigosNombres, setcodigosNombres] = useState([]);

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
    setShow(false);
    setButtonSeleccted('Scanner');
  }, []);

  useEffect(() => {
    setIsDialogMounted(true);
  }, [dialogRef.current]);

  useEffect(() => {
    if (show) {
      const intervalId = setInterval(() => {
        if (isDialogMounted) {
          inithtml5QrcodeScanner();
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [show, isDialogMounted]);

  useEffect(() => {
    updateScanCounts();

    if (scannedCodes.length == 0 && show == false) {
      showScanner();
    }
  }, [scannedCodes]);

  useEffect(() => {
    if (scannedCodes.length === 0 || show === true) {
      setShow(true);
    }
  }, [scannedCodes, show]);

  const modificarCodigos = () => {
    if (ButtonSeleccted === 'Camera') {
      setButtonSeleccted('Scanner');
      setShow(false);
    }
  };

  const showScanner = () => {
    setButtonSeleccted('Camera');
    setShow(true);
    //initScanditSdk();
  };

  const [isOpen, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
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

  const inithtml5QrcodeScanner = () => {
    // Crear una referencia al sonido de beep
    beepSoundRef.current = new Audio(sound);

    // Verificar si el archivo de audio se puede cargar
    beepSoundRef.current.oncanplaythrough = () => {};

    beepSoundRef.current.onerror = (error) => {
      console.error('Error al cargar el archivo de audio:', error);
    };

    // Configurar los formatos soportados
    const config = {
      fps: 0.1,
      qrbox: { width: 750, height: 240 },
      Html5QrcodeSupportedFormats: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13
        // Agrega otros formatos según sea necesario
      ]
    };

    // Inicializar el escáner sin iniciar la cámara
    readerRef.current = new Html5Qrcode('reader');

    const onScanSuccess = (qrCodeMessage: string) => {
      const now = new Date().getTime();

      if (LastScan && now - LastScan < 3000) {
        //alert('Espere 2 segundos antes de escanear otro código');
        return;
      }

      qrCodeMessage = qrCodeMessage.trimEnd().trimStart();

      setActualCode(qrCodeMessage);

      setScannedCodes((prevCodes) => [
        ...prevCodes,
        { codigo: qrCodeMessage, cantidad: 1 }
      ]);

      setLastScan(now);
      beepSoundRef.current.play();

      //esperar 2 segundos
      setTimeout(() => {}, 2000);
    };

    const onScanError = (errorMessage) => {
      setTimeout(() => {}, 3000);
    };

    // Obtener la lista de cámaras disponibles
    Html5Qrcode.getCameras()
      .then((cameras) => {
        // Buscar la cámara trasera
        const rearCamera = cameras.find(
          (camera) =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('trasera')
        );

        // Si se encuentra una cámara trasera, usar su id
        const cameraId = rearCamera ? rearCamera.id : cameras[0].id;

        // Iniciar el escaneo con la cámara seleccionada
        readerRef.current
          .start(
            cameraId,
            {
              fps: 1,
              qrbox: { width: 200, height: 100 },
              // videoConstraints: {
              //   width: { ideal: 1280 },
              //   height: { ideal: 720 }
              // },
              showTorchButtonIfIsSupported: true
            },
            onScanSuccess,
            onScanError
          )
          .catch((err) => {
            //alert('Error al iniciar el escaneo:' + err);
          });
      })
      .catch((err) => {
        //alert('Error al obtener las cámaras:' + err);
      });
  };

  const updateScanCounts = () => {
    const counts = {};
    scannedCodes.forEach((code) => {
      if (counts[code.codigo]) {
        counts[code.codigo] += code.cantidad;
      } else {
        counts[code.codigo] = code.cantidad;
      }
    });

    if (scannedCodes.length > 0) {
      const lastScannedCode = scannedCodes[scannedCodes.length - 1];
      const lastCode = lastScannedCode.codigo.trim();
      const lastCount = counts[lastCode] || 0;

      setScanCounts([{ codigo: lastCode.trim(), cantidad: lastCount }]);

      getCode(lastCode);
    } else {
      setScanCounts([]);
    }
  };

  const accumulatedCounts = {};

  scannedCodes.forEach((row) => {
    const codigo = row.codigo;
    const cantidad = row.cantidad;

    if (accumulatedCounts[codigo]) {
      accumulatedCounts[codigo] += cantidad;
    } else {
      accumulatedCounts[codigo] = cantidad;
    }
  });

  const accumulatedData = Object.keys(accumulatedCounts).map((codigo) => ({
    codigo: codigo.trim(),
    cantidad: accumulatedCounts[codigo]
  }));

  const handleDelete = (codigo) => {
    const indexToDelete = scannedCodes.findIndex(
      (code) => code.codigo === codigo.trim()
    );
    if (indexToDelete !== -1) {
      const updatedScannedCodes = [...scannedCodes];
      updatedScannedCodes.splice(indexToDelete, 1);
      setScannedCodes(updatedScannedCodes);
    }
  };

  const [CantidadEditando, setCantidadEditando] = useState(0);
  const handleChangeCantidad = (e, row) => {
    setCantidadEditando(e.target.value);

    let registros = [...scannedCodes];

    registros.map((x) => {
      if (x.codigo === row.codigo) {
        x.cantidad = e.target.value;
      }
    });

    setScannedCodes([...registros]);
  };

  // const PausarDespausarScanner = () => {
  //   document.getElementById('reader')?.addEventListener('click', function () {
  //     readerRef.current?.pause();
  //     setTimeout(() => {
  //       readerRef.current?.resume();
  //     }, 500);
  //   });
  // };

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

  const GuardaInventario = async () => {
    dispatch(setIsLoading(true));

    if (scannedCodes.length === 0) {
      ToastError('No hay códigos escaneados');
      dispatch(setIsLoading(false));
      setSinRegistros(true);

      return;
    }

    const response = await axios.post<ResponseInterface>(
      `/api/colores/guardarInventario/${dataSucursal.clave_sucursal}`,
      scannedCodes
    );

    if (response.data.isSuccess) {
      setScannedCodes([]);
      setScanCounts([]);
      setCodigosNombres([]);
      dispatch(setIsLoading(false));
      setTodoBien(true);
    } else {
      dispatch(setIsLoading(false));
      setTodoBien(false);
    }
  };

  const AbreSegundoModal = () => {
    if (scannedCodes.length === 0) {
      setSinRegistros(true);
      return;
    }

    setAbrirSegundoModal(true);
  };

  const LimpiaData = () => {
    setScannedCodes([]);
    setScanCounts([]);
    setCodigosNombres([]);
  };

  useEffect(() => {}, [CodigosNombres]);

  return (
    <>
      <Dialog
        sx={{ overflow: 'hidden' }}
        ref={dialogRef}
        fullScreen
        open={isOpen}
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
                      aria-disabled={scannedCodes.length === 0 || !show}
                      onClick={LimpiaData}
                      onTouchStart={function () {
                        document.getElementById('cleanButton').style.color =
                          'red';
                      }}
                      onTouchEnd={function () {
                        document.getElementById('cleanButton').style.color =
                          'gray';
                      }}
                    >
                      <DeleteIcon
                        id={'cleanButton'}
                        color="secondary"
                        sx={{ marginRight: '5vw' }}
                        //style={{ fontSize: '70px' }}
                      />
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
                      aria-disabled={scannedCodes.length === 0 || show}
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

                    <Box
                      sx={{
                        width: '10vw',
                        height: 'auto',
                        paddingLeft: 1,
                        display: 'flex',
                        justifyContent: 'center', // Centra horizontalmente
                        alignItems: 'center' // Centra verticalmente
                      }}
                      aria-disabled={scannedCodes.length === 0 || show}
                      onClick={showScanner}
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
                      aria-disabled={scannedCodes.length === 0 || show}
                      onClick={AbreSegundoModal}
                    >
                      <PublishIcon
                        color={'primary'}
                        style={{
                          //fontSize: '1rem',
                          marginLeft: '5vw'
                        }}
                      />
                    </Box>
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
                    aria-disabled={scannedCodes.length === 0 || show}
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </div>
                </Grid>
              </Grid>

              {show && scanCounts ? (
                scanCounts.map((code, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        <Typography variant="body2">Código:</Typography>
                        <Typography variant="body1">Cantidad:</Typography>
                        <Typography variant="body1">Descripción:</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body1">{code.codigo}</Typography>
                        <Typography variant="body1">{code.cantidad}</Typography>
                        <Typography variant="body1">
                          {CodigosNombres?.find((x) => x.codigo === code.codigo)
                            ?.desc_art || 'No se encontró el artículo'}
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
                              onClick={() => {
                                if (TypedCode === '') {
                                  return;
                                }

                                setScannedCodes((prevCodes) => [
                                  ...prevCodes,
                                  { codigo: TypedCode.trim(), cantidad: 1 }
                                ]);

                                setTypedCode('');

                                //poner el foco de nuevo en el input
                                document
                                  .getElementById('outlined-adornment-password')
                                  .focus();
                              }}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          }
                          error={CantidadEditando < 0}
                          fullWidth
                          // helperText={
                          //   CantidadEditando < 0
                          //     ? 'La cantidad debe ser mayor a 0'
                          //     : ''
                          // }
                          label={'Codigo'}
                          name="codigo"
                          //evento enter
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              if (TypedCode === '') {
                                return;
                              }

                              setActualCode(TypedCode.trim());

                              setScannedCodes((prevCodes) => [
                                ...prevCodes,
                                { codigo: TypedCode.trim(), cantidad: 1 }
                              ]);

                              setTypedCode('');

                              //poner el foco de nuevo en el input
                              document
                                .getElementById('outlined-adornment-password')
                                .focus();
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
                          {accumulatedData.reverse().map((row, index) => (
                            <>
                              <TableRow
                                key={row.codigo}
                                sx={{
                                  fontSize: '0.2rem',
                                  '&:last-child td, &:last-child th': {
                                    border: 0
                                  },
                                  backgroundColor:
                                    ActualCode === row.codigo
                                      ? '#b9b9b9'
                                      : 'white'
                                }}
                                onClick={() => handleRowClick(index)}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ fontSize: '0.6rem' }}
                                >
                                  {row.codigo}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontSize: '0.6rem' }}
                                >
                                  {CodigosNombres.find(
                                    (x) => x.codigo === row.codigo
                                  )?.desc_art || 'No se encontró el artículo'}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontSize: '0.6rem' }}
                                >
                                  <TextField
                                    error={CantidadEditando < 0}
                                    fullWidth
                                    helperText={
                                      CantidadEditando < 0
                                        ? 'La cantidad debe ser mayor a 0'
                                        : ''
                                    }
                                    label={''}
                                    name="cantidad"
                                    onChange={(e) =>
                                      handleChangeCantidad(e, row)
                                    }
                                    type="number"
                                    value={row.cantidad}
                                    size="small"
                                    margin="none"
                                    inputProps={{
                                      style: {
                                        textAlign: 'right',
                                        fontSize: '0.6rem',
                                        border: 'none'
                                      } // Ajusta padding del input
                                    }}
                                    sx={{ height: '100%' }}
                                  />
                                </TableCell>
                                <IconButton>
                                  {openRows[index] ? (
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
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                  colSpan={4}
                                >
                                  <Collapse
                                    in={openRows[index]}
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
                                                (x) => x.codigo === row.codigo
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
                                                (x) => x.codigo === row.codigo
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
                    aria-disabled={scannedCodes.length === 0 || show}
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
                    aria-disabled={scannedCodes.length === 0 || show}
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
                      color: 'green',
                      userSelect: 'none'
                    }}
                    aria-disabled={scannedCodes.length === 0 || show}
                    onClick={() => GuardaInventario()}
                  >
                    <CheckIcon />
                    Confirmar inventario
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
                        {accumulatedData.map((row) => (
                          <TableRow
                            key={row.codigo}
                            sx={{
                              fontSize: '0.2rem',
                              '&:last-child td, &:last-child th': {
                                border: 0
                              }
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ fontSize: '0.6rem' }}
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

export default Scandit;

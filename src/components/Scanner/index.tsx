import { useEffect, useRef, useState } from 'react';
import * as ScanditSDK from 'scandit-sdk';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Camera } from '@mui/icons-material';
import { Box, Button, Grid, Table, TextField, Typography } from '@mui/material';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Container
} from '@mui/material';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import RemoveIcon from '@mui/icons-material/Remove';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import useSound from 'use-sound';
import sound from '../../assets/sonidos/beep.mp3';

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
  const readerRef = useRef(null);
  const [show, setShow] = useState(true);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanCounts, setScanCounts] = useState<
    { codigo: string; cantidad: number }[]
  >([]);
  const [CodigosNombres, setCodigosNombres] = useState([]);

  const beepSoundRef = useRef(null);

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
            ScanditSDK.Barcode.Symbology.CODABAR
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
            { codigo: scannedData, cantidad: 1 }
          ]);
        }
      });
    } catch (error) {
      console.error('Error  Scandit SDK', error);
    }
  };

  async function getCode(code: string) {
    if (
      CodigosNombres.find((element) => element.codigo === code)?.desc_art ===
      undefined
    ) {
      const response = await axios.post<ResponseInterface>(
        `/api/colores/leerCodigo/${code}`
      );

      let registro = { codigo: code, desc_art: response.data.result.trim() };

      let prev = [...CodigosNombres];

      setCodigosNombres([...prev, registro]);
    }
  }

  useEffect(() => {
    if (show) {
      inithtml5QrcodeScanner();
    }
  }, [show]);

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
    if (scannedCodes.length === 0) {
      return;
    }
    setButtonSeleccted('list');
    setShow(false);
  };

  const showScanner = () => {
    setButtonSeleccted('scanner');
    setShow(true);
    //initScanditSdk();
  };

  const inithtml5QrcodeScanner = () => {
    // Crear una referencia al sonido de beep
    beepSoundRef.current = new Audio(sound);

    // Verificar si el archivo de audio se puede cargar
    beepSoundRef.current.oncanplaythrough = () => {
      console.log('Audio cargado correctamente.');
    };

    beepSoundRef.current.onerror = (error) => {
      console.error('Error al cargar el archivo de audio:', error);
    };

    // Inicializar el escáner sin iniciar la cámara
    const scanner = new Html5Qrcode('reader');

    const onScanSuccess = (qrCodeMessage) => {
      const now = new Date().getTime();
      if (!qrCodeMessage || now - qrCodeMessage > 4000) {
        setScannedCodes((prevCodes) => [
          ...prevCodes,
          { codigo: qrCodeMessage, cantidad: 1 }
        ]);

        beepSoundRef.current.play();
      }
    };

    const onScanError = (errorMessage) => {};

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
        scanner
          .start(
            cameraId,
            {
              fps: 1,
              qrbox: {
                width: 750,
                height: 240
              }
            },
            onScanSuccess,
            onScanError
          )
          .catch((err) => {
            console.error('Error al iniciar el escaneo:', err);
          });
      })
      .catch((err) => {
        console.error('Error al obtener las cámaras:', err);
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
      const lastCode = lastScannedCode.codigo;
      const lastCount = counts[lastCode] || 0;

      setScanCounts([{ codigo: lastCode, cantidad: lastCount }]);

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
    codigo: codigo,
    cantidad: accumulatedCounts[codigo]
  }));

  const handleDelete = (codigo) => {
    const indexToDelete = scannedCodes.findIndex(
      (code) => code.codigo === codigo
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

    console.log(registros);

    setScannedCodes([...registros]);
  };

  const [ButtonSeleccted, setButtonSeleccted] = useState('scanner' || 'list');

  return (
    <>
      <Container>
        <Card>
          <CardContent>
            <Grid container spacing={2} direction="row" alignItems="flex-start">
              <Grid item>
                {/* <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  disabled={scannedCodes.length === 0}
                  onClick={() => setScannedCodes([])}
                /> */}
                <div
                  style={{ backgroundColor: '', width: '60px', height: 'auto' }}
                  aria-disabled={scannedCodes.length === 0 || !show}
                  onClick={() => setScannedCodes([])}
                  onTouchStart={function () {
                    document.getElementById('cleanButton').style.color = 'red';
                  }}
                  onTouchEnd={function () {
                    document.getElementById('cleanButton').style.color = 'gray';
                  }}
                >
                  <DeleteIcon
                    id={'cleanButton'}
                    color="secondary"
                    sx={{ margin: '5' }}
                    style={{ fontSize: '70px' }}
                  />
                </div>
              </Grid>
              <Grid item>
                {/* <Button
                  size="medium"
                  variant="contained"
                  color="warning"
                  startIcon={<EditIcon />}
                  disabled={scannedCodes.length === 0 || !show}
                  onClick={modificarCodigos}
                /> */}
                <div
                  style={{
                    width: '60px',
                    height: 'auto',
                    borderBottom:
                      ButtonSeleccted === 'list' ? `4px solid orange` : '0px'
                  }}
                  aria-disabled={scannedCodes.length === 0 || !show}
                  onClick={modificarCodigos}
                >
                  <EditIcon
                    color={ButtonSeleccted === 'list' ? 'warning' : 'secondary'}
                    style={{ fontSize: '60px', marginRight: '25' }}
                  />
                </div>
              </Grid>
              <Grid item>
                {/* <Button
                  size="large"
                  variant="contained"
                  color="success"
                  disabled={scannedCodes.length === 0 || show}
                  startIcon={<Camera />}
                  onClick={showScanner}
                /> */}
                <div
                  style={{
                    width: '70px',
                    height: 'auto',
                    borderBottom:
                      ButtonSeleccted === 'scanner' ? '4px solid green' : '0px'
                  }}
                  aria-disabled={scannedCodes.length === 0 || show}
                  onClick={showScanner}
                >
                  <Camera
                    color={
                      ButtonSeleccted === 'scanner' ? 'success' : 'secondary'
                    }
                    style={{ fontSize: '70px', marginRight: '25' }}
                  />
                </div>
              </Grid>
            </Grid>

            {show && scanCounts ? (
              scanCounts.map((code, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="h2">Código:</Typography>
                      <Typography variant="h2">Cantidad:</Typography>
                      <Typography variant="h2">Descripción:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h2">{code.codigo}</Typography>
                      <Typography variant="h2">{code.cantidad}</Typography>
                      <Typography variant="h2">
                        {CodigosNombres.find((x) => x.codigo === code.codigo)
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

        {!show && scannedCodes.length > 0 ? (
          <Card
            sx={{
              position: 'relative',
              height: '90vh',
              minHeight: 400,
              overflow: 'auto',
              mt: 2
            }}
          >
            <CardContent>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell align="left">Artículo</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accumulatedData.map((row) => (
                    <TableRow
                      key={row.codigo}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.codigo}
                      </TableCell>
                      <TableCell align="left">
                        {CodigosNombres.find((x) => x.codigo === row.codigo)
                          ?.desc_art || 'No se encontró el artículo'}
                      </TableCell>
                      <TableCell align="left">
                        <TextField
                          error={CantidadEditando < 0}
                          fullWidth
                          margin="normal"
                          autoFocus
                          helperText={
                            CantidadEditando < 0
                              ? 'La cantidad debe ser mayor a 0'
                              : ''
                          }
                          label={''}
                          name="cantidad"
                          onChange={(e) => handleChangeCantidad(e, row)}
                          type="number"
                          value={row.cantidad}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<RemoveIcon />}
                          onClick={() => handleDelete(row.codigo)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : null}

        {show && (
          <Box sx={{ mt: 2 }}>
            <div id="reader" ref={readerRef}></div>
          </Box>
        )}
      </Container>
    </>
  );
}

export default Scandit;

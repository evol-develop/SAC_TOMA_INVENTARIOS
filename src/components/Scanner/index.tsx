import React, { useEffect, useState } from 'react';
import * as ScanditSDK from 'scandit-sdk';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Camera } from '@mui/icons-material';
import { Box, Button, Table, TextField } from '@mui/material';
import { number } from 'prop-types';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Container
} from '@mui/material';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import RemoveIcon from '@mui/icons-material/Remove';

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
  top: `${(restrictedArea.top * screenHeight) - 5}px`,
  left: `${restrictedArea.left * screenWidth}px`,
  pointerEvents: 'none' // Para asegurarte de que el borde no interfiera con los eventos de clic
};

function Scandit() {
  const [show, setShow] = useState(true);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanCounts, setScanCounts] = useState<
    { codigo: string; cantidad: number }[]
  >([]);
  const [CodigosNombres, setCodigosNombres] = useState([]);

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
      console.error('Error initializing Scandit SDK', error);
    }
  };

  async function getCode(code: string) {
    if (
      CodigosNombres.find((element) => element.codigo === code)?.desc_art ===
      undefined
    ) {
      debugger;
      const response = await axios.post<ResponseInterface>(
        `/api/colores/leerCodigo/${code}`
      );

      let registro = { codigo: code, desc_art: response.data.result.trim() };

      let prev = [...CodigosNombres];

      setCodigosNombres([...prev, registro]);
    }
  }

  useEffect(() => {
    updateScanCounts();

    if (scannedCodes.length == 0 && show == false) {
      showScanner();
    }
  }, [scannedCodes]);

  useEffect(() => {
    initScanditSdk();
  }, []);

  useEffect(() => {
    if (scannedCodes.length === 0 || show === true) {
      setShow(true);
    }
  }, [scannedCodes, show]);

  const modificarCodigos = () => {
    setShow(false);
  };

  const showScanner = () => {
    setShow(true);
    initScanditSdk();
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

  return (
    <Container sx={{ height: '90vh' }}>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <div className="d-flex flex-column align-items-start justify-space-between">
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={scannedCodes.length === 0}
              style={{ marginRight: '10px' }}
              onClick={() => setScannedCodes([])}
            />

            <Button
              variant="contained"
              color="warning"
              startIcon={<EditIcon />}
              disabled={scannedCodes.length === 0 || !show}
              onClick={modificarCodigos}
              style={{ marginRight: '10px' }}
            />

            <Button
              variant="contained"
              color="success"
              disabled={scannedCodes.length === 0 || show}
              startIcon={<Camera />}
              onClick={showScanner}
            />

            {show && scanCounts ? (
              scanCounts.map((code, index) => (
                <div key={index}>
                  <b>Código:</b> {code.codigo}, <b>Cantidad escaneada:</b>{' '}
                  {code.cantidad}
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </CardContent>
      </Card>

      {!show && scannedCodes.length > 0 ? (
        <Card
          sx={{
            position: 'relative',
            height: '90vh',
            minHeight: 400,
            overflow: 'auto'
          }}
        >
          <CardContent>
            <>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell align="left">Articulo</TableCell>
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
            </>
          </CardContent>
        </Card>
      ) : null}

      {show && (
        <>
          <Box id="your-element-id"></Box>
          <Box id="scan-area-border" sx={scanAreaBorderStyle}></Box>;
        </>
      )}
    </Container>
  );
}

export default Scandit;

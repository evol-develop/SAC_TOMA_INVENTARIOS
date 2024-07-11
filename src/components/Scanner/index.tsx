import React, { useEffect, useState } from 'react';
import * as ScanditSDK from 'scandit-sdk';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Camera } from '@mui/icons-material';
import { Button, Table } from '@mui/material';
import { number } from 'prop-types';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent,Container } from '@mui/material';
import axios from 'src/utils/axios';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import RemoveIcon from '@mui/icons-material/Remove';

function Scandit() {
  const [show, setShow] = useState(true);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [scanCounts, setScanCounts] = useState<{ codigo: string; cantidad: number; }[]>([]);

  const initScanditSdk = async () => {
    try {
        await ScanditSDK.configure('ARSUKCzLCGcrJKuHnRLfpfwknLyHQEfZt3Ks1IJa59t2VjbGPGspAJ9yF+p1PF/LoHqNk0hKCr7dH3agPl3XOZ8Mjd+RLROLdj1GhY4sbvaaJPs63BG4TnJRpouIbsIQjRF4XhsQ85MNQF7YXFu+1N1N4oLxEdVc5XIJ4QVTg+caXYksCh9c251DAd72fepOfwBrThFtwgWvZ7IBG3mKQ+ooa+eeOZZtNhmud69nA8KrRStCgEuMIbRaHzeLepINDVn+mI58eEQiey/uv26gLqhU/KaHTJOoBxlnhpotxSXZcxokRHWSDMRO/6fXQCfADXDRPt4VhBZQWm1v9GKDzJdyRTDOcIzMgFcE8OJrUmghTBNTdUnsbONVmen0cZGWyUidY1kLGusWQ6bHWhSKhukXCR9jDi0VQ2mHRdklLi/0ScOP0CYUgvR2PWWSAFkLXlwtuJxYkHfgRJRtVXbn9FNMIDMMZGF2hFJ5rrt0oW78b4kYfGaNkhoaCq/yF8xiTFqj75AxfQT2JRrZ3H2rRdRXncFvczm3NSgdAVDQyJcUnT+zdLRcgXenV1pORv0BN/TIwMDDsjmQ7i/TmtBPxwxogkyzDD0Dxw7ub8p9BVcAgkJWq1mZc423gNc/qfDIg/MMu61k25kb+X+ChQorFMbTlbPjozdCmJ8IvuQnXCOXHBEHKazksDfR1cTQ1am2b5V/e4SZo1UAn0VewV4bj7stg1/G/j2DkmHNUKkIZLkUMTj4oODHJojTFd8h9poZIhvyuZb5iZI2lATMVcwGkBThbKYOeaFyv+t7CiQZ4RHjZkOBCorJsf0AZjZOBLkLHYqMDXpVkGzy6auQWRGT7drBCZco3YIPHJjorqksNvibOrFiDs+U4nl7UH2HcU9vDuNTu80P8nEuuWSoQxtUlr33vI9j/Oe/RoKDvTr6M53UYyqemZhZ8x7aI7qUA7uLLzhMrhfWsiOIuCnNTs2JuRHj7x8dyhOW0owxvPRn5FrNu6UwBnobdP+0kMctvg2Udy4RU/z+B4194eXRLLDHuYYdsVuAtgqO64wz9qigw3kk5imxBNStMwCNu0swq//52Bzf0zp14SEyHjlusnYNPqryWwvgJs+cGA2fAH7L6nS9yfyJI0//B9Lc/iAI6qKTIZmiUqJVRMA6+Mcl5uFoV3lOW7Kd+cJ9OBselMRY9V+w6Q5J8QQ3EqpYs/RZWJz9w2xpDwZ3wIz7cQ==', { engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/' });
      const scanner = await ScanditSDK.BarcodePicker.create(document.getElementById('your-element-id'), {
        playSoundOnScan: true,
        vibrateOnScan: true,
      });

      scanner.applyScanSettings(new ScanditSDK.ScanSettings({ enabledSymbologies: [ScanditSDK.Barcode.Symbology.EAN8, ScanditSDK.Barcode.Symbology.EAN13, ScanditSDK.Barcode.Symbology.UPCA, ScanditSDK.Barcode.Symbology.UPCE, ScanditSDK.Barcode.Symbology.CODE128, ScanditSDK.Barcode.Symbology.CODE39, ScanditSDK.Barcode.Symbology.CODE93, ScanditSDK.Barcode.Symbology.INTERLEAVED_2_OF_5, ScanditSDK.Barcode.Symbology.QR, ScanditSDK.Barcode.Symbology.GS1_DATABAR_EXPANDED, ScanditSDK.Barcode.Symbology.CODABAR], codeDuplicateFilter: 1000 }));

      scanner.on('scan', event => {
        const scannedData = event.barcodes[0]?.data;
        if (scannedData) {
          setScannedCodes(prevCodes => [...prevCodes, { 'codigo': scannedData, 'cantidad': 1 }]);
         
         getCode(scannedData);

        }
      });

    } catch (error) {
      console.error('Error initializing Scandit SDK', error);
    }
  };

  async function getCode(code:string){

    const response = await axios.post<ResponseInterface>(`/api/colores/leerCodigo/${code}`);	
  
    alert(response.data.result)
  }

  useEffect(() => {
    updateScanCounts();

    if(scannedCodes.length == 0 && show == false){

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
  }

  const updateScanCounts = () => {
    const counts = {};
    scannedCodes.forEach(code => {
      if (counts[code.codigo]) {
        counts[code.codigo] += code.cantidad
      } else {
        counts[code.codigo] = code.cantidad; 
      }
    });
  
    if (scannedCodes.length > 0) {
      const lastScannedCode = scannedCodes[scannedCodes.length - 1];
      const lastCode = lastScannedCode.codigo;
      const lastCount = counts[lastCode] || 0;

      setScanCounts([{ codigo: lastCode, cantidad: lastCount }]);
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
        cantidad: accumulatedCounts[codigo],
    }));

    const handleDelete = (codigo) => {
        const indexToDelete = scannedCodes.findIndex((code) => code.codigo === codigo);
        if (indexToDelete !== -1) {
            const updatedScannedCodes = [...scannedCodes];
            updatedScannedCodes.splice(indexToDelete, 1); 
            setScannedCodes(updatedScannedCodes);
        }
    };

  return (
    <Container>
         <Card  sx={{ marginBottom: 2 }}>
         <CardContent>
         <div className="d-flex flex-column align-items-start justify-space-between">

      <Button
      variant="contained"
      color="error"
      startIcon={<DeleteIcon />}
      disabled={scannedCodes.length === 0}
      style={{ marginRight: '10px' }}
      onClick={() => setScannedCodes([])} />

      <Button
      variant="contained"
      color="warning"
      startIcon={<EditIcon />}
      disabled={scannedCodes.length === 0 || !show }
      onClick={modificarCodigos}
      style={{ marginRight: '10px' }} />
      
        <Button
        variant="contained"
        color="success"
        disabled={scannedCodes.length === 0 || show}
        startIcon={<Camera />}
        onClick={showScanner} />
        
        {/* Códigos escaneados: {scannedCodes.length} */}
      {show && scanCounts ? ( scanCounts.map((code, index) => (
          <>
              <b>Código:</b> {code.codigo}, <b>Cantidad escaneada:</b> {code.cantidad}
          </>
      )) ):(<div></div>)}
    
    </div>
    </CardContent>
    </Card>
    <Card sx={{ position: 'relative', height: '100%', minHeight: 400, maxHeight: 400 }}>
    <CardContent>
    {!show && scannedCodes.length >0 ? 
        (
        <>
        <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                  <TableCell>Código</TableCell>
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
                <TableCell align="right">{row.cantidad}</TableCell>
                <TableCell align="right"> 
                <Button variant="contained" 
                color="error" 
                startIcon={<RemoveIcon />} 
                onClick={() => handleDelete(row.codigo)} /></TableCell>
            </TableRow>
            ))}
            </TableBody>
        </Table>
            
          </>
        ) : null}

{show && (
          <div
            id="your-element-id"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              overflow: 'hidden',
              width: 'auto',
            }}
          >
          
          </div>
        )}
      </CardContent>
    </Card>
    </Container>

  );
}

export default Scandit;

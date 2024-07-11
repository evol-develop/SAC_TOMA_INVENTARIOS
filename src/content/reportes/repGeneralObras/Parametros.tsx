import { DatePicker } from '@mui/lab';
import {
  Autocomplete,
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
import { useState, useEffect, useRef } from 'react';
import { ComponenteSelect } from 'src/components/multiSelect/ComponenteSelect';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useSnackbar } from 'notistack';
import { usePage } from 'src/hooks/usePage';
import useRefMounted from 'src/hooks/useRefMounted';
import { createSlot, updateItemSlot } from 'src/store/slices/page';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import PrintTwoToneIcon from '@mui/icons-material/PrintTwoTone';
import { ObrasInfoInterface } from 'src/interfaces/entidades/Vistas/obrasInfoInterface';
import MultiSelect from 'src/components/multiSelect/componenteMultiSelect';
import { Loading } from 'src/components/Loading';

const initialValues = {};

export const Parametros = () => {
  let DataEncontrada = useAppSelector(
    (state: RootState) => state.page.slots.REPGENERALOBRAS
  );

  const isLoading = useAppSelector((state: RootState) => state.page.isLoading);

  const Obras = useAppSelector((state: RootState) => state.page.slots.OBRAS);

  const { dispatch } = usePage();

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

  const ImprimirReporte = () => {
    dispatch(createSlot({ ['Imprimiendo']: true }));
  };

  const BuscarDatos = () => {
    dispatch(createSlot({ ['BuscarData']: true }));
  };

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
                          {Obras ? (
                            <MultiSelect options={Obras} slotName='Obras'/>
                          ) : (
                            <Loading />
                          )}
                        </Grid>

                        <Grid item xs={2} alignItems="start">
                          <Button
                            variant="contained"
                            endIcon={<SendTwoToneIcon />}
                            onClick={() => BuscarDatos()}
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

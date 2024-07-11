import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import {
    ENDPOINTDELETE,
  Formulario,
  OperacionesFormulario,
  PAGE_SLOT,
  initialValues,
  titulos,
  validationSchema
} from './config';
import { usePage } from 'src/hooks/usePage';
import { useCallback, useEffect } from 'react';
import axios from 'src/utils/axios';
import { createSlot } from 'src/store/slices/page';
import { userResult } from 'src/interfaces/responseInterface';
import { Helmet } from 'react-helmet-async';
import { APP } from 'src/config';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { CatalogoHeader } from '../catalogoGenerico/CatalogoHeader';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { Results } from './Results';
// import { ObrasInterface } from 'src/interfaces/entidades/obrasInterface';
// import { ColaboradoresInterface } from 'src/interfaces/entidades/colaboradoresInterface';
import { RolInterface } from 'src/interfaces/entidades/rolInterface';

const ManagementRoles = () => {
  const isMountedRef = useRefMounted();
  const { authLocalState } = useAuth();
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario();
  const { init, dispatch } = usePage(PAGE_SLOT);

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/roles/getroles`, {
        headers: { 'Content-Type': 'application/text' }
      });

      if (isMountedRef.current) {
        dispatch(
          createSlot({ [PAGE_SLOT]: response.data.result as RolInterface[] })
        );

        dispatch(createSlot({ ENDPOINTDELETE: ENDPOINTDELETE}));

        dispatch(createSlot({ ModalType: 'Rol' }));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    init();
    getData();
  }, [getData]);

  return (
    <>
      <Helmet>
        <title>{APP.NOMBRE} - {PAGE_SLOT}</title>
      </Helmet>

      <PageTitleWrapper>
        <CatalogoHeader
          PAGE_SLOT={PAGE_SLOT}
          initialValues={initialValues}
          validationSchema={validationSchema}
          createItemCatalogo={createItemCatalogo}
          UpdateItemCatalogo={updateItemCatalogo}
          titulos={titulos}
          Formulario={Formulario}
        />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Results />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default ManagementRoles;

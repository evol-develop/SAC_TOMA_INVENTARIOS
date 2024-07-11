import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP } from 'src/config';
import Footer from 'src/components/Footer';
import{ usePage} from 'src/hooks/usePage';
import Scandit from 'src/components/Scanner/index';
import { Typography } from '@mui/material';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

const ManagementConceptosGastos = () => {
  const isMountedRef = useRefMounted();
  const { authLocalState } = useAuth();
  const { init, dispatch } = usePage("INVENTARIO");

  const getData = useCallback(async () => {
    try {

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
        <title>{APP.NOMBRE} - Toma Inventarios</title>
      </Helmet>

      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>


      <Scandit />
      <Footer />
    </>
  );
};

export default ManagementConceptosGastos;
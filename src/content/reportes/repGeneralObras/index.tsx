import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { APP } from 'src/config';
import { usePage } from 'src/hooks/usePage';
import { PAGE_SLOT } from './config';
import PageHeader from './PageHeader';
import { Parametros } from './Parametros';
import { GridRegistros } from './GridRegistros';
import { setIsLoading } from 'src/store/slices/page';

const ReporteGastosObra = () => {
  const { init, dispatch } = usePage(PAGE_SLOT);
  init();
  dispatch(setIsLoading(false))

  return (
    <>
      <Helmet>
        <title>{APP.NOMBRE} - Reporte General de Obras</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Parametros />

      <GridRegistros />

      <Footer />
    </>
  );
};

export default ReporteGastosObra;


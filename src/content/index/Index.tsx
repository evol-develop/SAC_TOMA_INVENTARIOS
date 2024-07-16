import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { userResult } from 'src/interfaces/responseInterface';
import PageHeader from './PageHeader';
import { APP } from 'src/config';
import { useCallback, useEffect } from 'react';
import axios from 'src/utils/axios';
import useRefMounted from 'src/hooks/useRefMounted';
import { usePage } from 'src/hooks/usePage';
import { createSlot } from 'src/store/slices/page';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import { sucursalInterface } from 'src/interfaces/sucursalInterface';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import { coloresInterface } from 'src/interfaces/coloresInterface';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{APP.NOMBRE} - Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Footer />
    </>
  );
};

export default Index;

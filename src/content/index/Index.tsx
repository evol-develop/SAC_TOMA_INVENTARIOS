import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { userResult } from 'src/interfaces/responseInterface';
import PageHeader from './PageHeader';
import { APP } from 'src/config';
import { useCallback, useEffect } from 'react';
import axios from 'src/utils/axios';
import useRefMounted from 'src/hooks/useRefMounted'
import { usePage } from 'src/hooks/usePage';
import { createSlot } from 'src/store/slices/page'
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import { sucursalInterface } from 'src/interfaces/sucursalInterface';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import {coloresInterface } from 'src/interfaces/coloresInterface';

const Index = () => {

  const dataSucursal = (useAppSelector((state: RootState) => state.empresa.sucursal) as unknown) as sucursalInterface

  const PAGE_SLOT = "COLORES";
  const { init, dispatch } = usePage(PAGE_SLOT)
  const isMountedRef = useRefMounted()

const getColores = useCallback(async () => {
    
  try {

    console.log('getColores')
    const response = await axios.get<ResponseInterface>('/api/colores/getColores' );

    console.log(response)

    if (isMountedRef.current) {
      dispatch(createSlot({ [PAGE_SLOT]: response.data.result as userResult[] }))

    }
  } catch (err) {
    console.error(err)
  }
}, [isMountedRef])

useEffect(() => {
  init()
 

  if(dataSucursal){
    getColores()
  }
}, [dataSucursal])

 const colores = (useAppSelector((state: RootState) => state.page.slots) as unknown) 



  return (

   
    <>
      <Helmet>
        <title>{APP.NOMBRE} - Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
  
      

        <table>
         
        <tbody>
    {colores[PAGE_SLOT] && colores[PAGE_SLOT].map((item: coloresInterface) => (
      <tr key={item.clave_color}>
        {console.log(item.color)}
         <td style={{ backgroundColor: item.color.trim() =="ROJO" ? 'red': item.color.trim() =="AMARILLO" ? 'yellow': 'brown' , width: '50px', height: '20px' }}></td>
      </tr>
    ))}
  </tbody>
        </table>
        
      <Footer />
    </>
  );
}

export default Index

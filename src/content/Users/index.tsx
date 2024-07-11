import { useCallback, useEffect, useState } from 'react'

import { Helmet } from 'react-helmet-async'
import Footer from 'src/components/Footer'

import { Grid } from '@mui/material'
import useRefMounted from 'src/hooks/useRefMounted'

import PageTitleWrapper from 'src/components/PageTitleWrapper'

import { APP } from 'src/config'
import useAuth from 'src/hooks/useAuth'
import { usePage } from 'src/hooks/usePage'
import { userResult } from 'src/interfaces/responseInterface'
import { createSlot } from 'src/store/slices/page'
import { CatalogoHeader } from '../catalogos/catalogoGenerico/CatalogoHeader'
import { Results } from './Results'
import { PAGE_SLOT, Formulario, initialValues, titulos, validationSchema, OperacionesFormulario } from './config'
import { useAppSelector } from 'src/hooks/storeHooks'
import { RootState } from 'src/store/store'
import axios from 'src/utils/axios'



const ManagementUsuarios = () => {


  const isMountedRef = useRefMounted()
  const { authLocalState } = useAuth()
  const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario()
  const { init, dispatch } = usePage(PAGE_SLOT)


  const getUsers = useCallback(async () => {
    
    try {

      // const response = await getUsuariosByEmpresa(authLocalState.user.infoAdicional.idEmpresa)
      
      const response = await axios.get(`/api/user/getusers`);

      if (isMountedRef.current) {
        dispatch(createSlot({ [PAGE_SLOT]: response.data.result as userResult[] }))

      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef])

  useEffect(() => {
    init()
    getUsers()
  }, [getUsers])

  return (
    <>
      <Helmet>
        <title>{APP.NOMBRE} - Usuarios</title>
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
  )
}

export default ManagementUsuarios

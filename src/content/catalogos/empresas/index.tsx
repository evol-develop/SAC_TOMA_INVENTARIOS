import { Grid } from "@mui/material"
import { useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import Footer from "src/components/Footer"
import PageTitleWrapper from "src/components/PageTitleWrapper"
import { usePage } from "src/hooks/usePage"
import useRefMounted from "src/hooks/useRefMounted"

import { getItems } from "src/api/genericApi"
import { EmpresaInterface } from "src/interfaces/empresaInterface"
import { createSlot } from "src/store/slices/page"
import PageHeader from "./PageHeader"
import Results from "./Result"
import { entidades } from "src/config/entities"
import useAuth from "src/hooks/useAuth"
import { Formulario, OperacionesFormulario, initialValues, titulos, validationSchema } from "../empresas/config"
import { ResponseInterface } from "src/interfaces/responseInterface"
import { APP } from "src/config"
import { CatalogoHeader } from "../catalogoGenerico/CatalogoHeader"
import axios from "src/utils/axios"


const PAGE_SLOT = entidades.EMPRESAS


const ManagementCatalogo = () => {


    const isMountedRef = useRefMounted()
    const { init, dispatch, pageName } = usePage(PAGE_SLOT)
    const { authLocalState } = useAuth()
	const { createItemCatalogo, updateItemCatalogo } = OperacionesFormulario()
	const idEmpresa = authLocalState.user.empresa.id

    const getData = useCallback(async () => {
        try {
            const response = await axios.get<ResponseInterface>('api/Empresas/GetAllEmpresas');

            if (isMountedRef.current) {
                dispatch(createSlot({ [PAGE_SLOT]: response.data.result as EmpresaInterface[] }))
            }
        } catch (err) {
            console.error(err)
        }
    }, [isMountedRef])
    // const getData = useCallback(async () => {
    //     try {
    //         // const response = await axios.get<ResponseInterface>('api/rutas/getrutas');
    //         const response = await getItems(PAGE_SLOT)
    //         if (isMountedRef.current) {
    //             dispatch(createSlot({ [PAGE_SLOT]: response as EmpresaInterface[] }))
    //         }
    //     } catch (err) {
    //         console.error(err)
    //     }

       
    // }, [isMountedRef])



 
    useEffect(() => {
        init()
        getData()

    }, [getData]);


    return (
        <>
           <Helmet>
				<title>{APP.NOMBRE} - Empresas</title>
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

export default ManagementCatalogo;
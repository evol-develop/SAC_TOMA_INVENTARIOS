
import { Box, IconButton, Link, Tooltip, Zoom, styled } from "@mui/material";
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import GastosInterface from "src/interfaces/entidades/gastosInterface";
import { useState } from "react";
import { uploadFile } from "src/api/storageApi";
import { entidades } from "src/config/entities";
import useAuth from "src/hooks/useAuth";
import { ResponseInterface } from "src/interfaces/responseInterface";
import { updateItemSlot } from "src/store/slices/page";
// import { PAGE_SLOT } from "src/content/procesos/capturaGastos/config";
import axios from "src/utils/axios";



const Input = styled('input')({
    display: 'none'
});


const ButtonUploadWrapper = styled(Box)(
    ({ theme }) => `
    

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(3)};
      height: ${theme.spacing(3)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

interface Props {
    registroGasto: GastosInterface
}


export const AccionesArchivo = ({ registroGasto }: Props) => {

    const [archivoUrl, setArchivoUrl] = useState(null);
    const [isLoadingArchivo, setIsLoadingArchivo] = useState(false)
    const { authState, authLocalState } = useAuth();

    const idEmpresa = authState ? authState.user.empresa.id.toString() : authLocalState.user.empresa.id.toString()


    const onChangeArchivo = async (event) => {

        setIsLoadingArchivo(true)
        const file = event.target.files[0];
        // const reader = new FileReader();
        const archivoAnterior = registroGasto.urlComprobante


        await uploadFile('COMPROBANTES', file, archivoAnterior).then(async (file) => {
            // registroGasto.urlComprobante = file.fullPath
            //user.photoNameFile = file.nombre


            try {
                const response = await axios.post<ResponseInterface>('api/gastos/update', {
                    ...registroGasto, urlComprobante: file.fullPath
                });

                const message = response.data.message;
                const isSuccess = response.data.isSuccess;
                const result = response.data.result;

                if (isSuccess) {
                    // dispatch(updateItemSlot({ state: PAGE_SLOT, data: response.data.result as PaquetesInterface[] }))

                    // dispatch(
                    //     updateItemSlot({
                    //         state: PAGE_SLOT,
                    //         data: response.data.result //as GastosInterface
                    //     })
                    // );


                }
            }
            catch (err) {
                console.error(err);
                setIsLoadingArchivo(false)

            }

            // updateItem(entidades., user.id, user).then(() => {
            // 	const message = 'La imagen de perfil se actualizo correctamente.'
            // 	enqueueSnackbar(message, {
            // 		variant: 'success',
            // 		anchorOrigin: { vertical: 'top', horizontal: 'center'},
            // 		TransitionComponent: Zoom
            // 	});			
            // })

        }).catch((err) => {
            setIsLoadingArchivo(false)
        })

        // reader.onloadend = () => {
        // 	setProfileUrl(reader.result);
        // };

        // reader.readAsDataURL(file);
        setIsLoadingArchivo(false)


    }


    const CargaComprobante = () => {
        return (
            <Tooltip title={'Cargar Comprobante'} arrow color="warning">
                <ButtonUploadWrapper>
                    <Input
                        //accept="image/*"
                        id="icon-button-file"
                        name="icon-button-file"
                        type="file"
                        onChange={onChangeArchivo}

                    />
                    <label htmlFor="icon-button-file">
                        <IconButton component="span" color="primary">
                            <UploadTwoToneIcon />
                        </IconButton>
                    </label>
                </ButtonUploadWrapper>
            </Tooltip>)

    }
    const DescargaComprobante = () => {
        return (
            <Tooltip title={'Descargar Comprobante'} arrow color="warning">
                <ButtonUploadWrapper>

                    {/* <label htmlFor="icon-button-file"> */}
                    <Link href={registroGasto.urlComprobante} target="_blank" >
                        <IconButton component="span" color="primary">
                            <FileDownloadTwoToneIcon />
                        </IconButton>
                    </Link>
                    {/* </label> */}
                </ButtonUploadWrapper>
            </Tooltip>)

    }


    return (<>
    <CargaComprobante /> 
        {
            (registroGasto.urlComprobante.length > 0)&&
                <DescargaComprobante />



        }



    </>

    )


}



function enqueueSnackbar(message: string, arg1: { variant: string; anchorOrigin: { vertical: string; horizontal: string; }; TransitionComponent: any; }) {
    throw new Error("Function not implemented.");
}

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}


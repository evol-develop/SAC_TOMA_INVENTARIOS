import { Box, CircularProgress, Container, Modal, Typography } from "@mui/material"
import { useAppSelector } from "src/hooks/storeHooks"
import { RootState } from "src/store/store"



const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 230,
    bgcolor: 'background.paper',
    p: 4,
    z:9999

};

export const Loading = () => {

    const isLoagding = useAppSelector((state: RootState) => state.page.isLoading)

    return (
        <>
            {
                
                isLoagding &&

                <Modal
                    open={isLoagding}
                >
                    <Box sx={style}>
                        <Box sx ={{pl:4}}>
                            <CircularProgress size={70} />

                        </Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Cargando Información...
                        </Typography>

                    </Box>
                </Modal>


            }
        </>
    )

}
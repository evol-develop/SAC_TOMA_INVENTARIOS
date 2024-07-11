import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Divider } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
})



interface Props {
    encabezadoText: string,
    bodyText: string
    open: boolean,
    setOpen: (state: boolean) => void
    handleAcept: () => void
    acceptButtonText?: string
    cancelButtonText?: string
    component?: React.ReactNode
}

const ConfirmDialog = ({ open,
                        setOpen,
                        handleAcept,
                        encabezadoText,
                        bodyText,
                        acceptButtonText = 'Aceptar',
                        cancelButtonText = 'Cancelar',
                        component = (<></>)}: Props) => {

    const handeAcept = () => {
        setOpen(false);
        handleAcept()
    }


    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{encabezadoText}</DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {bodyText}
                        {component}
                    </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>{cancelButtonText}</Button>
                    <Button onClick={handeAcept}>{acceptButtonText}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmDialog
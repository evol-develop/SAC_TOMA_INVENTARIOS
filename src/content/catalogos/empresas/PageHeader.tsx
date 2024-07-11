
import { Formik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';


import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
    Typography,
    Zoom
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { createItem, updateItem } from 'src/api/genericApi';
import { useAppSelector } from 'src/hooks/storeHooks';
import { usePage } from 'src/hooks/usePage';
import { EmpresaInterface } from 'src/interfaces/empresaInterface';
import { addItemSlot, setDataModal, setIsEditing, setIsOpenModal, updateItemSlot } from 'src/store/slices/page';
import { RootState } from 'src/store/store';
import { entidades } from 'src/config/entities';

const PAGE_SLOT = entidades.EMPRESAS



const initialValues = {
    nombre: '',
    nombreCorto :'',
    representante:'',
    telefono:'',
    correo:'',
    direccion:'',
    pictureURL:'',
    isActive:true    
}
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/



const validationSchema = () => Yup.object().shape({
    nombre: Yup.string()
        .max(120)
        .required('La nombre es un dato requerido'),
    nombreCorto: Yup.string()
        .max(120)
        .required('La nombre corto es un dato requerido'),
    representante: Yup.string()
        .max(120)
        .required('La representante es un dato requerido'),
    telefono: Yup.string()
        .max(10)
        .required('La telefono es un dato requerido')        
        .matches(phoneRegExp, 'El Telefono no es un numero valido'),
    correo: Yup.string()
        .max(120)
        .required('La correo es un dato requerido')
        .email(),        
    direccion: Yup.string()
        .max(120)
        .required('La direccion es un dato requerido'),
    
})





const PageHeader = () => {

    const { dispatch } = usePage(PAGE_SLOT)
    const open = useAppSelector((state: RootState) => state.page.isOpenModal)
    const dataModal = useAppSelector((state: RootState) => state.page.dataModal) as EmpresaInterface
    const { enqueueSnackbar } = useSnackbar();



    useEffect(() => {
        if (dataModal.id !== undefined) {

             } else {
          
        }
    }, [open])



    const handleCreateItemOpen = () => {
        dispatch(setIsOpenModal(true))
    };

    const handleCreateItemClose = () => {
        dispatch(setIsEditing(false))
        dispatch(setDataModal({}))
        dispatch(setIsOpenModal(false))
    };

    const onSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting, }) => {

        // try { 
        //     if (dataModal.id === undefined){
        //         const response = await crearUsuario(_values.correo, 'ADMINISTRADOR','' )
        //         if (!response.isSuccess ){
        //             const isSuccess = response.isSuccess
        //             throw(response.message)
        //         }
        //         //crea empresa
        //         const empresa = await createItem(PAGE_SLOT, _values)
        //         const infoAdicional = {...response.result.infoAdicional, idEmpresa:empresa.id }
        //         await updateItem(entidades.USUARIOS, response.result.infoAdicional.id, infoAdicional)
        //         dispatch(addItemSlot({ state: PAGE_SLOT, data: _values as EmpresaInterface[] }))
        //     }
        //     else{
        //         dispatch(updateItemSlot({ state: PAGE_SLOT, data: _values as EmpresaInterface[] }))
        //         await updateItem(PAGE_SLOT, dataModal.id, _values)
        //     }
                        
        //     const message = 'Se registro correctamente: '+_values.nombre ;
        //     const isSuccess = true;

        //     if (isSuccess) {
        //         resetForm();
        //         setStatus({ success: true });
        //         setSubmitting(false);

        //     } else {
        //         setStatus({ success: false });
        //         setSubmitting(false);
        //     }
        //     handleCreateItemSuccess(isSuccess, message);


        // } catch (err) {
        //     //console.error(err);
        //     handleCreateItemSuccess(false, err);
        //     setStatus({ success: false });
        //     setErrors({ submit: err.message });
        //     setSubmitting(false);
        // }

    }

    const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
        enqueueSnackbar(message, {
            variant: isSuccess ? 'success' : 'error',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            TransitionComponent: Zoom
        });
        dispatch(setIsOpenModal(!isSuccess))
        dispatch(setDataModal({}))
    };

    return (
        <>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                 
                     
                            <Typography variant="h3" component="h3" gutterBottom>
                                {'Administración de Empresas'}
                            </Typography>
                            <Typography variant="subtitle2">
                                {'Todos los aspectos relacionados con las Empresas pueden ser administrados aquí.'}
                            </Typography>
                      


                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 }
                        }}
                        onClick={handleCreateItemOpen}
                        variant="contained"
                        startIcon={<AddTwoToneIcon fontSize="small" />}
                    >
                        {'Crear Empresa'}
                    </Button>
                </Grid>
            </Grid>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={handleCreateItemClose}
            >
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        {(dataModal.id === undefined) ? 'Agregar nueva Empresa' : 'Editar Empresa'}
                    </Typography>
                    <Typography variant="subtitle2">
                        {(dataModal.id === undefined) ? 'Llena los campos para crear una nueva Empresa.' : 'Llena los campos para editar la Empresa.'}
                    </Typography>
                </DialogTitle>

                <Formik
                    initialValues={(dataModal.id === undefined) ? initialValues : dataModal}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}

                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogContent
                                dividers
                                sx={{
                                    p: 3
                                }}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={12}>
                                        <Grid container spacing={1}>
                                            {
                                                (dataModal.id !== undefined) && (<>
                                                    <Grid item xs={12} md={9}> </Grid>
                                                    <Grid item xs={12} md={3} >
                                                        <FormControlLabel control={
                                                            <Switch
                                                                name="isActive"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values.isActive || false}
                                                                color="success"
                                                                checked={values.isActive || false}
                                                            />}
                                                            label={values.isActive ? "Activo" : "Inactivo"}
                                                            labelPlacement="start"
                                                        />
                                                    </Grid>
                                                </>)
                                            }
{/* 
                                            <Grid item xs={6}>
                                                <TextField
                                                    error={Boolean(touched.nombre && errors.nombre)}
                                                    fullWidth
                                                    helperText={touched.nombre && errors.nombre}
                                                    label={'Nombre'}
                                                    name="nombre"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.nombre}
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    error={Boolean(touched.nombreCorto && errors.nombreCorto)}
                                                    fullWidth
                                                    helperText={touched.nombreCorto && errors.nombreCorto}
                                                    label={'Nombre Corto'}
                                                    name="nombreCorto"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.nombreCorto}
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    error={Boolean(touched.telefono && errors.telefono)}
                                                    fullWidth
                                                    helperText={touched.telefono && errors.telefono}
                                                    label={'Telefono'}
                                                    name="telefono"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.telefono}
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    error={Boolean(touched.correo && errors.correo)}
                                                    fullWidth
                                                    helperText={touched.correo && errors.correo}
                                                    label={'Correo'}
                                                    name="correo"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.correo}
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    error={Boolean(touched.direccion && errors.direccion)}
                                                    fullWidth
                                                    helperText={touched.direccion && errors.direccion}
                                                    label={'Direccion'}
                                                    name="direccion"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.direccion}
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    error={Boolean(touched.representante && errors.representante)}
                                                    fullWidth
                                                    helperText={touched.representante && errors.representante}
                                                    label={'Representante'}
                                                    name="representante"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.representante}
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    size="small"
                                                />
                                            </Grid>

 */}




                                        </Grid>
                                    </Grid>

                                </Grid>
                            </DialogContent>
                            <DialogActions
                                sx={{
                                    p: 3
                                }}
                            >
                                <Button color="secondary" onClick={handleCreateItemClose}>
                                    {'Cancelar'}
                                </Button>
                                <Button
                                    type="submit"
                                    startIcon={
                                        isSubmitting ? <CircularProgress size="1rem" /> : null
                                    }
                                    disabled={Boolean(errors.submit) || isSubmitting}
                                    variant="contained"
                                >
                                    {(dataModal.id === undefined) ? 'Agregar nueva Empresa' : 'Gaurdar Cambios'}
                                </Button>
                            </DialogActions>
                        </form>
                    )}

                </Formik>


            </Dialog>
        </>
    );
}

export default PageHeader;




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
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { createItem, updateItem } from 'src/api/genericApi';
import { useAppSelector } from 'src/hooks/storeHooks';
import useAuth from 'src/hooks/useAuth';
import { usePage } from 'src/hooks/usePage';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import {
  addItemSlot,
  setDataModal,
  setIsEditing,
  setIsOpenModal,
  setModalSize,
  updateItemSlot
} from 'src/store/slices/page';
import { RootState } from 'src/store/store';

interface Props {
  PAGE_SLOT: string;
  initialValues: {};
  validationSchema: any;
  createItemCatalogo: (values: any, idEmpresa: string) => any;
  UpdateItemCatalogo: (values: any, id: string) => Promise<any>;
  titulos: {
    titulo: string;
    descripcion: string;
    nombreItem: string;
    tituloModal?: string;
    descripcionModal?: string;
  };
  Formulario: (
    dataModal: any,
    onSubmit: any,
    handleCreateItemClose: any
  ) => JSX.Element;
}

export const CatalogoHeader = ({
  PAGE_SLOT,
  initialValues,
  validationSchema,
  createItemCatalogo,
  UpdateItemCatalogo,
  titulos,
  Formulario
}: Props) => {
  const { dispatch } = usePage(PAGE_SLOT);
  const open = useAppSelector((state: RootState) => state.page.isOpenModal);
  const dataModal = useAppSelector((state: RootState) => state.page.dataModal);
  const { enqueueSnackbar } = useSnackbar();
  const { idEmpresa } = useAuth();
  const globalState = useAppSelector((state: RootState) => state.page.slots);
  const ModalSize = useAppSelector((state: RootState) => state.page.modalSize);

  useEffect(() => {
    if (dataModal.id !== undefined) {
    } else {
    }
  }, [open]);

  const handleCreateItemOpen = () => {
    dispatch(setIsOpenModal(true));
  };

  const handleCreateItemClose = () => {
    dispatch(setIsEditing(false));
    dispatch(setDataModal({}));
    dispatch(setIsOpenModal(false));
    dispatch(setModalSize('sm'))
  };

  const onSubmit = async (
    _values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    let itemResponse: ResponseInterface = undefined;

    try {
      if (dataModal.id === undefined) {
        itemResponse = (await createItemCatalogo(
          { values: _values, globlaState: globalState },
          idEmpresa
        )) as ResponseInterface;

        if (itemResponse.isSuccess) {
          dispatch(
            addItemSlot({ state: PAGE_SLOT, data: itemResponse.result })
          );
        }
      } else {
        itemResponse = (await UpdateItemCatalogo(
          { values: _values, globlaState: globalState },
          idEmpresa
        )) as ResponseInterface;
        if (itemResponse.isSuccess) {
          dispatch(
            updateItemSlot({ state: PAGE_SLOT, data: itemResponse.result })
          );
        }
      }

      const message = itemResponse.message;
      const isSuccess = itemResponse.isSuccess;

      if (isSuccess) {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
      } else {
        setStatus({ success: false });
        setSubmitting(false);
      }
      handleCreateItemSuccess(isSuccess, message);
    } catch (err) {
      //console.error(err);
      handleCreateItemSuccess(false, err);
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  const handleCreateItemSuccess = (isSuccess: boolean, message: string) => {
    enqueueSnackbar(message, {
      variant: isSuccess ? 'success' : 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    dispatch(setIsOpenModal(!isSuccess));
    dispatch(setDataModal({}));
    dispatch(setModalSize('sm'))
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {titulos.titulo}
          </Typography>
          <Typography variant="subtitle2">{titulos.descripcion}</Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateItemOpen}
            variant="contained"
            size="small"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {'Crear ' + titulos.nombreItem}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth={ModalSize as false | 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
        open={open}
        onClose={handleCreateItemClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {titulos.tituloModal === undefined || titulos.tituloModal === ''
              ? dataModal.id === undefined
                ? 'Agregar nueva/o ' + titulos.nombreItem
                : 'Editar ' + titulos.nombreItem
              : titulos.tituloModal}
          </Typography>
          <Typography variant="subtitle2">
            {titulos.descripcionModal === undefined ||
            titulos.descripcionModal === ''
              ? dataModal.id === undefined
                ? `Llena los campos para crear una nueva/o ${titulos.nombreItem}.`
                : `Llena los campos para editar la/el ${titulos.nombreItem}.`
              : titulos.descripcionModal}
          </Typography>
        </DialogTitle>

        <Formulario
          dataModal={dataModal}
          onSubmit={onSubmit}
          handleCreateItemClose={handleCreateItemClose}
        />
      </Dialog>
    </>
  );
};

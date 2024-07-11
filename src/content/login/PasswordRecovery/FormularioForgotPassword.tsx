import { Form, Formik, FormikHelpers } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { passwordRecoveryDTO } from './passwordRecovery.model';
import { Button, CircularProgress, TextField } from '@mui/material';

export default function FormularioForgotPassword(
  props: formularioForgotPasswordProps
) {
  return (
    <Formik
      initialValues={props.modelo}
      onSubmit={props.onSubmit}
      validationSchema={Yup.object({
        email: Yup.string().email('No es un correo válido')
      })}
    >
      {(formikProps) => (
        <Form>
          <TextField
            label="Correo electrónico"
            name="email"
            type="text"
            fullWidth
            onChange={formikProps.handleChange}
          />
           <Button
              sx={{
                mt: 3
              }}
              color="primary"
              startIcon={
                formikProps.isSubmitting ? (
                  <CircularProgress size="1rem" />
                ) : null
              }
              disabled={formikProps.isSubmitting}
              type="submit"
              fullWidth
              size="large"
              variant="contained"
            >
              {'Enviar correo'}
            </Button>
        </Form>
      )}
    </Formik>
  );
}

interface formularioForgotPasswordProps {
  modelo: passwordRecoveryDTO;
  onSubmit(
    valores: passwordRecoveryDTO,
    accion: FormikHelpers<passwordRecoveryDTO>
  ): void;
}

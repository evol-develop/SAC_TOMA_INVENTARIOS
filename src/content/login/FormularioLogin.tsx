import { Button, TextField, Select, CircularProgress } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { User } from 'src/interfaces/responseInterface';
import { FormikHelpers } from 'formik';

export default function FormularioLogin(props: formularioLoginProps) {



  return (
    <Formik
      initialValues={props.modelo}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Ingrese un email válido')
          .max(255)
          .required('El email es requerido'),
        password: Yup.string().max(255).required('La contraseña es requerida')
        // terms: Yup.boolean().oneOf(
        //     [true],
        //     'Debes aceptar los términos y condiciones'
        // )
      })}
      onSubmit={props.onSubmit}>
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.email && errors.email}
            label={'Email'}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email || ''}
            variant="outlined"
            size='small'
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label={'Password'}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
            size='small'
          />


          <Button
            sx={{
              mt: 3
            }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting }
            type="submit"
            fullWidth
            size="small"
            variant="contained"

          >
            {'Login'}
          </Button>
        </form>
      )}
    </Formik>
  );
}

interface formularioLoginProps {
  modelo: User;
  onSubmit(
    valoreS: User,
    acciones: FormikHelpers<User>
  ): void;
}

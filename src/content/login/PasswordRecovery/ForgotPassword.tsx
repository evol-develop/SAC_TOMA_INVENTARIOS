import { Card, CardContent, Container, Zoom } from '@mui/material';
import { useState } from 'react';
import FormularioForgotPassword from './FormularioForgotPassword';
import { passwordRecoveryDTO } from './passwordRecovery.model';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import axios from 'src/utils/axios';
import { useSnackbar } from "notistack";
import { Timestamp } from 'firebase/firestore';


export default function ForgotPassword() {
  const [errores, setErrores] = useState<string[]>([]);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();


  const sendRecoveryMail = async (email: string) => {
    setSendingEmail(true);
    const response = await axios.get<ResponseInterface>(
      `api/PasswordRecovery/mandarCorreoRecuperacion/${email}`,
    );

    const message = response.data.message;
    const statusCode = response.status;
    const result = response.data.result;
    
    debugger
    
    if (statusCode == 200) {
      enqueueSnackbar('Correo de recuperacipón enviado!', {
        variant: statusCode === 200 ? 'success' : 'error',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        },
        TransitionComponent: Zoom
    });

    //Esperar 5 segundos
    await new Promise((resolve) => setTimeout(resolve, 5000));

    window.location.reload()

    } else {
      setErrores(['Error al enviar el correo de recuperación.']);
    }

    //mostrar mensaje
    

  }

  return (
    <Container>
      <div className="content-heading">Olvidé mi Contraseña</div>
      <Card className="card-default">
        <CardContent>
          <FormularioForgotPassword
            modelo={{
              email: ''
            }}
            onSubmit={(valores: passwordRecoveryDTO) => {
              sendRecoveryMail(valores.email);
            }}
          ></FormularioForgotPassword>
        </CardContent>
      </Card>
    </Container>
  );
}

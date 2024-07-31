import { Box, Card, Typography, Container, Alert, styled, Button } from '@mui/material';

import Logo from 'src/components/LogoSign';

import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import Login from '../Login';
import { APP } from 'src/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from 'src/components/Scanner/zxing';
import { ScannerHTML } from './../../../components/Scanner/html5QRScanner';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

const LoginBasic = () => {
  const { authState, authLocalState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLocalState) {
      if (authLocalState.isAuthenticated) {
        navigate('catalogos/tomaInventario');
      }
    }
  }, []);

  return (
    <>


        <>
          <Helmet>
            <title> {APP.NOMBRE} - Iniciar Sesión</title>
          </Helmet>
          <MainContent>
            <TopWrapper>
              <Container maxWidth="sm">
                <Logo />
                <Card
                  sx={{
                    mt: 3,
                    px: 4,
                    pt: 5,
                    pb: 3
                  }}
                >
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        mb: 1
                      }}
                    >
                      {'Iniciar Sesión'}
                    </Typography>
                    <Typography
                      variant="h4"
                      color="text.secondary"
                      fontWeight="normal"
                      sx={{
                        mb: 3
                      }}
                    >
                      {'Ingresa la información de tu cuenta'}
                    </Typography>
                  </Box>
                  {authState.error && (
                    <Alert severity="error">{authState.error}</Alert>
                  )}
                  <Login />
                  {/* <Box my={4}>
                                <Typography
                                    component="span"
                                    variant="subtitle2"
                                    color="text.primary"
                                    fontWeight="bold"
                                >
                                    {'¿No tienes una cuenta?'}
                                </Typography>{' '}
                                <Link component={RouterLink} to="/account/register">
                                    <b>Registrate</b>
                                </Link>
                            </Box> */}
                </Card>
              </Container>
            </TopWrapper>
          </MainContent>
        </>
    </>
  );
};

export default LoginBasic;

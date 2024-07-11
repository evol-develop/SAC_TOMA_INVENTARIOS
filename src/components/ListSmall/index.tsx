import {
  Box,
  CardHeader,
  Card,
  ListItemText,
  Typography,
  Avatar,
  List,
  Divider,
  ListItem,
  Link,
  IconButton,
  alpha,
  styled,
  useTheme,
  Button,
  Grid
} from '@mui/material';

import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import Scrollbar from 'src/components/Scrollbar';
import { formatDistance, subMinutes } from 'date-fns';
import Label from '../Label';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import axios from 'axios';
import { FechaConFormato } from '../FechaFormato';

const CardContentWrapper = styled(Box)(
  ({ theme }) => `
      background: ${theme.colors.alpha.white[100]};
      border-radius: ${theme.general.borderRadius};
    `
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
      font-size: ${theme.typography.pxToRem(10)};
      font-weight: bold;
      text-transform: uppercase;
      border-radius: ${theme.general.borderRadiusSm};
      padding: ${theme.spacing(0.9, 1.5, 0.7)};
      line-height: 1;
    `
);

const ListWrapper = styled(List)(
  () => `
      .MuiDivider-root:last-of-type {
          display: none;
      }
    `
);

export default function ListSmall(props: ListSmallProps) {
  const theme = useTheme();

  const handleAutorizarGasto = async (gasto) => {
    await props.onClickButton(gasto);
  };

  const handleTitleClick = (gasto) => {
    props.onClickTitle(gasto);
  };

  const fechaFormateada = (fecha) => {
    const fechaAutoriza = new Date(fecha);
    const fechaFormateada = `${fechaAutoriza.getDate().toString().padStart(2, '0')}/${(fechaAutoriza.getMonth() + 1).toString().padStart(2, '0')}/${fechaAutoriza.getFullYear()}`;
    return fechaFormateada;    
  }

  return (
    <Card
      variant="outlined"
      sx={{
        background: `${alpha(theme.colors.alpha.black[100], 0.03)}`
      }}
      
    >
      <CardHeader
        sx={{
          p: 3
        }}
        disableTypography
        action={
          <IconButton size="small" color="secondary">
            <MoreVertTwoToneIcon />
          </IconButton>
        }
        title={<Typography variant="h4">{props.titulo}</Typography>}
      />
      <CardContentWrapper
        sx={{
          mx: 3,
          mb: 3,
          height: 344
        }}
      >
        <Scrollbar className={''}>
          <ListWrapper>
            {props.item ? (
              props.item.map((item: any, index: number) => (
                <div key={index}>
                  <Divider />

                  <ListItem
                    key={item.id}
                    sx={{
                      p: .5
                    }}
                  >
                    <Grid
                      container
                      direction={'row'}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <Grid item xs={12} md={7}>
                        <ListItemText
                          primary={
                            <Link
                              href="#"
                              color="text.primary"
                              variant="h4"
                              onClick={() => {
                                handleTitleClick(item);
                              }}
                            >
                              {`${item.descripcion}`}
                            </Link>
                          }
                          secondary={
                            <>
                              <Box mt={0} display="flex" alignItems="center">
                                {/* <Avatar
                                  sx={{
                                    mr: 1,
                                    width: 28,
                                    height: 28
                                  }}
                                  src="/static/images/avatars/1111.jpg"
                                /> */}
                                <Link
                                  sx={{
                                    fontSize: `${theme.typography.pxToRem(13)}`,
                                    whiteSpace: 'pre-line'
                                  }}
                                  href="#"
                                  variant="h6"
                                >
                                  {`${item.comentarios} \n ${item.usuarioAutoriza ? `Autorizó: ${item.usuarioAutoriza?.fullName} el ${fechaFormateada(item.fechaAutoriza)}`: ''}`}
                                </Link>
                                <Typography
                                  sx={{
                                    fontSize: `${theme.typography.pxToRem(12)}`,
                                    pl: 1
                                  }}
                                  variant="subtitle2"
                                >
                                  {''}
                                </Typography>
                              </Box>
                            </>
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Label color={'error'}>
                            {item.importe?.toLocaleString('es-MX', {
                              style: 'currency',
                              currency: 'MXN'
                            })}{' '}
                          </Label>
                        </Box>
                      </Grid>
                      {props.showButton && (
                        <Grid item xs={12} md={2}>
                          <Box alignSelf="flex-start" paddingLeft={3}>
                            <Button
                              color="primary"
                              size="small"
                              onClick={(e) => {
                                handleAutorizarGasto(item);
                              }}
                            >
                              <VerifiedUserTwoToneIcon />
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </ListItem>
                  <Divider />
                </div>
              ))
            ) : (
              <></>
            )}
            <Divider />
          </ListWrapper>
        </Scrollbar>
      </CardContentWrapper>
    </Card>
  );
}

interface ListSmallProps {
  titulo: string;
  descripcion: string;
  item: any;
  onClickButton?: any;
  onClickTitle?: any;
  showButton?: boolean;
}

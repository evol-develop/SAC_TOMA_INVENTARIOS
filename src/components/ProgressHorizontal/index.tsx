import {
  Stack,
  Card,
  Typography,
  Box,
  Divider,
  alpha,
  LinearProgress,
  styled,
  useTheme,
  linearProgressClasses
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ObrasInfoInterface } from 'src/interfaces/entidades/Vistas/obrasInfoInterface';

const LinearProgressPrimary = styled(LinearProgress)(
  ({ theme }) => `
          height: 8px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.primary.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.primary.main};
          }
      `
);

const LinearProgressError = styled(LinearProgress)(
  ({ theme }) => `
          height: 8px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.error.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.error.main};
          }
      `
);

const LinearProgressSuccess = styled(LinearProgress)(
  ({ theme }) => `
          height: 8px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.success.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.success.main};
          }
      `
);

export default function ProgressHorizontal(props: ProgressHorizontalProps) {
  const theme = useTheme();

  const [Datos, setDatos] = useState<any>({});

  useEffect(() => {
    let datos = {};

    switch (props.title) {
      case 'Saldo Disponible':
        datos = {
          titulo: 'Saldo Disponible',
          subtitulo: `Gastado ${props.obra.gastado?.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}`,
          colorBar: `${
            (props.obra.saldoObra * 100) / props.obra.presupuesto > 50
              ? theme.colors.success.main
              : (props.obra.saldoObra * 100) / props.obra.presupuesto > 20
              ? theme.colors.primary.main
              : theme.colors.error.main
          }`,
          bar:
            (props.obra.saldoObra * 100) / props.obra.presupuesto > 50 ? (
              <LinearProgressSuccess
                variant="determinate"
                value={(props.obra.saldoObra * 100) / props.obra.presupuesto}
              />
            ) : (props.obra.saldoObra * 100) / props.obra.presupuesto > 20 ? (
              <LinearProgressPrimary
                variant="determinate"
                value={(props.obra.saldoObra * 100) / props.obra.presupuesto}
              />
            ) : props.obra.saldoObra > 0 ? (
              <LinearProgressError
                variant="determinate"
                value={(props.obra.saldoObra * 100) / props.obra.presupuesto}
              />
            ) : (
              <LinearProgressError variant="determinate" value={0} />
            ),
          descripcion: 'Disponible',
          porcentaje:
            props.obra.saldoObra > 0
              ? ((props.obra.saldoObra * 100) / props.obra.presupuesto).toFixed(
                  2
                ) + '%'
              : 0 + '%',
          importe: props.obra.saldoObra?.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })
        };
        setDatos(datos);
        break;
      case 'Disponible de Ingresos':
        datos = {
          titulo: 'Disponible de Ingresos',
          subtitulo: `a considerar ${props.obra.disponibleIngresos?.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
          })}`,
          colorBar: `${
            ((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos > 50
              ? theme.colors.success.main
              : ((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos > 20
              ? theme.colors.primary.main
              : theme.colors.error.main
          }`,
          bar:
            ((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos > 50 ? (
              <LinearProgressSuccess
                variant="determinate"
                value={((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos}
              />
            ) : ((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos > 20 ? (
              <LinearProgressPrimary
                variant="determinate"
                value={((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos}
              />
            ) : (props.obra.disponibleIngresos - props.obra.gastado) > 0 ? (
              <LinearProgressError
                variant="determinate"
                value={((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos}
              />
            ) : (
              <LinearProgressError variant="determinate" value={0} />
            ),
          descripcion: 'Disponible',
          porcentaje:
          (props.obra.disponibleIngresos - props.obra.gastado) > 0
              ? (((props.obra.disponibleIngresos - props.obra.gastado) * 100) / props.obra.disponibleIngresos).toFixed(
                  2
                ) + '%'
              : 0 + '%',
              importe: (props.obra.disponibleIngresos - props.obra.gastado)?.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN'
              })
        };
        setDatos(datos);
        break;
    }
  }, []);

  return (
    <Card>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
        alignItems="stretch"
        spacing={0}
      >
        <Box p={2.5} flexGrow={1}>
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography color="text.primary" variant="h4" gutterBottom>
                {Datos?.titulo}
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {Datos?.subtitulo}
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                color: Datos?.colorBar
              }}
            >
              {Datos?.importe}
            </Typography>
          </Box>
          {Datos?.bar}

          <Box
            display="flex"
            sx={{
              mt: 0.6
            }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                color: `${theme.colors.alpha.black[50]}`
              }}
              variant="subtitle2"
            >
              {Datos?.descripcion}
            </Typography>
            <Typography
              sx={{
                color: `${theme.colors.alpha.black[500]}`
              }}
              variant="subtitle2"
            >
              {Datos?.porcentaje}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

interface ProgressHorizontalProps {
  obra: ObrasInfoInterface;
  title: string;
  color: string;
}

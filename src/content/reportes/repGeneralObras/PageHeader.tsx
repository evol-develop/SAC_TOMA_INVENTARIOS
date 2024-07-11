import {
  styled,
  lighten,
  alpha,
  TextField,
  Grid,
  Typography,
  Card,
  Stack,
  useTheme,
  Divider,
  Box
} from '@mui/material';

const DotLegend = styled('span')(
  ({ theme }) => `
      border-radius: 22px;
      width: ${theme.spacing(1.8)};
      height: ${theme.spacing(1.8)};
      display: inline-block;
      margin-right: ${theme.spacing(0.8)};
      border: ${theme.colors.alpha.white[100]} solid 2px;
  `
);

const InputWrapper = styled(TextField)(
  ({ theme }) => `
        
        .MuiInputBase-input {
            font-size: ${theme.typography.pxToRem(17)};
        }
      
        color: ${theme.colors.primary.main};
        margin-right: ${theme.spacing(2)};
        background: ${
          theme.palette.mode === 'dark'
            ? theme.colors.alpha.trueWhite[10]
            : theme.colors.alpha.white[50]
        };
        box-shadow: ${
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.8),
                0.2
              )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)`
            : `0px 2px 4px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.4
              )}, 0px 5px 16px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}`
        };
  `
);

interface Props {
  setRuta: (valor: string) => void;
  getData: (idRuta: string) => void;
  numeroPaquetes: number;
}

export const PageHeader = () => {
  const theme = useTheme();
  // const data = useAppSelector((state: RootState) => state.page.slots.CONTEO_PAQUETES) as PaquetesInterface[]
  const data = []; //useAppSelector((state: RootState) => state.page.slots.CONTEO_PAQUETES) as PaquetesInterface[]

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {'REPORTE GENERAL DE OBRAS'}
          </Typography>
          <Typography variant="subtitle2">{''}</Typography>
        </Grid>
        <Grid item>
          <Card
            sx={{
              mt: { xs: 3, lg: 0 }
            }}
          >
            <Stack
              direction="row"
              divider={
                <Divider
                  sx={{
                    background: `${theme.colors.alpha.black[10]}`
                  }}
                  orientation="vertical"
                  flexItem
                />
              }
              justifyContent="space-around"
              alignItems="center"
              spacing={0}
            >
              {/* <Box px={3} py={2} textAlign="center">
                            <Typography
                                variant="h4"
                                fontWeight="normal"
                                color="text.secondary"
                                gutterBottom
                            >
                                {'Paquetes:'}
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <DotLegend
                                    style={{
                                        animation: `pulse 1s infinite`,
                                        background: `${ data ?  theme.colors.success.main: theme.colors.error.main }`
                                    }}
                                />
                                <Typography color="text.primary" variant="h4">
                                    {data ? data.length :0}
                                </Typography>
                            </Box>
                        </Box> */}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PageHeader;

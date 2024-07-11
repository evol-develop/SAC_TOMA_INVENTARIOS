import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Divider,
  Box,
  useTheme,
  styled
} from '@mui/material';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { RootState } from 'src/store/store';
// import { TotalGastosPorTipoInterface } from 'src/interfaces/entidades/totalGastosPorTipoInterface';
import { useAppSelector } from 'src/hooks/storeHooks';
import { v4 as uuidv4 } from 'uuid';

const DotLegend = styled('span')(
  ({ theme }) => `
      border-radius: 22px;
      width: ${theme.spacing(1.5)};
      height: ${theme.spacing(1.5)};
      display: inline-block;
      margin-right: ${theme.spacing(0.5)};
  `
);

function PorcentCicular() {
  const theme = useTheme();
  const [Titulos, setTitulos] = useState([]);
  const [Cantidades, setCantidades] = useState([]);
  const [TotalGastado, setTotalGastado] = useState(0);

  // const TotalGastosPorTipo: TotalGastosPorTipoInterface[] = useAppSelector(
  //   (state: RootState) => state.page.slots.TotalGastosPorTipo
  // );

    const TotalGastosPorTipo: any[] = useAppSelector(
    (state: RootState) => state.page.slots.TotalGastosPorTipo
  );

  const ObraInfo = useAppSelector(
    (state: RootState) => state.page.slots.ObraInfo
  );

  useEffect(() => {
    let titulos = [];
    let cantidades = [];

    TotalGastosPorTipo.map((item) => {
      titulos.push(item.tipoGasto);
      let porcentaje = ((item.gastado * 100) / TotalGastado).toFixed(2);
      //let porcentaje = item.gastado.toFixed(2);
      cantidades.push(parseFloat(porcentaje));
    });

    setTitulos(titulos);
    setCantidades(cantidades);

    setTotalGastado(ObraInfo?.gastado);
  }, [TotalGastado]);

  const sales = {
    datasets: [
      {
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.error.main,
          theme.palette.grey[500]
        ]
      }
    ],
    labels: Titulos
  };

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%'
        }
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
      theme.palette.grey[500]
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val.toFixed(2)}%`;
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[100],
        opacity: 0.9
      }
    },
    fill: {
      opacity: 1
    },
    labels: sales.labels,
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[1]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = Cantidades;

  return (
    <Card sx={{ overflow: 'auto', maxHeight: 450, minHeight: 300 }}>
      <CardHeader sx={{ paddingBottom: 0 }} title={'Total Por Tipo de Insumo'} />

      {/* <Divider /> */}
      <CardContent>
        <Grid container spacing={3}>
          <Grid
            md={6}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
            pb="0"
          >
            <Chart
              height={250}
              options={chartOptions}
              series={chartSeries}
              type="donut" 
            />
          </Grid>
          <Grid md={6} item display="flex" alignItems="center">
            <Box>
              {sales.labels.map((label, i) => (
                <Typography
                  key={uuidv4()}
                  variant="body2"
                  sx={{
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2
                  }}
                >


                  <DotLegend
                    style={{
                      background: `${sales.datasets[0].backgroundColor[i]}`
                    }}
                  />

                  <span
                    style={{
                      paddingRight: 1,
                      color: `${sales.datasets[0].backgroundColor[i]}`,

                    }}
                  >
                    <Grid container key={uuidv4()}>
                      <span >{`${chartSeries[i].toFixed(2)} %`}</span>
                      <span style={{ paddingLeft: 3 }}>{label.trim()}</span>
                    </Grid>






                  </span>

                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PorcentCicular;

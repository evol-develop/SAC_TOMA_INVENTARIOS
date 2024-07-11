import {
  CardContent,
  CardHeader,
  Card,
  Grid,
  Typography,
  IconButton,
  useTheme
} from '@mui/material';
import Text from 'src/components/Text';

import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import Chart from 'react-apexcharts';

import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';
import ArrowUpwardTwoToneIcon from '@mui/icons-material/ArrowUpwardTwoTone';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import axios from 'src/utils/axios';
import { useEffect, useState } from 'react';

import { ResponseInterface } from 'src/interfaces/responseInterface';
import {
  GastosPorTipoByObraInterface,
  GastosPorTipoByObraInterfaceNew
} from 'src/interfaces/entidades/gastosPorTipoByInterface';
import { it, tr } from 'date-fns/locale';
import { usePage } from 'src/hooks/usePage';

export const ChartSmall = (props: ChartSmallProps) => {
  const theme = useTheme();

  useEffect(() => {
    CargaDatos();
  }, []);

  const [Data, setData] = useState<GastosPorTipoByObraInterfaceNew[]>([]);
  const [NumDataItems, setNumDataItems] = useState<number>(0);
  const ChartConfig = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: true
      },
      sparkline: {
        //Que las barras comienzen desde abajo o dejen un espacio
        enabled: false
      },
      zoom: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,
      shared: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '20%',
        invert: true // Aquí se invierte el orden de las barras
      }
    },
    colors: [theme.colors.primary.dark, theme.colors.info.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: false,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    labels: [
      Data[0]?.semana4,
      Data[0]?.semana3,
      Data[0]?.semana2,
      Data[0]?.semana1
    ],
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: true,
      min: 0,
      labels: {
        formatter: function (value) {
          return new Intl.NumberFormat('es-Mx', {
            style: 'currency',
            currency: 'MXN'
          }).format(value);
        }
      }
    }
  };

  const [ChartOptions, setChartOptions] = useState(ChartConfig);

  const Box2Data = [
    {
      name: 'Net Profit',
      data: [2.3, 3.1, 4.0, 3.8]
    }
  ];

  const CargaDatos = async () => {
    const response = await axios.get<ResponseInterface>(
      `api/gastos/getgastosportipobyobra/${props.Obra}`
    );    

    if (response.data.isSuccess) {
      const datos: GastosPorTipoByObraInterfaceNew[] =
        response.data.result?.map((item, index) => ({
          key: item.tipoGastoId,
          tipoGastoId: item.tipoGastoId,
          tipoGasto: item.tipoGasto,
          gastado: item.gastado,
          semana1: item.semana1,
          sumaSemana1: item.sumaSemana1,
          semana2: item.semana2,
          sumaSemana2: item.sumaSemana2,
          semana3: item.semana3,
          sumaSemana3: item.sumaSemana3,
          semana4: item.semana4,
          sumaSemana4: item.sumaSemana4
        }));

      setNumDataItems(datos?.length || 0);
      setData(datos);
    }
  };

  

  const AjustaGrafica = (item) => {
    const datos = [
      {
        name: 'Gastado',
        data: [
          item.sumaSemana4,
          item.sumaSemana3,
          item.sumaSemana2,
          item.sumaSemana1
        ]
      }
    ];

    return datos;
  };

  const AbrirModalGastosAgrupados = (item) => {
    props.callback(item);
  };

  return (
    <Grid container justifyContent={'space-around'}>
      {Data?.map((item, index) => (
        <>
          <Grid item key={index} xs={12} md={3} paddingTop={2} marginX={0}>
            <Card
              key={index}
              sx={{
                overflow: 'visible',
                width: { xs: '100%', md: '97%' }
              }}
              onClick={() => AbrirModalGastosAgrupados(item.tipoGastoId)}
            >
              <CardHeader
                sx={{
                  p: 3
                }}
                titleTypographyProps={{
                  component: 'h5',
                  variant: 'caption',
                  fontWeight: 'bold'
                }}
                // action={
                //   <IconButton size="small" color="secondary">
                //     <MoreVertTwoToneIcon />
                //   </IconButton>
                // }
                title={item.tipoGasto}
              />
              <CardContent
                sx={{
                  pt: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* <Text color="success">
                    <ArrowUpwardTwoToneIcon />
                  </Text> */}
                <Typography
                  sx={{
                    px: 1
                  }}
                  variant="h2"
                >
                  {item.gastado?.toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  })}
                </Typography>

                <Typography fontWeight="bold" variant="h5">
                  <Text color="error">
                    {((item.gastado * 100) / props.gastado).toFixed(2)}%
                  </Text>
                </Typography>
              </CardContent>
              <Chart
                options={ChartConfig}
                series={AjustaGrafica(item)}
                type="bar"
                height={150}
              />
            </Card>
          </Grid>
        </>
      ))}
    </Grid>
  );
};

interface ChartSmallProps {
  Obra: string;
  presupuesto: number;
  gastado: number;
  callback: any;
}

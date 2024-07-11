import { useRef, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  alpha,
  lighten,
  Avatar,
  styled,
  Tooltip
} from '@mui/material';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import FolderIcon from '@mui/icons-material/Folder';
import { createSlot, setIsOpenModal } from 'src/store/slices/page';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import LocalPrintshopTwoToneIcon from '@mui/icons-material/LocalPrintshopTwoTone';

const AvatarPageTitle = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
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
            )}, 0px 5px 16px -4px ${alpha(theme.colors.alpha.black[100], 0.2)}`
      };
`
);

export default function PageHeader(props: PageHeaderProps) {
  const periods = [
    {
      value: 'today',
      text: 'Today'
    },
    {
      value: 'yesterday',
      text: 'Yesterday'
    },
    {
      value: 'last_month',
      text: 'Last month'
    },
    {
      value: 'last_year',
      text: 'Last year'
    }
  ];

  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[3].text);
  const actionRef1 = useRef(null);

  const dispatch = useDispatch();

  const handleShowDocsClick = () => {
    dispatch(
      createSlot({
        ['TipoModal']: 'DocumentosObra'
      })
    );

    dispatch(setIsOpenModal(true));
  };

  const handlePrintClick = () => {
    dispatch(
      createSlot({
        ['ImprimirPagina']: true
      })
    );
  }

  return (
    <Box
      display="flex"
      alignItems={{ xs: 'stretch', md: 'end' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      marginX={4}
      marginY={1}
    >
      <Box display={'flex'}>
        <AvatarPageTitle variant="rounded">
          <EngineeringTwoToneIcon fontSize="large" />
        </AvatarPageTitle>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            {`${props.titulo} ${
              props.item?.nombre ? `: ${props.item.nombre}` : ''
            }`}
          </Typography>
          <Typography variant="subtitle2">{props.descripcion}</Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" flexDirection="row">
        <Box mr={1}>
          <Typography variant="h4" component="h4" gutterBottom>
            {props.titulo2}
          </Typography>
          <Typography variant="h5">{props.descripcion2}</Typography>
        </Box>
        {/* <Tooltip title={'Visualización de documentos por obra'}>
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={handleShowDocsClick}
            sx={{ marginLeft: 5 }}
          >
            {'Documentos'}
          </Button>
        </Tooltip>
        <Tooltip title={'Visualización de documentos por obra'}>
          <Button
            variant="outlined"
            startIcon={<LocalPrintshopTwoToneIcon />}
            onClick={handlePrintClick}
            sx={{ marginLeft: 5 }}
          >
            {'Imprimir'}
          </Button>
        </Tooltip> */}
      </Box>
    </Box>
  );
}

interface PageHeaderProps {
  titulo: string;
  descripcion: string;
  item?: any;
  titulo2?: string;
  descripcion2?: string;
}

import {
  CardHeader,
  Divider,
  Card,
  LinearProgress,
  List,
  ListItem,
  Box,
  Typography,
  styled
} from '@mui/material';

import FolderCopyTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import { useAppSelector } from 'src/hooks/storeHooks';
import { RootState } from 'src/store/store';
import { useEffect, useState } from 'react';

import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';

const ImageWrapper = styled('img')(
  ({ theme }) => `
          margin-right: ${theme.spacing(1)};
          width: 36px;
  `
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
          flex-grow: 1;
          margin-right: ${theme.spacing(1)};
  `
);

const ListItemWrapper = styled(ListItem)(
  () => `
          border-radius: 0;
  `
);

function PorcentList() {
  const TotalGastosPorTipo = useAppSelector(
    (state: RootState) => state.page.slots.TotalGastosPorTipo
  );
  const ObraInfo = useAppSelector(
    (state: RootState) => state.page.slots.ObraInfo
  );

  const [TotalGastado, setTotalGastado] = useState(0);
  useEffect(() => {
    setTotalGastado(ObraInfo?.gastado);
  }, []);

  return (
    <Card sx={{ overflow: 'auto', maxHeight: 450, minHeight: 300 }}>
      <CardHeader title={'Total Por Tipo de Insumo'} />
      <List disablePadding component="nav">
        {TotalGastosPorTipo.map((item) => (
          <>
            <ListItemWrapper
              sx={{
                py: 1.5
              }}
              key={item.tipoGastoId}
            >
              <AttachMoneyTwoToneIcon />
              <Typography
                variant="h4"
                color="text.primary"
                noWrap
                sx={{
                  minWidth: 80
                }}
              >
                {item.tipoGasto}
              </Typography>
              {`(${Intl.NumberFormat('es-Mx', {
                style: 'currency',
                currency: 'MXN'
              }).format(item.gastado)})`}
              <Box
                display="flex"
                alignItems="center"
                flexWrap="wrap"
                sx={{
                  ml: 1,
                  flexGrow: 1
                }}
              >
                <LinearProgressWrapper
                  value={(item.gastado * 100) / TotalGastado}
                  color="primary"
                  variant="determinate"
                />
                <Typography variant="h4" color="text.primary">
                  {((item.gastado * 100) / TotalGastado).toFixed(2)}%
                </Typography>
              </Box>
            </ListItemWrapper>
            <Divider />
          </>
        ))}
      </List>
    </Card>
  );
}

export default PorcentList;

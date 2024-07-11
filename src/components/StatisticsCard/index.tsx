import {
  Typography,
  Box,
  Avatar,
  Card,
  Grid,
  useTheme,
  styled
} from '@mui/material';

import ArrowRigthnwardTwoToneIcon from '@mui/icons-material/ArrowRightTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        color:  ${theme.colors.alpha.trueWhite[100]};
        width: ${theme.spacing(5.5)};
        height: ${theme.spacing(5.5)};
  `
);

export default function StaticsCard(props: StaticsCardProps) {
  const theme = useTheme();
  
  return (
    <Grid container width={'100%'}>
      <Grid item xs={12}>
        <Card
          sx={{
            px: 3,
            pb: 6,
            pt: 3,
            border: `2px solid`,
            borderColor: props.title == "Ingresos" && props.importe < 0 ? `red !important` : 'transparent',
          }}
        >
          <Box display="flex" alignItems="center">
            <AvatarWrapper
              sx={{
                background: `${props.color} !important`
              }}
            >
              <ReceiptTwoToneIcon fontSize="small" />
            </AvatarWrapper>
            <Typography
              sx={{
                ml: 1.5,
                fontSize: `${theme.typography.pxToRem(15)}`,
                fontWeight: 'bold'
              }}
              variant="subtitle2"
              component="div"
            >
              {props.title}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              ml: -2,
              pt: 2,
              pb: 1.5,
              justifyContent: 'center'
            }}
          >
            <ArrowRigthnwardTwoToneIcon
              sx={{
                color: `${props.color}`
              }}
            />
            <Typography
              sx={{
                pl: 1,
                fontSize: `${theme.typography.pxToRem(35)}`
              }}
              variant="h1"
            >
              {props.importe?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </Typography>
          </Box>
          <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
          >
            {''}
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}

interface StaticsCardProps {
  importe: number;
  title: string;
  color: string;
}

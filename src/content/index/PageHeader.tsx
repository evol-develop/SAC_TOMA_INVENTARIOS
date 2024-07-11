
import { Typography, Grid, Button } from '@mui/material';
import useAuth from 'src/hooks/useAuth';

import { format } from 'date-fns';

const  PageHeader = ()=> {
  const {user } = useAuth();

 
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {'Bienvenido'}, {user? user.nombre : ''}
        </Typography>
        <Typography variant="subtitle2">
          <b>{ format(new Date(), 'dd MMMM yyyy')}</b>
          {' Revisa los movimientos más recientes.'}
        </Typography>
      </Grid>
     
    </Grid>
  );
}

export default PageHeader;

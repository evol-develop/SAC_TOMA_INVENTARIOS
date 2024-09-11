import { useRoutes } from 'react-router-dom';
import routes from './routers/router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { SnackbarProvider } from 'notistack';

import ThemeProvider from './theme/ThemeProvider';
import { CssBaseline } from '@mui/material';



const App = () => {

  const content = useRoutes(routes);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <CssBaseline />
          {content}
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;

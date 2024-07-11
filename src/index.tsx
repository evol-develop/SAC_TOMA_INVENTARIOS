import App from './App';
import ReactDOM from 'react-dom';
import 'src/utils/chart';
import * as serviceWorker from './serviceWorker';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/Auth/AuthContext';
import { Provider } from 'react-redux';


import { store } from './store/store';





ReactDOM.render(
  <HelmetProvider >
    <SidebarProvider>
      <BrowserRouter>
        <Provider store={store} >
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </SidebarProvider>
  </HelmetProvider>

  ,
  document.getElementById('root')
);

serviceWorker.unregister();

// ReactDOM.render(
//   <HelmetProvider > 
//     <SidebarProvider>
//       <BrowserRouter>
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </BrowserRouter>
//     </SidebarProvider>
//   </HelmetProvider>

//   ,
//   document.getElementById('root')
// );

// serviceWorker.unregister();

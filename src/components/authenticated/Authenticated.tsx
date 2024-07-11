import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'src/hooks/storeHooks';
import useAuth from 'src/hooks/useAuth';
import { RootState } from 'src/store/store';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Authenticated = ({ children }: Props) => {
  const { authState, authLocalState } = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const permisos = useAppSelector(
    (state: RootState) => state.permisos.slots.PERMISOS
  );


  


  if (!authLocalState) {
    return <Navigate to={'/'} />;
  }

  if (!authState.isAuthenticated && !authLocalState.isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }

    // return <LoginBasic />;
    return <Navigate to={'/'} />;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  const rutas = location.pathname.split('/');

  let permiso = true;
  const { user } = authState.user ? authState : authLocalState;

  if (user.role != 'SuperAdmin') {
    rutas.map((element) => {
      const permisoEncontrado = permisos?.find(
        (permiso) =>
          permiso.nombre.toLowerCase().replace(' ', '') ===
          element.toLowerCase().replace(' ', '')
      );

      if (permisoEncontrado) {
        if (!permisoEncontrado.acceso) {
          permiso = false;
          return;
        }
      }
    });
  }
  return permiso ? <>{children}</> : <Navigate to={'404'} />;
};

export default Authenticated;

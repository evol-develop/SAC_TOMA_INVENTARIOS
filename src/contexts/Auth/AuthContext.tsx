import { createContext, useEffect, useReducer, useState } from 'react';
import axios from 'src/utils/axios';
import { Permisos, UserInterface } from 'src/interfaces/userInterface';
import { authReducer } from './AuthReducer';
import { useNavigate } from 'react-router-dom';
import { usePage } from 'src/hooks/usePage';
import { createSlotPermisos } from 'src/store/slices/Permisos';
import { FirebaseApp } from 'src/firebase/firebase-config';
import { UserCredential } from 'firebase/auth';
import { User } from 'src/interfaces/responseInterface';
import { ResponseInterface } from 'src/interfaces/responseInterface';
import { EmpresaInterface } from 'src/interfaces/empresaInterface';
import { setInfoEmpresa } from 'src/store/slices/Empresa';
import { AnyAction } from '@reduxjs/toolkit';
import { Axios, AxiosResponse } from 'axios';
import { status } from 'nprogress';
import { createSlot } from 'src/store/slices/page'
import { userResult } from 'src/interfaces/responseInterface';
import { sucursalInterface } from 'src/interfaces/sucursalInterface';
import { respuestaAutenticacion } from 'src/interfaces/respuestaAuthInterface';
import { setInfoSucursal } from 'src/store/slices/Empresa';

export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  user?: UserInterface;
  error?: string;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: undefined,
  error: null
};

type Response = (valores: User) => Promise<AxiosResponse<ResponseInterface, any>>;
type Response2  =()=> Promise<AxiosResponse<ResponseInterface, any>>;

const initialLocalAuthState = JSON.parse(
  localStorage.getItem('AuthState')
) as AuthState;
// contexto de autenticacion
export const AuthContext = createContext({
  user: undefined,
  idEmpresa: '',
  authState: initialAuthState,
  authLocalState: initialLocalAuthState,
  logout: () => Promise.resolve(),
  login: {} as Response,
  token:  {} as Response,
  sucursales: {} as Response2,
  cambiarCadena: {} as Response,
});


export const AuthProvider = ({ children }: any) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);
 
  const [authLocalState, setAuthLocalState] = useState(
    JSON.parse(localStorage.getItem('AuthState')) as AuthState
  );
  const navigate = useNavigate();
  const { dispatch: dispatchPermisos, dispatch: dispatchEmpresa ,dispatch: dispatchSucursal} = usePage();

  useEffect(() => {
    //console.log('authLocalState', authLocalState);
    const initialize = async () => {
      try {
        const authstateInicial = authLocalState;
        //console.log('authLocalState', authLocalState);
        if (authstateInicial) {
          if (authstateInicial.user) {
            axios.defaults.headers.common.Authorization = `Bearer ${authstateInicial.user.accessToken}`;
            localStorage.setItem('AuthState', JSON.stringify(authstateInicial));

            const response = await axios.get(`/api/cuentas/getUser`);

            if (response.data.isSuccess) {

              var data = await getAuth(response.data.result as respuestaAutenticacion);

              const userResponse = response.data.result;
  
              const userInfo : UserInterface ={
              username: "",
              nombre: "",
              accessToken: authstateInicial.user.accessToken,
              email: data.usuario.email.toString(),
              role: data.usuario.id_rol.toString(),
              avatar: '',
              permisos: null,
              expiration: data.expiracion.toString(),
              empresa: data.empresa as EmpresaInterface,
              sucursal: data.sucursal as sucursalInterface,
            
              };

              dispatch({
                type: 'INITIALIZE',
                payload: { isAuthenticated: true, user: userInfo }
              });

              // const permisosByUser = await axios.get(
              //   `/api/roles/getpermisosbyusuario/${authstateInicial.user.email}`,
              //   {
              //     headers: { 'Content-Type': 'application/text' }
              //   }
              // );
              // dispatchPermisos(
              //   createSlotPermisos({ PERMISOS: permisosByUser.data.result })
              // );

              dispatchEmpresa(
                setInfoEmpresa(userInfo.empresa as EmpresaInterface)
              );

              dispatchSucursal(
                setInfoSucursal(userInfo.sucursal as sucursalInterface)
              );

            } else {
              dispatch({
                type: 'INITIALIZE',
                payload: { isAuthenticated: false, user: undefined }
              });
            }
          } else {
            dispatch({
              type: 'INITIALIZE',
              payload: { isAuthenticated: false, user: undefined }
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: { isAuthenticated: false, user: undefined }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: undefined }
        });
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem('AuthState', JSON.stringify(authState));
      axios.defaults.headers.common.Authorization = `Bearer ${authState.user.accessToken}`;
      setAuthLocalState(
        JSON.parse(localStorage.getItem('AuthState')) as AuthState
      );
    }
  }, [authState]);

  const token = async (valores: User) => {

    try {

      const response = await axios.post<ResponseInterface>(
        '/api/cuentas/construirToken',valores
      );

      var data = await getAuth(response.data.result as respuestaAutenticacion);

      const userAuthenticated : UserInterface ={
      username: "",
      nombre: "",
      accessToken:data.token.toString(),
      email: data.usuario.email.toString(),
      role: data.usuario.id_rol.toString(),
      avatar: '',
      permisos: null,
      expiration: data.expiracion.toString(),
      empresa: data.empresa as EmpresaInterface,
      };

      dispatch({ type: 'LOGIN', payload: { user: userAuthenticated } });

      // axios.defaults.headers.common.Authorization = `Bearer ${result.accessToken}`;
      // const permisosByUser = await axios.get(
      //   `/api/roles/getpermisosbyusuario/${user.userName}`,
      //   {
      //     headers: { 'Content-Type': 'application/text' }
      //   }
      // );

      // dispatchPermisos(
      //   createSlotPermisos({ PERMISOS: permisosByUser.data.result })
      // );

      dispatchEmpresa(
      setInfoEmpresa(userAuthenticated.empresa as EmpresaInterface)
      );

     return response;
     
    }catch(error){
      
    }
  }

  const sucursales = async () => {

    try {
      const response = await axios.get<ResponseInterface>('/api/sucursales/getSucursales' );

     return response;
    }catch(error){
    }
  }

  const cambiarCadena = async (valores: User) => {

    try {
      const response = await axios.post<ResponseInterface>('/api/cuentas/cambiarCadena',valores
      );

     return response;
     
    }catch(error){
    }
  }

  const login = async (valores: User) => {

    try {
      const response = await axios.post<ResponseInterface>(
        '/api/cuentas/login',valores
      );

      return response;

    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: { error: 'Usuario / Password incorrecto, favor de verificar.' }
      });
    }
  };

  async function getAuth(autenticacion: respuestaAutenticacion) {
    return autenticacion;
  }

  const logout = async () => {
    try {
      await FirebaseApp.auth().signOut();
      dispatch({ type: 'LOGOUT' });
      setAuthLocalState(null);
      localStorage.removeItem('AuthState');
      delete axios.defaults.headers.common.Authorization;
      navigate('/login');
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Ha ocurrido un error al momento de Cerrar la sesion'
        }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        idEmpresa: authState.user ? authState.user.empresa.id : '',
        authState,
        authLocalState,
        login,
        logout,
        token,
        sucursales,
        cambiarCadena
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
function setInfoPermisos(arg0: Permisos): any {
  throw new Error('Function not implemented.');
}

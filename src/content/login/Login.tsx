import FormularioLogin from './FormularioLogin';
import { useState, useMemo, useEffect, useReducer } from 'react';
import ForgotPassword from './PasswordRecovery/ForgotPassword';
import { ProductosEmpresa } from '../../interfaces/productosInterface';
import { User } from '../../interfaces/responseInterface';
import useAuth from 'src/hooks/useAuth';
import SelectInput from 'src/components/SelectInput/Index';
import { SelectChangeEvent } from '@mui/material';
import { Button, Divider } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePage } from 'src/hooks/usePage';
import Cargando from 'src/components/Cargando';
import { sucursalInterface } from 'src/interfaces/sucursalInterface';
import { setInfoSucursal } from 'src/store/slices/Empresa';
import { authReducer } from 'src/contexts/Auth/AuthReducer';
import { APP } from 'src/config';

const Login = () => {
  const [LoginError, setLoginError] = useState(null);
  const { dispatch: dispatchSucursal } = usePage();
  const [dispatch] = useReducer(authReducer, null);
  const navigate = useNavigate();
  const { login, token, sucursales, cambiarCadena } = useAuth();
  const [Vista, setVista] = useState<string>('Login');
  const [esValido, setEsValido] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [Productos, setProductos] = useState<ProductosEmpresa[]>([]);
  const [Sucursales, setSucursales] = useState<sucursalInterface[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<ProductosEmpresa>({
      id_producto: 0,
      desc_producto: ''
    });
  const [sucursalSeleccionada, setSucursalSeleccionada] =
    useState<sucursalInterface>({
      clave_sucursal: 0,
      nombre: '',
      telefono: '',
      domicilio: '',
      nombre_corto: ''
    });
  const [credencialesUsuario, setCredencialesUusario] = useState<User>();

  useEffect(() => {
    localStorage.removeItem('AuthState');
  }, []);

  const ActionFP = (e: any) => {
    e.preventDefault();

    if (Vista === 'Login') {
      setVista('Recovery');
    } else {
      setVista('Login');
    }
  };

  async function Login(credenciales: User) {
    try {
      const response = await login(credenciales);

      if (response.data.isSuccess) {
        const productos = await getProductosByData(
          response.data.result as ProductosEmpresa[]
        );

        setCredencialesUusario(credenciales)
        const cred = credenciales;

        cred.id_empresa = response.data.result[0].id_empresa

        if (productos.length > 1) {
          setProductoSeleccionado(productos[0]);
          setProductos(productos);
          setEsValido(true);
        } else {
          if (productos.length == 1) {
            setEsValido(true);
            cred.id_sucursal = 1
            setProductoSeleccionado(productos[0]);
            cambiarCadenaConexion(productos[0].id_producto, cred);
          } else {
            alert('No se encontraron productos');
          }
        }
      }
    } catch (error: any) {}
  }

  async function getSucursales() {
    const response = await sucursales();

    if (response.data.isSuccess == true) {
      const sucursales = await getAuth2(
        response.data.result as sucursalInterface[]
      );

      if (sucursales.length > 1) {
        setSucursalSeleccionada(sucursales[0]);
        setSucursales(
          sucursales.map((sucursal) => {
            return {
              clave_sucursal: sucursal.clave_sucursal,
              nombre: sucursal.nombre.trim(),
              telefono: sucursal.telefono.trim(),
              domicilio: sucursal.domicilio.trim(),
              nombre_corto: sucursal.nombre_corto.trim()
            };
          })
        );
      } else {
        if (sucursales.length == 1) {
          setSucursalSeleccionada({
            clave_sucursal: sucursales[0].clave_sucursal,
            nombre: sucursales[0].nombre.trim(),
            telefono: sucursales[0].telefono.trim(),
            domicilio: sucursales[0].domicilio.trim(),
            nombre_corto: sucursales[0].nombre_corto.trim()
          });

          construirToken(
            sucursales[0].clave_sucursal,
            productoSeleccionado.id_producto,
            sucursales[0]
          );
        } else {
          alert('No se encontraron sucursales');
        }
      }
    }

    setCargando(false);
  }

  async function getAuth2(autenticacion: sucursalInterface[]) {
    return autenticacion;
  }

  async function getProductosByData(autenticacion: ProductosEmpresa[]) {
    return autenticacion;
  }

  async function construirToken(
    id_sucursal: number,
    id_rol: number,
    sucursal: sucursalInterface
  ) {
    const credencial = {
      email: credencialesUsuario.email,
      password: credencialesUsuario.password,
      id_empresa: credencialesUsuario.id_empresa,
      id_sucursal: id_sucursal,
      id_rol: id_rol
    };

    debugger

    var response = await token(credencial);

    if (response.data.isSuccess) {
      dispatchSucursal(setInfoSucursal(sucursal));

      setProductos([]);
      setSucursales([]);
      setEsValido(false);
      setProductoSeleccionado({
        id_producto: 0,
        desc_producto: ''
      });
      setSucursalSeleccionada({
        clave_sucursal: 0,
        nombre: '',
        telefono: '',
        domicilio: '',
        nombre_corto: ''
      });

      navigate('/site/catalogos/tomaInventario');
    } else {
      alert('Error al iniciar sesión');
    }

    return null;
  }

  const handleProductoChange = (event: SelectChangeEvent<number>) => {
    setSucursales([]);

    const selectedId = event.target.value as number;
    const selectedProduct = Productos.find(
      (producto) => producto.id_producto === selectedId
    );

    if (selectedProduct) {
      setProductoSeleccionado(selectedProduct);
    }
  };

  const handleSucursalChange = (event: SelectChangeEvent<number>) => {
    const selectedId = event.target.value as number;
    const selected = Sucursales.find(
      (producto) => producto.clave_sucursal === selectedId
    );

    if (selected) {
      setSucursalSeleccionada(selected);
    }
  };

  const opcionesProductos = useMemo(
    () =>
      Productos?.map((producto) => ({
        value: producto.id_producto,
        desc: producto.desc_producto
      })),
    [Productos!]
  );

  const opcionesSuc = useMemo(
    () =>
      Sucursales?.map((sucursal) => ({
        value: sucursal.clave_sucursal,
        desc: sucursal.nombre_corto.trim()
      })),
    [Sucursales!]
  );

  const handleClose = () => {
    setEsValido(false);
  };

  async function cambiarCadenaConexion(id_rol: number, cred: any = null) {
    setCargando(true);
    
    const credencial = {
      email: cred != null ? cred.email : credencialesUsuario.email,
      password: cred != null ? cred.password : credencialesUsuario.password,
      id_empresa: cred != null ? cred.id_empresa : credencialesUsuario.id_empresa,
      id_sucursal: cred != null ? cred.id_sucursal : credencialesUsuario.id_sucursal,
      id_rol: cred != null ? cred.id_rol : id_rol
    };

    var response = await cambiarCadena(credencial);

    if (response.data.isSuccess) {
      getSucursales();
    } else {
      alert('No fue posible cambiar la cadena de conexión');
    }

    return null;
  }

  return (
    <>
      <div>
        <h3>{Vista === 'Login' ? 'Login' : 'Recuperar Contraseña'}</h3>
        {Vista === 'Login' ? (
          <>
            <FormularioLogin
              modelo={{ email: '', password: '', id_rol: 0 }}
              onSubmit={async (valores) => await Login(valores)}
            />
          </>
        ) : (
          <ForgotPassword />
        )}
        <hr />
        <a href="/" onClick={ActionFP}>
          {Vista === 'Login' ? 'Olvidé mi contraseña' : 'Volver al Login'}
        </a>
      </div>

      <Dialog
        open={(Productos.length > 1 || Sucursales.length > 0) && esValido}
        onClose={handleClose}
        fullWidth
        maxWidth={'xs'}
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          <h3>Elija un sistema</h3>
          <Divider />
          <div style={{ margin: '20px 0' }}>
            {Productos && Productos.length > 1 ? (
              <SelectInput
                onChange={handleProductoChange}
                value={productoSeleccionado.id_producto}
                className="form-control"
                label="Productos"
                options={opcionesProductos}
                disabled={cargando}
                size="small"
              />
            ) : null}
          </div>

          <Cargando isLoading={cargando} />

          <div style={{ margin: '20px 0' }}>
            {Sucursales && Sucursales.length > 1 ? (
              <>
                <h3>Sucursales</h3>
                <SelectInput
                  onChange={handleSucursalChange}
                  value={sucursalSeleccionada.clave_sucursal}
                  className="form-control"
                  label="Sucursales"
                  options={opcionesSuc}
                  size="small"
                />
              </>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}
          >
            {Sucursales.length == 0 ? (
              <Button
                variant="contained"
                color="primary"
                disabled={cargando}
                onClick={async () => {
                  await cambiarCadenaConexion(productoSeleccionado.id_producto);
                }}
                style={{ marginRight: '10px' }}
              >
                Aceptar
              </Button>
            ) : null}

            {Sucursales.length > 0 ? (
              <Button
                variant="contained"
                color="primary"
                disabled={!sucursalSeleccionada || cargando}
                onClick={async () => {
                  await construirToken(
                    sucursalSeleccionada.clave_sucursal,
                    productoSeleccionado.id_producto,
                    sucursalSeleccionada
                  );
                }}
                style={{ marginRight: '10px' }}
                size="small"
              >
                Aceptar
              </Button>
            ) : null}

            <Button
              variant="contained"
              onClick={handleClose}
              disabled={cargando}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;

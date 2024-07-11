//#region IMPORTS
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { usePage } from 'src/hooks/usePage';
import useRefMounted from 'src/hooks/useRefMounted';
import { AutoCompleteInterface } from 'src/interfaces/autoCompleteInterface';
// import { ConceptosGastosInterface } from 'src/interfaces/entidades/conceptosGastosInterface';
// import { ObrasInterface } from 'src/interfaces/entidades/obrasInterface';
// import { TipoGastosInterface } from 'src/interfaces/entidades/tipoGastoInterface';
// import { UnidadInterface } from 'src/interfaces/entidades/unidadInterface';
import { ResponseInterface,  userResult } from 'src/interfaces/responseInterface';
// import { AutoCompleteInterface } from 'src/interfaces/autoCompleteInterface';
// import { ResponseInterface } from 'src/interfaces/responseInterface';
import { createSlot, setDataOnSlot, clearSlot } from 'src/store/slices/page';
import axios from 'src/utils/axios';
// import { ColaboradoresInterface } from 'src/interfaces/entidades/colaboradoresInterface';
// import {
//   EstadoInterface,
//   AsentamientoInterface,
//   MunicipioInterface,
//   AsentamientoObraInterface
// } from 'src/interfaces/entidades/estadosInterface';
import { EvolRolInterface } from 'src/interfaces/userInterface';
// import { ClienteInterface } from 'src/interfaces/entidades/clientesInterfce';
import { ConceptoIngresoInterface } from 'src/interfaces/entidades/conceptoIngresoInterface';
// import { TipoInsumoInterface } from 'src/interfaces/entidades/tipoInsumoIterface';
// import { InsumoInterface } from 'src/interfaces/entidades/insumoInterface';
// import { FormaPagoInterface } from 'src/interfaces/entidades/formasPagooRepository';
// import { ProveedorInterface } from 'src/interfaces/entidades/proveedorInterface';
// import { DocumentoInterface } from 'src/interfaces/entidades/documentoInterface';
import { RootState } from 'src/store/store';
import { useAppSelector } from 'src/hooks/storeHooks';
import { v4 as uuidv4 } from 'uuid';
// import { PorcentajesIVAInterface } from 'src/interfaces/entidades/porcentajesIVAInterface';

// #endregion

// #region PROPS & Types

interface Props {
  tipo:
    | 'USUARIOS'  
    | 'ROLESUSUARIO'
    | 'TIPO-OBRA'
    | 'UNIDADES'
    | 'TIPOINSUMO'
    | 'OBRAS'
    | 'CONCEPTOGASTOS'
    | 'COLABORADOR'
    | 'ESTADO'
    | 'MUNICIPIO'
    | 'LOCALIDAD'
    | 'TIPO-CONTRATO'
    | 'ROL'
    | 'CLIENTE'
    | 'CONCEPTOINGRESO'
    | 'TIPOINSUMO'
    | 'GRUPOINSUMO'
    | 'LOCALIDADBYCP'
    | 'INSUMO'
    | 'FORMAPAGO'
    | 'PROVEEDOR'
    | 'DOCUMENTO'
    | 'IVA'
    | 'ESTATUSOBRA'


  label: string;
  multiple?: boolean;
  idTramo?: string;
  defaultValue?: AutoCompleteInterface;
  isEditing?: boolean;
  hidden?: boolean;
  idEstado?: string;
  idMunicipio?: string;
  filtro?: string;
  opcionTodos?: boolean;
  onChange?: any;
}

export const ComponenteSelect = ({
  tipo,
  label,
  multiple = false,
  defaultValue = { label: '', value: '' },
  idTramo = null,
  isEditing = false,
  hidden = false,
  idEstado = null,
  idMunicipio = null,
  filtro = null,
  opcionTodos = false,
  onChange = undefined
}: Props) => {
  const { dispatch } = usePage();
  const isMountedRef = useRefMounted();
  const [data, setData] = useState([]);
  const [valorInicial] = useState<AutoCompleteInterface>(defaultValue);

  const { authLocalState } = useAuth();
  const idEmpresa = authLocalState.user.empresa.id;

  const [searchText, setSearchText] = useState<string>(filtro);

  // #region getData
  const getData = useCallback(
    async (filtro: string) => {
      switch (tipo) {
        case 'ESTATUSOBRA':
          try {
            const data: AutoCompleteInterface[] = [
              { label: 'EN PROCESO', value: '1' },
              { label: 'TERMINADA', value: '2' },
              { label: 'CANCELADA', value: '3' }
            ];

            if (isMountedRef.current) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          }

          break;
        case 'ROLESUSUARIO':
          try {
            const data: AutoCompleteInterface[] = [
              { label: 'ADMINISTRADOR', value: 'Administrador' },
              { label: 'USUARIO', value: 'Usuario' }
              // { label: 'SUPER-ADMINISTRADOR', value: 'SuperAdmin' },
            ];

            if (isMountedRef.current) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          }

          break;
        case 'USUARIOS':
          try {
            const response = await axios.get<ResponseInterface>(
              '/api/user/getusers'
            );            
            const data: AutoCompleteInterface[] = (
              response.data.result as userResult[]
            )
              .filter((item) => item.activo)
              .map((item: userResult) => ({
                label: `${item.fullName} (${item.email})`,
                value: `${item.id_usuario}`
              }));
            
            if (isMountedRef.current) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          }


          break;
        case 'TIPO-OBRA':
          try {
            const data: AutoCompleteInterface[] = [
              { label: 'VIVIENDA', value: '1' },
              { label: 'OBRA CIVIL', value: '2' },
              { label: 'INFRAESTRUCTURA', value: '3' }
            ];
            if (isMountedRef.current) {
              setData(data);
            }
          } catch (err) {
            console.error(err);
          }

          break;
        // case 'UNIDADES':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       'api/unidades/getunidades'
        //     );
        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as UnidadInterface[]
        //     )
        //       .filter((item) => item.isActive)
        //       .map((item: UnidadInterface) => ({
        //         label: `${item.nombre} (${item.clave})`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'TIPOINSUMO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       'api/tiposgastos/gettiposgastos'
        //     );
        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as TipoGastosInterface[]
        //     )
        //       .filter((item) => item.isActive)
        //       .map((item: TipoGastosInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       if (opcionTodos) {
        //         data.unshift({ label: 'TODOS', value: '0' });
        //       }

        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'OBRAS':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/obras/getobras`,
        //       {
        //         headers: { 'Content-Type': 'application/text' }
        //       }
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as ObrasInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: ObrasInterface) => ({
        //         label: `${item.nombre} (${item.clave})`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'CONCEPTOGASTOS':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/conceptosgastos/getconceptosgastos`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as ConceptosGastosInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: ConceptosGastosInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'ESTADO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/estados/getestados`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as EstadoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: EstadoInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'MUNICIPIO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/estados/getmunicipiobyestado/${idEstado}`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as MunicipioInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: MunicipioInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'LOCALIDAD':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/estados/getlocalidadesbymunicipio/${idMunicipio}`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as AsentamientoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: AsentamientoInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'COLABORADOR':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/colaboradores/getcolaboradores`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as ColaboradoresInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: ColaboradoresInterface) => ({
        //         label: `${item.nombre} ${item.apellido}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'TIPO-CONTRATO':
        //   try {
        //     const data: AutoCompleteInterface[] = [
        //       { label: 'GOBIERNO', value: '1' },
        //       { label: 'INICIATIVA PRIVADA', value: '2' }
        //     ];
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'ROL':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/roles/getroles`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as EvolRolInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: EvolRolInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'CLIENTE':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/clientes/getclientes`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as ClienteInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: ClienteInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'CONCEPTOINGRESO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/tiposconceptopago/gettipos`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as ConceptoIngresoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: ConceptosGastosInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   break;
        // case 'TIPOINSUMO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       'api/tiposgastos/gettiposgastos'
        //     );
        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as TipoGastosInterface[]
        //     )
        //       .filter((item) => item.isActive)
        //       .map((item: TipoGastosInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'GRUPOINSUMO':
        //   const tipoInsumo =
        //     filtro === undefined || filtro === null ? '-1' : filtro;
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/gruposinsumos/getgruposinsumosbytipo/${tipoInsumo}`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as InsumoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: InsumoInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'INSUMO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/insumos/getinsumosfiltrados/${filtro}`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as InsumoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: InsumoInterface) => ({
        //         label: `${item.descripcion} (${item.clave})`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'LOCALIDADBYCP':
        //   try {
        //     let endpoint = ``;
        //     if (searchText.length === 5) {
        //       //endpoint = `/api/estados/getalllocalidades/${searchText}`
        //       endpoint = `/api/estados/getalllocalidades/${filtro}`;
        //     }

        //     const response = await axios.get<ResponseInterface>(endpoint);

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as AsentamientoObraInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: AsentamientoObraInterface) => ({
        //         label: `${item.descripcion}, ${item.estadoDescripcion}, ${item.municipioDescripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'FORMAPAGO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/formaspago/getformaspago`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as FormaPagoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: FormaPagoInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'PROVEEDOR':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/proveedores/getproveedores`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as ProveedorInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: ProveedorInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id.toString()}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'DOCUMENTO':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/documentos/getdocumentos`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as DocumentoInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: DocumentoInterface) => ({
        //         label: `${item.nombre}`,
        //         value: `${item.id}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
        // case 'IVA':
        //   try {
        //     const response = await axios.get<ResponseInterface>(
        //       `/api/porcentajesiva/getporcentajesiva`
        //     );

        //     const data: AutoCompleteInterface[] = (
        //       response.data.result as PorcentajesIVAInterface[]
        //     )
        //       //.filter(item => item.isActive)
        //       .map((item: PorcentajesIVAInterface) => ({
        //         label: `${item.descripcion}`,
        //         value: `${item.id}`
        //       }));
        //     if (isMountedRef.current) {
        //       setData(data);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        //   break;
      }
    },
    [isMountedRef, searchText]
  );

  // #endregion

  useEffect(() => {
    getData(filtro);
  }, [getData, filtro]);

  useEffect(() => {
    defaultValue.value == ''
      ? dispatch(createSlot({ [tipo]: '' }))
      : dispatch(setDataOnSlot({ state: tipo, data: defaultValue.value }));
  }, []);

  return (
    <>
      {data.length > 0 ? (
        <Autocomplete
          // renderOption={(props, option) => {
          //   return (
          //     <li {...props} key={option.value}>
          //       {option.label}
          //     </li>
          //   );
          // }}

          // key={uuidv4()}
          hidden={hidden}
          disabled={isEditing ? true : false}
          size="small"
          multiple={multiple}
          options={data}
          defaultValue={valorInicial}
          disableClearable
          isOptionEqualToValue={(option, value) => option.label === value.label}
          getOptionLabel={(option) => option.label}
          //onInputChange={(event, value) => setSearchText(value)}
          onChange={(event: any, newValue: string | null) =>
            multiple
              ? dispatch(
                  setDataOnSlot({
                    state: tipo,
                    data: Object.values(newValue).map((item: any) => item.value)
                  })
                )
              : dispatch(
                  setDataOnSlot({
                    state: tipo,
                    data: Object.values(newValue)[1]
                  })
                )
          }
          renderInput={(params) => (
            <TextField fullWidth {...params} label={label} autoComplete="off" />
          )}
          onInputChange={(e) => {
            if (tipo === 'INSUMO') {
              onChange(e);
            }
          }}
        />
      ) : (
        <CircularProgress size={15} />
      )}
    </>
  );
};

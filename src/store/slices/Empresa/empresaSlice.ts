import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { EmpresaInterface } from 'src/interfaces/empresaInterface'
import { sucursalInterface } from 'src/interfaces/sucursalInterface'


export interface StatePayload {
    state: string,
    data: any
}

export interface EmpresaSlotState {
    [index: string]: [] | any
}

export interface IStateEmpresa {
    id: string
    nombre: string
    nombreCorto: string
    direccion: string,
    telefono: string,
    representante: string
    slots: EmpresaSlotState,
    sucursal?: sucursalInterface
}

export const initialState: IStateEmpresa = {
    id: '',
    nombre: '',
    nombreCorto:'',
    direccion: '',
    telefono: '',
    representante: '',
    slots: {}
}


export const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
        createSlotEmpresa: (state, action: PayloadAction<EmpresaSlotState>) => {
            state.slots = { ...state.slots, ...action.payload }
        },
        setInfoEmpresa: (state, action: PayloadAction<EmpresaInterface>) => {
            state.id = action.payload.id
            state.nombre = action.payload.nombre
            state.nombreCorto = action.payload.nombreCorto
            state.direccion = action.payload.direccion
            state.representante = action.payload.representante
            state.telefono = action.payload.telefono
        },
        setInfoSucursal: (state, action: PayloadAction<sucursalInterface>) => {
            state.sucursal = action.payload
        }


    },
})



//export reducer
export const {
    createSlotEmpresa, setInfoEmpresa, setInfoSucursal
} = empresaSlice.actions


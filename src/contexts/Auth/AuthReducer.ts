import { UserInterface } from 'src/interfaces/userInterface'
import { AuthState } from './AuthContext'

export type authAction =
    | { type: 'LOGIN', payload: { user: UserInterface } }
    | { type: 'LOGIN_ERROR', payload: { error: string } }
    | { type: 'LOGOUT' }
    | { type: 'INITIALIZE', payload: {  isAuthenticated: boolean, user: UserInterface } }
    | { type: 'ERROR', payload:{error: string} }
// | { type: 'REGISTER' payload: { user: UserInterface } }

/**
|--------------------------------------------------
| GENERA ESTADO
|--------------------------------------------------
*/

export const authReducer = (state: AuthState, action: authAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                error: null
            }
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null
            }
        case 'LOGIN_ERROR':
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload.error
            }
        case 'INITIALIZE':
            const {isAuthenticated, user} = action.payload
            return {
                ...state,
                isAuthenticated,
                isInitialized: true,
                user,
            }
        case 'ERROR':
            return { 
                ...state,
                isAuthenticated: false,
                error: action.payload.error}

        default:
            return state
    }
}

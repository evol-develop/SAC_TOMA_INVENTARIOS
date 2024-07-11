import { createContext, useEffect, useReducer } from 'react';
import {FirebaseApp} from 'src/firebase/firebase-config';
import PropTypes from 'prop-types';
import { UserInterface } from 'src/interfaces/userInterface';

export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  user?: UserInterface;
  error?: string;
}


const initialAuthState :AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  error: null
};

const reducer = (state, action) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
}; 




const initialLocalAuthState = JSON.parse(localStorage.getItem('AuthState')) as AuthState


const AuthContext = createContext({
  ...initialAuthState,
  method: 'FirebaseAuth',
  authState: initialAuthState,
  authLocalState: initialLocalAuthState,
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: (email: string, password: string) => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  // useEffect(
  //   () =>
  //     firebase.auth().onAuthStateChanged((user) => {
  //       debugger
  //       console.log('user--->',user)
  //       if (user) {
  //         dispatch({
  //           type: 'AUTH_STATE_CHANGED',
  //           payload: {
  //             isAuthenticated: true,
  //             user: {
  //               id: user.uid,
  //               jobtitle: 'Lead Developer',
  //               avatar: user.photoURL,
  //               email: user.email,
  //               name: user.displayName || user.email,
  //               role: 'admin',
  //               location: 'San Francisco, USA',
  //               username: 'admin',
  //               posts: '4',
  //               coverImg: 'http://lorempixel.com/640/480/cats',
  //               followers: '5684',
  //               description:
  //                 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
  //             }
  //           }
  //         });
  //       } else {
  //         dispatch({
  //           type: 'AUTH_STATE_CHANGED',
  //           payload: {
  //             isAuthenticated: false,
  //             user: null
  //           }
  //         });
  //       }
  //     }),
  //   [dispatch]
  // );

  const signInWithEmailAndPassword = (email: string, password: string) => {  
    return FirebaseApp.auth().signInWithEmailAndPassword(email, password);
  };

  const signInWithGoogle = () => {
    //const provider = new FirebaseApp.auth.GoogleAuthProvider();

    // return FirebaseApp.auth().signInWithPopup(provider);
  };

  const createUserWithEmailAndPassword = async (email, password) => {
    return FirebaseApp.auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return FirebaseApp.auth().signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'FirebaseAuth',
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;

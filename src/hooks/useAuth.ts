import { useContext } from 'react';

import AuthContext from 'src/contexts/Auth/AuthContext';
// import AuthContext from 'src/contexts/Auth/AuthContext';


const useAuth = () => useContext(AuthContext);

export default useAuth;

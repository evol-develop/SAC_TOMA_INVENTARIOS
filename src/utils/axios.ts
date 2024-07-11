import axios from 'axios';
import { APP } from 'src/config';

const axiosInt = axios.create(
  {
    baseURL: APP.URL_API,
  }
 


);

axiosInt.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'There is an error!'
    )
);

// export const mock = new AxiosMockAdapter(axiosInt, { delayResponse: 0 });

export default axiosInt;

export const auth0Config = {
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN
};



export const firebaseConfig = {
  apiKey: "AIzaSyAdS2XwH69ulSTSe6KLpELxK8YeBTyQpTw", // process.env.REACT_APP_API_KEY,
  authDomain: "clientes-ffff0.firebaseapp.com",
  databaseURL: "",
  projectId: "clientes-ffff0", 
  storageBucket: "clientes-ffff0.appspot.com",
  messagingSenderId: "330527582533",
  appId: "1:330527582533:web:3aa60f6f4d3186d1cb362c",
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

export const amplifyConfig = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id:
    process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID
};



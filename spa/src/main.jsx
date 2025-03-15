import React from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_IZ9vrG2gW",
  client_id: "7oi8eeit739g5gjq0miq5aatb4",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "phone openid email",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { AppProvider } from "./AuthPages/AuthContext/signupcontext";
const clientId = import.meta.env.VITE_CLIENT_ID

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </GoogleOAuthProvider>
); 
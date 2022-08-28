import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FlowerStore from './store/FlowerStore';
import UserStore from './store/UserStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingStore from './store/LoadingStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={
        {
          user: new UserStore(),
          flower: new FlowerStore(),
          loading: new LoadingStore(),
        }}>
      <App />
    </Context.Provider> 
  </React.StrictMode>   
);
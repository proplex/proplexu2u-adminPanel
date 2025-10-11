

import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store/store';
import { Web3Provider } from '@/providers/Web3Provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <Provider store={store}>
        <App />
      </Provider>
    </Web3Provider>
  </StrictMode>
);

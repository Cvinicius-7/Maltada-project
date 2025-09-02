import React from 'react'; // 1. Importe o 'React'
import { createRoot } from 'react-dom/client';
import App from './App';

// 2. Use a função 'createRoot' que você importou diretamente
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
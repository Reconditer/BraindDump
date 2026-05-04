import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/globals.css';
const rootEl = document.getElementById('root');
if (!rootEl)
    throw new Error('Root element not found');
createRoot(rootEl).render(_jsx(StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
//# sourceMappingURL=main.js.map
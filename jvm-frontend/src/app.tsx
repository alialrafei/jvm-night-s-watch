import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './windows/App';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

// Inside your Electron frontend component
// Inside your Electron frontend component

const root = createRoot(document.body);
root.render(<App />);
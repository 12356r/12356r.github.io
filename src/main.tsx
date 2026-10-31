import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/scenery.css';
import './styles/food.css';
import './styles/dorm.css';
import './styles/map.css';
import './styles/brand.css';
import './styles/life.css';
import './styles/board.css';
import './styles/teachers.css';
import './styles/education.css';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

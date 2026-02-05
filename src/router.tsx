// 路由配置

import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import VisitListPage from './pages/VisitListPage';
import VisitEditPage from './pages/VisitEditPage';
import VisitDetailPage from './pages/VisitDetailPage';
import ComparePage from './pages/ComparePage';
import WeightsPage from './pages/WeightsPage';
import DimensionsPage from './pages/DimensionsPage';
import SettingsPage from './pages/SettingsPage';
import ExportPage from './pages/ExportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <VisitListPage />
      },
      {
        path: 'edit/:id?',
        element: <VisitEditPage />
      },
      {
        path: 'detail/:id',
        element: <VisitDetailPage />
      },
      {
        path: 'compare',
        element: <ComparePage />
      },
      {
        path: 'weights',
        element: <WeightsPage />
      },
      {
        path: 'dimensions',
        element: <DimensionsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'export',
        element: <ExportPage />
      }
    ]
  }
]);

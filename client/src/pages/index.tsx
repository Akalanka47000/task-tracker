import { Route, Routes, useLocation } from 'react-router-dom';
import { ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_TASKS } from '@/constants';
import { useNotificationPermissions } from '@/hooks/notifications';
import { NotFound } from './404';
import { Login } from './auth';
import { default as Dashboard } from './dashboard';
import { default as Tasks } from './tasks';

const Pages = () => {
  const location = useLocation();
  useNotificationPermissions();
  return (
    <Routes location={location}>
      <Route>
        <Route path={ROUTE_LOGIN} element={<Login />} />
      </Route>
      <Route path={ROUTE_DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTE_TASKS} element={<Tasks />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Pages;

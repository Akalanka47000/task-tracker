import { Route, Routes, useLocation } from 'react-router-dom';
import { ROUTE_HOME, ROUTE_LOGIN } from '@/constants';
import { NotFound } from './404';
import { Login } from './auth';
import { Home } from './home';

const Pages = () => {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route>
        <Route path={ROUTE_LOGIN} element={<Login />} />
      </Route>
      <Route path={ROUTE_HOME} element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Pages;

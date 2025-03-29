import { Navigate, useLocation } from 'react-router-dom';
import { ROUTE_HOME, ROUTE_LOGIN } from '@/constants';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@shared/constants';

export function RedirectIfAuthenticated(Component: React.ElementType) {
  return function () {
    const profile = useAuthStore((state) => state.profile);
    const location = useLocation();
    if (profile) {
      return <Navigate to={ROUTE_HOME} state={{ from: location }} replace />;
    } else {
      return <Component />;
    }
  };
}

export function Protect(Component: React.ElementType, roles: UserRole[] = []) {
  return function () {
    const profile = useAuthStore((state) => state.profile);
    const location = useLocation();
    if (!profile || (roles.length && !roles.includes(profile.role))) {
      return <Navigate to={ROUTE_LOGIN} state={{ from: location }} replace />;
    } else {
      return <Component />;
    }
  };
}

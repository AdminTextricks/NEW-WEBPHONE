//root
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import LockScreen from "../pages/Authentication/LockScreen";

// dashboard
import Dashboard from "../pages/Dashboard/index";

interface RouteProps {
  path: string;
  component: any;
  exact?: boolean;
}

const publicRoutes: Array<RouteProps> = [
  { path: "/login", component: <Login /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/logout", component: <Logout /> },
];

const privateRoutes: Array<RouteProps> = [
  { path: "*", component: <Dashboard /> },
  { path: "/", component: <Dashboard /> },
];

export { publicRoutes, privateRoutes };

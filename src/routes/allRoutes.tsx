//root
import Root from "../pages/Root/index";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import LockScreen from "../pages/Authentication/LockScreen";

// dashboard
import Dashboard from "../pages/Dashboard/index";
import StarterPage from "../pages/StarterPage/index";

interface RouteProps {
  path: string;
  component: any;
  exact?: boolean;
}

const publicRoutes: Array<RouteProps> = [
  { path: "/auth-login", component: <Login /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/logout", component: <Logout /> },
];

const privateRoutes: Array<RouteProps> = [
  { path: "/pages-starter", component: <StarterPage /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/", component: <Root /> },
];

export { publicRoutes, privateRoutes };

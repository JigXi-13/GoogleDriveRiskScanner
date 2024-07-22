import React from "react";

import { Outlet } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import Error from "./components/Error.tsx";
import ReportDashboard from "./components/ReportDashboard.tsx";
import UserProvider from "./Context/UserProvider.tsx";

const AppLayout = () => {
  return (
    <React.Fragment>
      <UserProvider>
        {/* we can define Header over here! */}
        <Outlet />
        {/* we can define Footer over here! */}
      </UserProvider>
    </React.Fragment>
  );
};

const routesConfig = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/reportDashboard",
        element: <ReportDashboard />,
      },
    ],
  },
];

export default routesConfig;

import React from "react";

import { Outlet } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import Error from "./components/Error.tsx";
import ReportDashboard from "./components/ReportDashboard.tsx";

const AppLayout = () => {
  return (
    <React.Fragment>
      {/* we can define Header over here! */}
      <Outlet />
      {/* we can define Footer over here! */}
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

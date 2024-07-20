import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routesConfig from "./routesConfig.tsx";

const appRouter = createBrowserRouter(routesConfig);

const root = ReactDOM.createRoot(document.getElementById("root")!);

//Providing router configuration(appRouter) to the AppLayout
root.render(<RouterProvider router={appRouter} />);

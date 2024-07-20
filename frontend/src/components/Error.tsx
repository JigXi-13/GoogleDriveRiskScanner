import React from "react";
import { useRouteError } from "react-router-dom";

type RouteError = {
  status?: number;
  statusText?: string;
  message?: string;
};

const Error = () => {
  const error = useRouteError() as RouteError;
  console.log(error);
  return (
    <div className="error">
      <h2>OOPs!</h2>
      <h3>Something went wrong</h3>
      <h3>
        {error?.status
          ? `${error.status} : ${error.statusText}`
          : "Unknown error occurred"}
      </h3>
    </div>
  );
};

export default Error;

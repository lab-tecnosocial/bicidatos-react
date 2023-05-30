import React from "react";
import { Route } from "react-router";
import { Routes, useNavigate } from "react-router-dom";
import MenuPrincipal from "../components/MenuPrincipal/MenuPrincipal";

const PublicRouter = ({ log, component: Component, ...resto }) => {
  const navigate = useNavigate();
  return (
      <Route
        {...resto}
        element={(props) =>
          log ? <MenuPrincipal /> : <Component {...props} />
        }
      />
  );
};

export default PublicRouter;

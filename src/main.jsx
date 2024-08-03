import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import { StoreProvider } from "./store/context";


ReactDOM.render(
  <StoreProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StoreProvider>,
  document.getElementById("root")
);

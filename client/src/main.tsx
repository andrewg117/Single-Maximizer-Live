import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import MaximizerApp from "./MaximizerApp";
import "./css/style.module.css";
// Create redirect for incorrect urls
const NODE_ENV = import.meta.env.NODE_ENV;

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

NODE_ENV === "development"
  ? root.render(
      <React.StrictMode>
        <Provider store={store}>
          <MaximizerApp />
        </Provider>
      </React.StrictMode>
    )
  : root.render(
      <Provider store={store}>
        <MaximizerApp />
      </Provider>
    );

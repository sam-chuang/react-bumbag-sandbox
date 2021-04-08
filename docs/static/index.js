import * as __SNOWPACK_ENV__ from '../snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../snowpack/pkg/react.js";
import ReactDOM from "../snowpack/pkg/react-dom.js"; // import { BrowserRouter } from "react-router-dom"
// import { SWRConfig } from "swr"

import { Global, css } from "../snowpack/pkg/@emotion/react.js";
import { Provider as BumbagProvider, Button } from "../snowpack/pkg/bumbag.js";
import App from "./App.js";
import { jsx as ___EmotionJSX } from "../snowpack/pkg/@emotion/react.js";
ReactDOM.render(___EmotionJSX(React.StrictMode, null, ___EmotionJSX(BumbagProvider, null, ___EmotionJSX(App, null))), document.getElementById("root")); // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement

if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}
import React from "react"
import ReactDOM from "react-dom"
// import { BrowserRouter } from "react-router-dom"
// import { SWRConfig } from "swr"
import { Global, css } from "@emotion/react"
import { Provider as BumbagProvider, Button } from "bumbag"
import App from "./App"

ReactDOM.render(
  <React.StrictMode>
    <BumbagProvider>
      <App />
    </BumbagProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}

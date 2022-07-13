import React, {createRoot} from "react";
import ReactDOM from 'react-dom/client';
import { App } from "./src/app.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render( <div>
        <h1>Using WebAssembly with React From Scratch!</h1>
        <App/>
</div>);
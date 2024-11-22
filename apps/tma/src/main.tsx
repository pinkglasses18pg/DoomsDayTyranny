// apps/tma/src/main.tsx

import ReactDOM from "react-dom/client";
import "./mockEnv.ts";
import "./index.css";
import { Root } from "./components/Root.tsx";
import '../global.d.ts';

const rootElement = document.getElementById("root")!;
const loadingIndicator = document.getElementById("loading-indicator");

/*if (loadingIndicator) {
    loadingIndicator.style.display = "none";
}*/

ReactDOM.createRoot(rootElement!).render(<Root />);

// Wait for React to load, then hide the loader
window.addEventListener("load", () => {
    if (loadingIndicator) {
        loadingIndicator.style.opacity = "0";
        setTimeout(() => {
            loadingIndicator.style.display = "none";
        }, 300); // Smooth fade-out
    }

rootElement.style.display = "block";
});



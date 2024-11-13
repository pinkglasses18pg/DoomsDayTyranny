// apps/tma/src/main.tsx

import ReactDOM from "react-dom/client";
import "./mockEnv.ts";
import "./index.css";
import { Root } from "./components/Root.tsx";
import '../global.d.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

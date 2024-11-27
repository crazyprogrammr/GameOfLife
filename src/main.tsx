import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider } from "antd";
import { GameProvider } from "./utilities/gameContext.tsx";
const theme = {
  token: {
    colorPrimary: "#001628",
    borderRadius: 8,
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <GameProvider>
        <App />
      </GameProvider>
    </ConfigProvider>
  </StrictMode>
);

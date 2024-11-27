import { RefObject, useCallback } from "react";
import { Actions, GameTitle, NavBarHeader } from "../styles";
import { Button, ConfigProvider, Dropdown } from "antd";
import { ExportOutlined, FileImageOutlined, FileTextOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useGame } from "../utilities/gameContext";

interface INavBarProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

const NavBar = (props: INavBarProps) => {
  const { setAreRulesOpen, areRulesOpen, boardSize, liveCells, speed } = useGame();

  const downloadPng = useCallback(() => {
    const canvas = props.canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "game_of_life.png";
      link.href = url;
      link.click();
      link.remove();
    }
  }, [props.canvasRef]);

  const downloadJSON = useCallback(() => {
    const output = { boardSize, speed, liveCells: [...liveCells] };
    const blob = new Blob([JSON.stringify(output)], { type: "text/json" });
    const link = document.createElement("a");
    link.download = "game_of_life.json";
    link.href = window.URL.createObjectURL(blob);
    link.click();
    link.remove();
  }, [boardSize, liveCells, speed]);

  return (
    <NavBarHeader>
      <GameTitle>Conway's Game of Life</GameTitle>
      <Actions>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00b0ff",
            },
          }}
        >
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  label: "Export as JSON",
                  icon: <FileTextOutlined />,
                  key: "import_json",
                  onClick: downloadJSON,
                },
                {
                  label: "Export as PNG",
                  icon: <FileImageOutlined />,
                  key: "import_png",
                  onClick: downloadPng,
                },
              ],
            }}
          >
            <Button icon={<ExportOutlined />} ghost onClick={(e) => e.preventDefault()}>
              Export
            </Button>
          </Dropdown>
          <Button icon={<QuestionCircleOutlined />} ghost onClick={() => setAreRulesOpen((open) => !open)}>
            {areRulesOpen ? "Close Rules" : "Rules"}
          </Button>
        </ConfigProvider>
      </Actions>
    </NavBarHeader>
  );
};

export default NavBar;

import { Button, InputNumber, Select, Upload } from "antd";
import { useGame } from "../utilities/gameContext";
import { BoardSettingTitle, BoardSettingWrapper, CardContent, DisplayCard, Stat, StatName } from "../styles";
import { Preset } from "../types";
import { gliderGun } from "../presets/glider_gun";
import { pulsar } from "../presets/pulsar";
import { drawNewLiveCells } from "../utilities/drawing";
import { RefObject, useCallback } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { flushSync } from "react-dom";

type PresetTypes = "pulsar" | "glider_gun";

interface IBoardSettingsProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

const BoardSettings = (props: IBoardSettingsProps) => {
  const { speed, setSpeed, boardSize, setBoardSize, isPlaying, liveCells, generation, setLiveCells } = useGame();

  const handleObject = useCallback(
    (preset: Preset | null | undefined) => {
      if (preset && props.canvasRef.current) {
        const context = props.canvasRef.current.getContext("2d") as CanvasRenderingContext2D;
        const cells = new Set(preset.liveCells);
        const boardSize = Math.max(3, Math.min(1000, preset.boardSize));
        flushSync(() => {
          setBoardSize(boardSize);
        });
        drawNewLiveCells(context, cells, boardSize);
        setLiveCells(cells);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boardSize, props.canvasRef]
  );

  const handlePreset = useCallback(
    (value: PresetTypes) => {
      let preset: Preset | null;
      switch (value) {
        case "glider_gun":
          preset = gliderGun;
          break;
        case "pulsar":
          preset = pulsar;
          break;
        default:
          preset = null;
      }

      handleObject(preset);
    },
    [handleObject]
  );

  return (
    <DisplayCard>
      <CardContent>
        <BoardSettingWrapper style={{ display: "block" }}>
          <Upload
            beforeUpload={(file) => {
              const reader = new FileReader();

              reader.onload = (e) => {
                const preset = JSON.parse((e.target?.result as string) || "");
                handleObject(preset as Preset);
              };
              reader.readAsText(file);

              return false;
            }}
            accept=".json"
            showUploadList={false}
            data-testid="Uploader"
          >
            <Button icon={<UploadOutlined />} size="large">
              Import board from JSON file
            </Button>
          </Upload>
        </BoardSettingWrapper>
        <BoardSettingWrapper>
          <BoardSettingTitle level={5}>Speed (ms): </BoardSettingTitle>
          <InputNumber
            color="primary"
            variant="outlined"
            type="number"
            size="large"
            value={speed}
            aria-label="Speed"
            min={50}
            max={3000}
            step={50}
            onChange={(value) => setSpeed(value || 50)}
            onKeyDown={(e) => e.preventDefault()}
            keyboard={false}
            style={{ width: "200px" }}
          />
        </BoardSettingWrapper>
        <BoardSettingWrapper>
          <BoardSettingTitle level={5}>Board Size: </BoardSettingTitle>
          <InputNumber
            color="primary"
            variant="outlined"
            size="large"
            type="number"
            aria-label="BoardSize"
            value={boardSize}
            disabled={isPlaying}
            min={3}
            max={1000}
            step={1}
            onChange={(value) => setBoardSize(Math.min(value || 3, 1000))}
            keyboard={true}
            style={{ width: "200px" }}
          />
        </BoardSettingWrapper>
        <BoardSettingWrapper>
          <BoardSettingTitle level={5}>Preset: </BoardSettingTitle>
          <Select
            disabled={isPlaying}
            size="large"
            variant="outlined"
            aria-label="Preset"
            style={{ width: "200px", textAlign: "left" }}
            onChange={(value) => handlePreset(value)}
            placeholder="Select Preset"
            options={[
              { label: "Pulsar", value: "pulsar" },
              { label: "Glider Gun", value: "glider_gun" },
            ]}
          />
        </BoardSettingWrapper>
        <BoardSettingWrapper style={{ justifyContent: "space-around", marginTop: "1.5rem" }}>
          <Stat>
            <StatName level={5}>
              Generation: <span>{generation}</span>
            </StatName>
          </Stat>
          <Stat>
            <StatName level={5}>
              Live cells: <span>{liveCells.size}</span>
            </StatName>
          </Stat>
        </BoardSettingWrapper>
      </CardContent>
    </DisplayCard>
  );
};

export default BoardSettings;

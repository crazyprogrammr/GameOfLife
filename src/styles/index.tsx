import { Card, Layout, Typography } from "antd";
import styled, { css } from "styled-components";

export const CanvasWrapper = styled.div`
  overflow: hidden;
  text-align: center;
  width: 700px;
  height: 700px;
  border: solid 2px gray;
  border-radius: 4px;
  box-sizing: content-box;
  display: flex;
  position: relative;
`;

export const CanvasFrame = styled.div`
  width: 704px;
  height: 704px;
  position: relative;
`;

export const Canvas = styled.canvas`
  align-self: flex-start;
`;

export const GameTitle = styled(Typography.Text)`
  flex-grow: 1;
  text-align: left;
  text-transform: uppercase;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: 0.2rem;
`;

export const ContentContainer = styled(Layout)`
  display: flex;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const GameWrapper = styled(Layout.Content)`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Game = styled.div`
  height: 100%;
  width: 700px;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const Sider = styled(Layout.Sider)`
  text-align: left;
`;

export const SiderContent = styled.div`
  padding: 0 1rem;
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StartControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  gap: 0.3rem;
`;

export const EndControls = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`;

export const CardsWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: space-between;
  height: 704px;
  max-width: 380px;
`;

export const BoardSettingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const BoardSettingTitle = styled(Typography.Title)`
  margin: 0 !important;
`;

export const DisplayCard = styled(Card)`
  background-color: #fafafa;
  border: solid 2px gray;
  border-radius: 4px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const OverflowIndicator = css<{ $isVisible: boolean }>`
  position: absolute;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  pointer-events: none;
  transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
  z-index: 2;
  ${({ $isVisible }) =>
    $isVisible
      ? css`
          visibility: visible;
          opacity: 1;
        `
      : css`
          visibility: hidden;
          opacity: 0;
        `}
`;

export const OverflowIndicatorTop = styled.div<{ $isVisible: boolean }>`
  ${OverflowIndicator};
  top: 0px;
  left: 0px;
  right: 0px;
  height: 20px;
  background: linear-gradient(0deg, rgba(128, 128, 128, 0), rgb(128, 128, 128));
`;

export const OverflowIndicatorBottom = styled.div<{ $isVisible: boolean }>`
  ${OverflowIndicator};
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 20px;
  background: linear-gradient(180deg, rgba(128, 128, 128, 0), rgb(128, 128, 128));
`;

export const OverflowIndicatorLeft = styled.div<{ $isVisible: boolean }>`
  ${OverflowIndicator};
  bottom: 0px;
  left: 0px;
  top: 0px;
  width: 20px;
  background: linear-gradient(-90deg, rgba(128, 128, 128, 0), rgb(128, 128, 128));
`;

export const OverflowIndicatorRight = styled.div<{ $isVisible: boolean }>`
  ${OverflowIndicator};
  bottom: 0px;
  right: 0px;
  top: 0px;
  width: 20px;
  background: linear-gradient(90deg, rgba(128, 128, 128, 0), rgb(128, 128, 128));
`;

export const NavBarHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
`;

export const Stat = styled.div`
  text-align: left;
`;

export const StatName = styled(Typography.Title)`
  margin: 0 !important;
  /* font-style: italic; */

  span {
    font-weight: 300;
  }
`;

export const ControlRow = styled(Typography.Text)`
  text-align: left;
`;

export const ControlsHeader = styled(Typography.Title)`
  margin: 0 !important;
`;

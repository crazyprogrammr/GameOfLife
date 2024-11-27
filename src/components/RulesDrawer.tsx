import { List, Typography } from "antd";
import { useGame } from "../utilities/gameContext";
import { Sider, SiderContent } from "../styles";

const rules = [
  { name: "Birth", rule: "A dead cell will become alive in the next generation if it has exactly 3 alive neighbors." },
  { name: "Survival", rule: "An alive cell will stay alive in the next generation if it has 2 or 3 alive neighbors." },
  { name: "Death", rule: "If cell is lonely (less than 2 neighbors) or overcrowded (more than 3 neighbors) it will die or remain dead in the next generation." },
];

const RulesDrawer = () => {
  const { areRulesOpen } = useGame();
  return (
    <Sider width={400} collapsed={!areRulesOpen} collapsedWidth={0}>
      <SiderContent>
        <Typography.Title level={3} style={{ textAlign: "left", color: "white" }}>
          Game Of Life Rules
        </Typography.Title>
        <Typography.Paragraph style={{ color: "white", textAlign: "left" }}>
          Conway's game of life is a zero-player game. Set up initial colony and watch it evolving based on following rules:
        </Typography.Paragraph>
        <List
          dataSource={rules}
          itemLayout="horizontal"
          style={{ color: "white" }}
          renderItem={(item, index) => (
            <List.Item style={{ color: "inherit" }}>
              <List.Item.Meta
                avatar={<Typography.Text style={{ color: "white", width: "80px", display: "inline-block" }}>{`${index + 1}. ${item.name}: `}</Typography.Text>}
                title={<Typography.Text style={{ color: "white" }}>{item.rule}</Typography.Text>}
              />
            </List.Item>
          )}
        />
      </SiderContent>
    </Sider>
  );
};

export default RulesDrawer;

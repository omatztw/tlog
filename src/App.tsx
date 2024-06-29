import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Grid, Tab, Tabs, Typography } from "@mui/material";
import { CustomTabPanel } from "./components/CustomTabPannel";
import { Preference } from "./components/Preference";
import { usePersistState } from "./util/hooks";
import { TaskLog } from "./components/TaskLog";
import { History } from "./components/History";

export type TaskHistory = {
  id: number;
  taskName: string;
  timestamp: Date;
};

const parseJSON = (json: string) => {
  return JSON.parse(json, (key, value) => {
    if (key === "timestamp") {
      return new Date(value);
    } else {
      return value;
    }
  });
};

export default function App() {
  const [value, setValue] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [history, _setHistory] = useState<TaskHistory[]>(() => {
    const his = localStorage.getItem("history");
    return his ? (parseJSON(his) as TaskHistory[]) : [];
  });
  const [taskList, setTaskList] = usePersistState<string[]>({
    key: "taskList",
    initialValue: [],
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const saveHistory = (history: TaskHistory[]) => {
    localStorage.setItem("history", JSON.stringify(history));
  };

  const setHistory = (history: TaskHistory[]) => {
    saveHistory(history);
    _setHistory(history);
  };

  const pushHistory = (newHistory: TaskHistory) => {
    setCurrentTask(newHistory.taskName);
    setHistory([...history, newHistory]);
  };

  return (
    <Container maxWidth={"xl"}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label='記録' {...a11yProps(0)} />
          <Tab label='設定' {...a11yProps(1)} />
          <Tab label='履歴' {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box>
          <TaskLog
            taskList={taskList}
            pushHistory={pushHistory}
            currentTask={currentTask}
          />
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container>
          <Grid item xs={3}>
            <Preference
              title={"タスク設定"}
              list={taskList}
              setList={setTaskList}
            />
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Grid container>
          <Grid item xs={3}>
            <History history={history} setHistory={setHistory} />
          </Grid>
        </Grid>
      </CustomTabPanel>
    </Container>
  );
}

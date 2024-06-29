import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TaskHistory } from "../App";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TimeChart } from "./TimeChart";

type Props = {
  history: TaskHistory[];
  setHistory: (history: TaskHistory[]) => void;
};

export const History = ({ history, setHistory }: Props) => {
  // const [displayDate, setDisplayDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState<Dayjs | null>(
    dayjs(new Date().toLocaleString())
  );

  const handleInputChange = (e: Dayjs | null, task: TaskHistory) => {
    if (!e) return;
    const value = e.toDate();
    const newList = history.map((t) => {
      if (t.id === task.id) {
        return {
          id: task.id,
          taskName: task.taskName,
          timestamp: value,
        };
      }
      return t;
    });
    setHistory(newList);

    // setHistory([...history, task]);
  };

  const handleRemoveClick = (task: TaskHistory) => {
    const newList = history.filter(
      (t) => t.timestamp.getTime() !== task.timestamp.getTime()
    );
    setHistory(newList);
  };

  const isSameDay = (a?: Date, b?: Date) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const deleteHistory = () => {
    setHistory(
      history.filter((t) => !isSameDay(t.timestamp, displayDate?.toDate()))
    );
  };

  return (
    <Grid container width={1500}>
      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='表示日時'
            value={displayDate}
            onChange={(newValue) => setDisplayDate(newValue)}
            format='YYYY/MM/DD'
            sx={{ mt: 2 }}
          />
        </LocalizationProvider>
        <Box>
          <Button
            sx={{ mt: 1 }}
            variant='contained'
            size='small'
            color='error'
            onClick={deleteHistory}
          >
            履歴削除
          </Button>
        </Box>
        <Typography variant='h5' sx={{ mt: 1, mb: 3 }}>
          {`履歴`}
        </Typography>

        {history
          .filter((t) => isSameDay(t.timestamp, displayDate?.toDate()))
          .toSorted((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          .map((task) => {
            return (
              <Grid container key={task.id} sx={{ mt: 2 }}>
                <Grid item sx={{ mr: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label={task.taskName}
                      minutesStep={1}
                      defaultValue={dayjs(task.timestamp)}
                      onChange={(e) => handleInputChange(e, task)}
                      format='YYYY/MM/DD HH:mm:ss'
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item alignItems='stretch' style={{ display: "flex" }}>
                  <IconButton
                    aria-label='delete'
                    onClick={() => handleRemoveClick(task)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
      </Grid>
      <Grid item xs={8} sx={{ minHeight: 1000 }}>
        <TimeChart
          history={history
            .filter((t) => isSameDay(t.timestamp, displayDate?.toDate()))
            .toSorted((a, b) => a.timestamp.getTime() - b.timestamp.getTime())}
          displayDate={displayDate}
        />
      </Grid>
    </Grid>
  );
};

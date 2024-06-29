import { Button, Grid } from "@mui/material";

type Props = {
  task: string;
  onLog: (task: string, date: Date) => void;
  logging: boolean;
};

export const Task = ({ task, onLog, logging }: Props) => {
  const onStart = () => {
    const now = new Date();
    onLog(task, now);
  };
  const loadingStyle = {
    backgroundColor: "blue",
    color: "white",
  };
  return (
    <Grid container gap={2} direction={"row"}>
      <Grid item width={300} sx={logging ? loadingStyle : undefined}>
        {task}
      </Grid>
      <Grid item>
        <Button onClick={onStart}>Start</Button>
      </Grid>
    </Grid>
  );
};

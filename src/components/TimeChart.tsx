import ReactApexChart from "react-apexcharts";
import { TaskHistory } from "../App";
import { ApexOptions } from "apexcharts";
import { Dayjs } from "dayjs";
import { Typography } from "@mui/material";

type Props = {
  history: TaskHistory[];
  displayDate: Dayjs | null;
};
export const TimeChart = ({ history, displayDate }: Props) => {
  const minDate = displayDate
    ?.set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate();
  const maxDate = displayDate
    ?.add(1, "day")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0)
    .toDate();

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
      },
      min: minDate?.getTime(),
      max: maxDate?.getTime(),
    },
    stroke: {
      width: 1,
    },
  };

  const series = history.reduce<any[]>((acc, c, i) => {
    if (i > 0) {
      const previousTask = history[i - 1];
      acc.push({
        x: previousTask.taskName,
        y: [previousTask.timestamp.getTime(), c.timestamp.getTime()],
      });
    }
    if (i === history.length - 1) {
      acc.push({
        x: c.taskName,
        y: [c.timestamp.getTime(), c.timestamp.getTime()],
      });
    }
    return acc;
  }, []);

  return (
    <>
      {series.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series ? [{ data: series }] : []}
          type='rangeBar'
          height={350}
        />
      ) : (
        <Typography sx={{ mt: 5 }}>データなし</Typography>
      )}
    </>
  );
};

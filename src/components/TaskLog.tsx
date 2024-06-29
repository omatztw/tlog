import { useState } from "react";
import { Task } from "./Task";
import { TaskHistory } from "../App";

type Props = {
  taskList: string[];
  pushHistory: (history: TaskHistory) => void;
  currentTask: string;
};

export const TaskLog = (props: Props) => {
  const { taskList, pushHistory, currentTask } = props;

  const onLog = (task: string, date: Date) => {
    pushHistory({ id: date.getTime(), taskName: task, timestamp: date });
  };
  return (
    <>
      {taskList.map((task, i) => (
        <Task
          key={i}
          task={task}
          onLog={onLog}
          logging={currentTask === task}
        ></Task>
      ))}
    </>
  );
};

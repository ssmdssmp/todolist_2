import { useState } from "react";
import checkboxImg from "../img/checkbox.svg";
import checkbboxActive from "../img/checkbox-active.svg";
import deleteImg from "../img/delete.svg";
import { Transition } from "react-transition-group";
import { useEffect, useMemo } from "react";
import { update } from "../services/MainService";

const Step = ({
  title,
  tasks,
  setTasks,
  steps,
  setSteps,
  id,
  parentId,
  finished,
  userDBId,
  folders,
}) => {
  const [input, setInput] = useState(title);
  const [done, setDone] = useState(finished);
  const [focus, setFocus] = useState(false);
  const [created, setCreated] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    setCreated(true);
  }, []);
  const handleDelete = () => {
    setSteps([...steps.filter((el) => el.id !== id)]);
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === parentId));
    const deletedStep = tasks.find((el) => el.id === parentId);
    deletedStep.steps = [...steps.filter((el) => el.id !== id)];
    newTasks.splice(index, 1, deletedStep);
    setTasks(newTasks);
    update(userDBId, newTasks, folders);
  };
  const handleDone = () => {
    setDone(!done);
    const newSteps = [...steps];
    const index = steps.indexOf(steps.find((el) => el.id === id));
    const doneStep = steps.find((el) => el.id === id);
    doneStep.done = !done;
    newSteps.splice(index, 1, doneStep);
    setSteps(newSteps);
  };
  const handleStepsInput = (e) => {
    setInput(e.target.value);
    const newSteps = [...steps];
    const index = steps.indexOf(steps.find((el) => el.id === id));
    // const parentIndex = tasks.indexOf(tasks.find((el) => el.id === parentId));
    const deletedStep = newSteps.find((el) => el.id === id);
    deletedStep.title = e.target.value;
    newSteps.splice(index, 1, deletedStep);
    setSteps(newSteps);
  };

  return (
    <li style={{ opacity: done ? "0.6" : 1 }}>
      <input
        style={{ textDecoration: done && !focus ? " line-through" : null }}
        value={input}
        onFocus={(e) => {
          e.target.select();
          setFocus(true);
        }}
        onBlur={(e) => handleStepsInput(e)}
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <div className="steps-options">
        <img
          onClick={() => handleDone()}
          src={done ? checkbboxActive : checkboxImg}
          alt=""
        />
        <img src={deleteImg} onClick={handleDelete} alt="" />
      </div>
    </li>
  );
};
export default Step;

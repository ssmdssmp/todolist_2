import uuid from "react-uuid";
import { useRef } from "react";
import detailsImg from "../img/details.svg";
import dateImg from "../img/date.svg";
import favImg from "../img/fav.svg";
import deleteImg from "../img/delete.svg";
import favActive from "../img/fav-active.svg";
import dateActive from "../img/date-active.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import checkboxImg from "../img/checkbox.svg";
import checkboxActive from "../img/checkbox-active.svg";
import FolderImg from "../img/folder.svg";
import FolderActive from "../img/folder-active.svg";

import Step from "./Step";
import { useState, useEffect } from "react";
import { Transition } from "react-transition-group";
const Task = ({ settings, setTasks, tasks, folders }) => {
  const [details, setDetails] = useState(false);
  const [input, setInput] = useState(settings.title);
  const [done, setDone] = useState(settings.done);
  const [fav, setFav] = useState(settings.fav);
  const [date, setDate] = useState(new Date(settings.date));
  const [description, setDescription] = useState(settings.description);
  const [showFolders, setShowFolders] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [foldered, setFoldered] = useState(settings.folder);
  const [steps, setSteps] = useState(
    settings.steps.length !== 0 ? settings.steps : []
  );
  const [today, setToday] = useState(new Date());
  const [stepsInput, setStepsInput] = useState("");
  const [overdue, setOverdue] = useState(false);
  const [created, setCreated] = useState(false);
  const [height, setHeight] = useState(240);
  useEffect(() => {
    setToday(new Date());
  }, []);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify([...tasks]));
  }, [tasks]);
  useEffect(() => {
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
    const deletedStep = tasks.find((el) => el.id === settings.id);
    deletedStep.steps = [...steps];
    newTasks.splice(index, 1, deletedStep);
    setTasks(newTasks);
  }, [steps]);
  useEffect(() => {
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
    const doneTask = tasks.find((el) => el.id === settings.id);
    doneTask.done = done;
    newTasks.splice(index, 1, doneTask);
    setTasks(newTasks);
  }, [done]);
  useEffect(() => {
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
    const favTask = tasks.find((el) => el.id === settings.id);
    favTask.fav = fav;
    newTasks.splice(index, 1, favTask);
    setTasks(newTasks);
  }, [fav]);
  useEffect(() => {
    setCreated(true);
  }, []);
  useEffect(() => {
    handleDate();
  }, [date]);
  useEffect(() => {
    if (folders.find((el) => el.title === foldered)) {
      return;
    } else {
      setFoldered("");
    }
  }, [folders]);
  const dateLogo = useRef();

  const addStep = (text) => {
    if (text.length !== 0) {
      setSteps([...steps, { title: text, id: uuid(), done: false }]);
      clearStepInput();
    } else {
      return;
    }
  };
  const addStep__keyboard = (e) => {
    if (e.key === "Enter") {
      addStep(stepsInput);
    } else {
      return;
    }
  };
  const handleDate = () => {
    // setOldDate(date);
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
    const datedTask = tasks.find((el) => el.id === settings.id);
    datedTask.date = date;
    newTasks.splice(index, 1, datedTask);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };
  const CalendarDate = () => {
    const diff = today - date;
    if (diff > 0 && diff < 86400000) {
      return <p>Today</p>;
    }
    if (diff < 0 && diff > -86400000) {
      return <p>Tomorrow</p>;
    }

    if (diff > 86400000 && diff < 172800000) {
      return <p>Yesterday</p>;
    } else {
      return <p>{date.toString().slice(4, 10)}</p>;
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
    const inputedItem = tasks.find((el) => el.id === settings.id);
    inputedItem.title = e.target.value;
    newTasks.splice(index, 1, inputedItem);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };
  const handleFoldered = (text) => {
    if (settings.folder === text) {
      setFoldered("");
      const newTasks = [...tasks];
      const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
      const newItem = tasks.find((el) => el.id === settings.id);
      newItem.folder = "";
      newTasks.splice(index, 1, newItem);
      setTasks(newTasks);
      setShowFolders(false);
    } else {
      setFoldered(text);
      const newTasks = [...tasks];
      const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
      const newItem = tasks.find((el) => el.id === settings.id);
      newItem.folder = text;
      newTasks.splice(index, 1, newItem);
      setTasks(newTasks);
      setShowFolders(false);
    }
  };
  const clearStepInput = () => {
    setStepsInput("");
  };

  const handleDetails = () => {
    setDetails(!details);
    if (details) {
      setCalendarOpen(false);
    }
  };

  const handleCalendarOpen = () => {
    setCalendarOpen(!calendarOpen);
  };
  const handleFav = () => {
    setFav(!fav);
    if (!fav === true) {
      setDone(false);
    }
  };
  const handleDone = () => {
    setDone(!done);
    if (!done === true) {
      setFav(false);
    }
  };
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (event.target === document.querySelector(".date-img")) {
            return;
          } else {
            setCalendarOpen(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef);
  const handleDescription = (e) => {
    setDescription(e.target.value);
    const newTasks = [...tasks];
    const index = tasks.indexOf(tasks.find((el) => el.id === settings.id));
    const DescriptionedTask = tasks.find((el) => el.id === settings.id);
    DescriptionedTask.description = e.target.value;
    newTasks.splice(index, 1, DescriptionedTask);
    setTasks(newTasks);
  };
  const handleHeight = () => {
    setHeight(document.getElementById(settings.id).clientHeight);
    return height;
  };
  const handleDelete = () => {
    setTasks(tasks.filter((item) => item.id !== settings.id));
  };
  const duration = 300;
  const defaultStyle = {
    transition: `height ${duration}ms ease-in-out`,
    height: "55px",
  };
  const transitionStyles = {
    entering: {
      height: `${height}px`,
    },
    entered: { height: "auto" },
    exiting: {
      height: `${height}px`,
    },
    exited: {
      height: "55px",
    },
  };
  const opacityDefaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  };
  const opacityTransitionStyle = {
    entering: { opacity: "1" },
    entered: { opacity: "1" },
    exiting: { opacity: "0" },
    exited: { opacity: "0" },
  };
  return (
    <Transition in={created} timeout={duration} onExited={handleDelete}>
      {(state) => (
        <li
          className="task"
          style={{
            height: "auto",
            backdropFilter: calendarOpen ? "none" : "saturate(140%)",
            WebkitBackdropFilter: calendarOpen ? "none" : "saturate(140%)",
            ...opacityDefaultStyle,
            ...opacityTransitionStyle[state],
          }}
        >
          {calendarOpen ? (
            <div ref={wrapperRef}>
              <Calendar
                onClick={() => setCalendarOpen(!calendarOpen)}
                onChange={setDate}
                value={date}
              />
            </div>
          ) : null}
          <Transition
            in={details}
            timeout={duration}
            onExit={() => {
              handleHeight();
            }}
          >
            {(state) => (
              <div
                className="task-content"
                id={settings.id}
                style={{
                  opacity: done ? 0.6 : 1,
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                <div className="task-base">
                  <div className="task-base-checkbox-input">
                    <img
                      onClick={handleDone}
                      className="task-base-checked"
                      src={done ? checkboxActive : checkboxImg}
                      alt=""
                      style={{ height: "25px" }}
                    />
                    <input
                      className="task-base-input"
                      type="text"
                      value={input}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="options">
                    <img
                      onClick={handleFav}
                      src={fav ? favActive : favImg}
                      alt=""
                      style={{ visibility: showFolders ? "hidden" : null }}
                    />
                    <div className="folder-img">
                      <img
                        onClick={() => setShowFolders(!showFolders)}
                        src={foldered !== "" ? FolderActive : FolderImg}
                        alt=""
                      />
                      <p>{foldered.slice(0, 3)}</p>
                      <ul
                        className="folder-list"
                        style={{
                          visibility: showFolders ? "inherit" : "hidden",
                        }}
                      >
                        {folders.map((item) => {
                          return (
                            <li
                              onClick={() => handleFoldered(item.title)}
                              key={uuid()}
                            >
                              {item.title}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="date" onClick={handleCalendarOpen}>
                      <img
                        ref={dateLogo}
                        className="date-img"
                        src={calendarOpen ? dateActive : dateImg}
                        alt=""
                        style={{ filter: "invert(1)" }}
                      />
                      <CalendarDate />
                    </div>

                    <img
                      onClick={() => setCreated(false)}
                      src={deleteImg}
                      alt=""
                    />
                    <button className="task-base-button">
                      <img
                        src={detailsImg}
                        style={{ transform: details ? "rotate(180deg)" : null }}
                        onClick={handleDetails}
                        className=""
                        alt=""
                      />
                    </button>
                  </div>
                </div>
                <div
                  className="task-details"
                  style={{ opacity: details ? 1 : 0 }}
                >
                  <div className="task-details-steps">
                    <div className="steps-input">
                      <input
                        onKeyDown={(e) => addStep__keyboard(e)}
                        type="text"
                        placeholder="Add step"
                        value={stepsInput}
                        onChange={(e) => setStepsInput(e.target.value)}
                      />
                      <button onClick={() => addStep(stepsInput)}>+</button>
                    </div>
                    <ul className="steps-list">
                      {steps.map((item) => {
                        return (
                          <Step
                            finished={item.done}
                            key={uuid()}
                            parentId={settings.id}
                            id={item.id}
                            steps={steps}
                            setSteps={setSteps}
                            setTasks={setTasks}
                            tasks={tasks}
                            title={item.title}
                          ></Step>
                        );
                      })}
                    </ul>
                  </div>
                  <textarea
                    className="description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => handleDescription(e)}
                  ></textarea>
                </div>
              </div>
            )}
          </Transition>
        </li>
      )}
    </Transition>
  );
};
export default Task;

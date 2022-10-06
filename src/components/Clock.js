import { useEffect } from "react";
import { useState } from "react";
const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      //   setTik(!tik);
    }, 1000);
  }, []);
  const addZero = (a) => {
    if (a < 10) {
      return `0${a}`;
    } else {
      return a;
    }
  };
  const duration = 1000;
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 1,
  };
  const transitionStyle = {
    entering: { opacity: "1" },
    entered: { opacity: "0" },
    exiting: { opacity: "1" },
    exited: { opacity: "1   " },
  };
  return (
    <div className="today">
      <div className="today-clock">
        <p>{addZero(time.getHours())}</p>
        <p>{addZero(time.getMinutes())}</p>
        <p>{addZero(time.getSeconds())}</p>
      </div>
      <p>{time.toString().slice(4, 15)}</p>
      <p>{time.toLocaleDateString("en", { weekday: "long" })}</p>
    </div>
  );
};
export default Clock;

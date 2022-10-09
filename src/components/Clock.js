import { useEffect } from "react";
import { useState } from "react";
const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);
  const addZero = (timeValue) => {
    if (timeValue < 10) return `0${timeValue}`;
    else return timeValue;
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

import { useState, useEffect, useRef } from "react";
import imageImg from "../img/image.svg";
import DragDrop from "./DragDrop";
const ChangeTheme = ({ setBg, bg, userDBId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (event.target === document.querySelector(".change-theme img")) {
            return;
          } else {
            setOpen(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(ref);
  const handleOpen = () => {
    setOpen(!open);
    console.log(!open);
  };
  return (
    <div className="change-theme">
      <img onClick={handleOpen} src={imageImg} alt="" />
      {open ? (
        <div ref={ref} className="drag-drop">
          <DragDrop userDBId={userDBId} bg={bg} setBg={setBg} />
        </div>
      ) : null}
    </div>
  );
};
export default ChangeTheme;

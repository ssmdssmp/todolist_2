import { useState } from "react";
import { useRef, useEffect } from "react";
import deleteImg from "../img/delete.svg";
import folderImg from "../img/folder.svg";
import folderActive from "../img/folder-active.svg";
import folderPlus from "../img/folder-plus.svg";
import uuid from "react-uuid";
import { update } from "../services/MainService";
const Folders = ({
  folders,
  setFolders,
  folderList,
  setFolderList,
  folderFilter,
  setFolderFilter,
  openFolders,
  setOpenFolders,
  handleFoldersList,
  userDBId,
  tasks,
}) => {
  console.log(folders);
  const foldersRef = useRef();
  const [folderInput, setFolderInput] = useState("");
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            event.target === document.querySelector(".folders-button") ||
            event.target ===
              document.querySelector(".menu ul li:nth-child(4) p")
          ) {
            return;
          } else {
            setOpenFolders(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(foldersRef);
  const createFolder = (text) => {
    if (text.length !== 0) {
      setFolders([...folders, { title: text, tasks: [] }]);
      setFolderInput("");
      update(userDBId, tasks, [...folders, { title: text, tasks: [] }]);
      localStorage.setItem(
        "folders",
        JSON.stringify([...folders, { title: text, tasks: [] }])
      );
    } else {
      return;
    }
  };
  const createFolder__keyboard = (e) => {
    if (e.key === "Enter") {
      createFolder(folderInput);
    } else {
      return;
    }
  };
  const handleDeleteFolder = (e) => {
    const value = e.target.parentElement.firstChild.nextSibling.textContent;
    setFolders([...folders.filter((el) => el.title !== value)]);
    localStorage.setItem(
      "folders",
      JSON.stringify([...folders.filter((el) => el.title !== value)])
    );
    update(userDBId, tasks, [...folders.filter((el) => el.title !== value)]);
  };

  return (
    <div
      ref={foldersRef}
      className="folders"
      style={{ visibility: openFolders ? "visible" : "hidden" }}
    >
      <div className="folders-content">
        <div className="choose-folder">
          <img src={folderImg} alt="folder-img" />
          <p>Choose folder</p>
        </div>
        <hr />

        <ul className="folders-list">
          <li onClick={() => handleFoldersList()}>
            <img src={!folderFilter ? folderActive : folderImg} alt="" /> All
            Tasks
          </li>
          {folders.map((item) => {
            return (
              <li key={uuid()}>
                <img
                  onClick={() => handleFoldersList(item.title)}
                  src={
                    folderFilter &&
                    folderList.length !== 0 &&
                    folderList[0].folder === item.title
                      ? folderActive
                      : folderImg
                  }
                  alt="folder-img"
                />
                <p onClick={() => handleFoldersList(item.title)}>
                  {item.title}
                </p>
                <img
                  onClick={(e) => handleDeleteFolder(e)}
                  src={deleteImg}
                  alt=""
                />
              </li>
            );
          })}

          <div className="create-folder">
            <img
              onClick={() => {
                createFolder(folderInput);
              }}
              src={folderPlus}
              alt="folder-img"
            />
            <input
              onKeyDown={(e) => createFolder__keyboard(e)}
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              type="text"
              placeholder="Create Folder"
            />
          </div>
        </ul>
        <hr />
      </div>
    </div>
  );
};
export default Folders;

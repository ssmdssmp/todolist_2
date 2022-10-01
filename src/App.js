import "./App.css";
import "./Calendar.css";

import deleteImg from "./img/delete.svg";
import doneImg from "./img/done.svg";
import favImg from "./img/fav.svg";
import folderImg from "./img/folder.svg";
import folderActive from "./img/folder-active.svg";
import folderPlus from "./img/folder-plus.svg";
import searchImg from "./img/search.svg";
import { useState } from "react";
import uuid from "react-uuid";
import Task from "./components/Task";
import { useEffect } from "react";
import plusImg from "./img/plus.svg";
import { useRef } from "react";
import Clock from "./components/Clock";
import ChangeTheme from "./components/ChangeTheme";
import axios from "axios";
function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [fav, setFav] = useState(false);
  const [favTasks, setFavTasks] = useState([]);
  const [done, setDone] = useState(false);
  const [doneTasks, setDoneTasks] = useState([]);
  const [input, setInput] = useState("");
  const [openFolders, setOpenFolders] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [folders, setFolders] = useState(
    JSON.parse(localStorage.getItem("folders")) || []
  );
  const [addFolderInput, setFolderInput] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [folderFilter, setFolderFilter] = useState(false);
  const [bg, setBg] = useState(
    localStorage.getItem("bg") ||
      "https://cdn.dribbble.com/users/32512/screenshots/5766594/media/8012003f689d662178b54addec32f16d.gif"
  );
  useEffect(() => {
    setFavTasks([...tasks.filter((el) => el.fav === true)]);
  }, [tasks]);
  useEffect(() => {
    setDoneTasks([...tasks.filter((el) => el.done === true)]);
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (tasks.length === 0) {
      localStorage.removeItem("tasks");
      console.log(localStorage.getItem("tasks"));
    } else {
      return;
    }
  }, [tasks]);
  let searchArr = tasks.filter((item) => {
    return item.title.toLowerCase().includes(searchValue.toLowerCase());
  });
  const mainInput = useRef(null);
  useEffect(() => {
    if (search) {
      mainInput.current.focus();
    }
  }, [search]);
  const foldersRef = useRef(null);
  document.addEventListener("click", (e) => console.log(e.target));
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
  const folderOpenRef = useRef(null);
  useOutsideAlerter(folderOpenRef);
  const clearInput = () => {
    setInput("");
  };
  const handleOpenFolders = () => {
    setOpenFolders(!openFolders);
  };
  const createTask = (text) => {
    if (text.length !== 0) {
      setTasks([
        ...tasks,
        {
          title: text,
          id: uuid(),
          done: false,
          fav: false,
          date: new Date(),
          description: "",
          steps: [],
          folder: "",
        },
      ]);
      setDone(false);
      setFav(false);
      clearInput();
      localStorage.setItem(
        "tasks",
        JSON.stringify([
          ...tasks,
          {
            title: text,
            id: uuid(),
            done: false,
            fav: false,
            date: new Date(),
            description: "",
            steps: [],
            folder: "",
          },
        ])
      );
    } else {
      return;
    }
  };
  const createTask__keyboard = (e) => {
    if (e.key === "Enter") {
      createTask(input);
    }
  };
  const handleFavList = () => {
    setSearch(false);
    setFav(!fav);
    if (!fav === true) {
      setDone(false);
      setFolderFilter(false);
    } else {
      setTasks([...tasks.sort((a, b) => Number(b.fav) - Number(a.fav))]);
    }
  };
  const handleDoneList = () => {
    setSearch(false);
    setDone(!done);
    if (!done === true) {
      setFav(false);
      setFolderFilter(false);
    } else {
      setTasks([...tasks.sort((a, b) => Number(a.done) - Number(b.done))]);
    }
  };
  const handleFoldersList = (text) => {
    setFolderFilter(true);
    const newList = [...tasks];
    newList.filter((el) => el.folder === text);
    setFolderList([...newList.filter((el) => el.folder === text)]);
    console.log(folderList);
  };
  const handleSearch = () => {
    setSearch(!search);
    setDone(false);
    setFav(false);
    setFolderFilter(false);
    console.log(search);
  };
  const handleDeleteFolder = (e) => {
    const value = e.target.parentElement.firstChild.nextSibling.textContent;
    setFolders([...folders.filter((el) => el.title !== value)]);
  };
  const createFolder = (text) => {
    if (text.length !== 0) {
      setFolders([...folders, { title: text, tasks: [] }]);
      setFolderInput("");
    } else {
      return;
    }
  };
  const createFolder__keyboard = (e) => {
    if (e.key === "Enter") {
      createFolder(addFolderInput);
    } else {
      return;
    }
  };
  console.log(bg);
  return (
    <div className="App">
      <div className="bg">
        <img src={bg} alt="" />
      </div>
      <ChangeTheme setBg={setBg} />
      <Clock />

      <div
        ref={foldersRef}
        className="folders"
        style={{ visibility: openFolders ? "visible" : "hidden" }}
      >
        <div ref={folderOpenRef} className="folders-content">
          <div className="choose-folder">
            <img src={folderImg} alt="folder-img" />
            <p>Choose folder</p>
          </div>
          <hr />

          <ul className="folders-list">
            <li onClick={() => setFolderFilter(false)}>
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
                onClick={() => createFolder(addFolderInput)}
                src={folderPlus}
                alt="folder-img"
              />
              <input
                onKeyDown={(e) => createFolder__keyboard(e)}
                value={addFolderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                type="text"
                placeholder="Create Folder"
              />
            </div>
          </ul>
          <hr />
        </div>
      </div>
      <div className="menu">
        <ul>
          <li>
            <img onClick={handleFavList} src={favImg} alt="" />
            <p>Important Tasks</p>
          </li>
          <li>
            <img onClick={handleDoneList} src={doneImg} alt="" />
            <p>Done Tasks</p>
          </li>
          <li>
            <img onClick={handleSearch} src={searchImg} alt="" />
            <p>Search</p>
          </li>
          <li onClick={handleOpenFolders}>
            <img
              className="folders-button"
              src={openFolders ? folderActive : folderImg}
              alt=""
            />
            <p>Choose Folder</p>
          </li>
        </ul>
      </div>

      <div className="content">
        <div className="center">
          <div className="add-task">
            <input
              onBlur={() => setSearch(false)}
              ref={mainInput}
              autoFocus
              placeholder={search ? "What are you searching for" : null}
              type="text"
              value={search ? searchValue : input}
              onChange={
                search
                  ? (e) => setSearchValue(e.target.value)
                  : (e) => setInput(e.target.value)
              }
              onKeyDown={search ? null : createTask__keyboard}
            />

            <button
              onClick={() => createTask(input)}
              className="add-task-button"
            >
              <img src={search ? searchImg : plusImg} alt="" />
            </button>
          </div>
          {search ? (
            <ul className="tasks-storage">
              {searchArr.map((item) => {
                return (
                  <Task
                    key={item.id}
                    settings={item}
                    setTasks={setTasks}
                    tasks={tasks}
                    folders={folders}
                  />
                );
              })}
            </ul>
          ) : (
            <ul className="tasks-storage">
              {folderFilter
                ? folderList.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : fav === false && done === false
                ? tasks.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : fav === true
                ? favTasks.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : done === true
                ? doneTasks.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : null}

              {/* {fav === false && done === false
                ? tasks.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : fav === true
                ? favTasks.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : done === true
                ? doneTasks.map((item) => {
                    return (
                      <Task
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : null} */}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import ChangeTheme from "../components/ChangeTheme";
import Clock from "../components/Clock";
import Login from "../components/Login";
import Folders from "../components/Folders";
import Task from "../components/Task";
import axios from "axios";
import { update, setToDefault } from "../services/MainService";
import { useState, useEffect, useRef, useCallback } from "react";
import uuid from "react-uuid";
import doneImg from "../img/done.svg";
import favImg from "../img/fav.svg";
import folderImg from "../img/folder.svg";
import folderActive from "../img/folder-active.svg";
import searchImg from "../img/search.svg";
import plusImg from "../img/plus.svg";

const MainPage = ({ bg, setBg }) => {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  const [user, setUser] = useState("");
  const [userDBId, setUserDBId] = useState(
    localStorage.getItem("userDBId") || ""
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
  const [folderList, setFolderList] = useState([]);
  const [folderFilter, setFolderFilter] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newTaskLoading, setNewTaskLoading] = useState(false);
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (userDBId !== "") {
      axios
        .get(`https://6339e08066857f698fbca663.mockapi.io/DB/${userDBId}`)
        .then((res) => {
          if (res.status === 200) {
            setTasks(res.data.tasks);
            setFolders(res.data.folders);
            setUser(
              res.data.credits.email.slice(
                0,
                res.data.credits.email.indexOf("@")
              )
            );
            setLoaded(true);
          }
        })
        .catch(() => {
          return;
        });
    } else {
      if (!localStorage.getItem("tasks")) {
        setToDefault().then((res) => {
          setTasks(res.tasks);
          localStorage.setItem("tasks", JSON.stringify(res.tasks));
          setFolders(res.folders);
          localStorage.setItem("folders", JSON.stringify(res.folders));
          setBg(JSON.parse(localStorage.getItem("bg")) || res.bg);
        });
      } else {
        setTasks(JSON.parse(localStorage.getItem("tasks")));
        setFolders(JSON.parse(localStorage.getItem("folders")));
      }
    }
  }, [userDBId]);

  useEffect(() => {
    setFavTasks([...tasks.filter((el) => el.fav === true)]);
  }, [tasks]);
  useEffect(() => {
    setDoneTasks([...tasks.filter((el) => el.done === true)]);
  }, [tasks]);
  let searchArr = tasks.filter((item) => {
    return item.title.toLowerCase().includes(searchValue.toLowerCase());
  });
  useEffect(() => {
    memoUpdate(userDBId, tasks, folders);
  });
  useEffect(() => {
    axios
      .get("https://makemeapassword.ligos.net/api/v1/alphanumeric/json?c=1&l=8")
      .then((res) => {
        setPassword(res.data.pws[0]);
      });
  }, []);
  const memoUpdate = useCallback(
    (userDBId, tasks, folders) => {
      if (newTaskLoading) {
        return;
      } else {
        update(userDBId, tasks, folders);
      }
    },
    [setTasks, tasks, folders]
  );
  const mainInput = useRef(null);
  useEffect(() => {
    if (search) {
      mainInput.current.focus();
    }
  }, [search]);
  useEffect(() => {
    if (tasks.length === 0) {
      localStorage.removeItem("tasks");
    } else {
      return;
    }
  }, [tasks]);
  const clearInput = () => {
    setInput("");
  };
  const handleOpenFolders = () => {
    setOpenFolders(!openFolders);
  };
  const createTask = (text) => {
    if (text.length !== 0) {
      setNewTaskLoading(true);
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
          details: false,
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
            details: false,
            date: new Date(),
            description: "",
            steps: [],
            folder: "",
          },
        ])
      );
      userDBId !== ""
        ? update(
            userDBId,
            [
              ...tasks,
              {
                title: text,
                id: uuid(),
                done: false,
                fav: false,
                date: new Date(),
                description: "",
                steps: [],
                details: false,
                folder: "",
              },
            ],
            folders
          ).then(setNewTaskLoading(false))
        : localStorage.setItem(
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
                details: false,
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
    setFolderFilter(!folderFilter);
    if (!folderFilter === true) {
      const newList = [...tasks];
      newList.filter((el) => el.folder === text);
      setFolderList([...newList.filter((el) => el.folder === text)]);
    } else {
      setFolderList([]);
    }
  };
  const handleSearch = () => {
    setSearch(!search);
    setDone(false);
    setFav(false);
    setFolderFilter(false);
  };

  return (
    <>
      <ChangeTheme userDBId={userDBId} bg={bg} setBg={setBg} />
      <Clock />
      <Login
        openFolders={openFolders}
        password={password}
        user={user}
        setTasks={setTasks}
        setFolders={setFolders}
        setBg={setBg}
        userDBId={userDBId}
        setUserDBId={setUserDBId}
        setUser={setUser}
      />
      <Folders
        tasks={tasks}
        folders={folders}
        setFolders={setFolders}
        folderList={folderList}
        setFolderList={setFolderList}
        folderFilter={folderFilter}
        userDBId={userDBId}
        openFolders={openFolders}
        setOpenFolders={setOpenFolders}
        handleFoldersList={handleFoldersList}
      />
      <div className="menu">
        {/* <Logout></Logout> */}
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
                    newTaskLoading={newTaskLoading}
                    userDBId={userDBId}
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
                        newTaskLoading={newTaskLoading}
                        userDBId={userDBId}
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
                        newTaskLoading={newTaskLoading}
                        userDBId={userDBId}
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
                        newTaskLoading={newTaskLoading}
                        userDBId={userDBId}
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
                        newTaskLoading={newTaskLoading}
                        userDBId={userDBId}
                        key={item.id}
                        settings={item}
                        setTasks={setTasks}
                        tasks={tasks}
                        folders={folders}
                      />
                    );
                  })
                : null}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
export default MainPage;

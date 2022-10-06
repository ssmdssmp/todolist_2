import axios from "axios";

export const update = (userDBId, tasks, folders) => {
  if (userDBId === "") {
    return;
  } else {
    return axios.put(
      `https://6339e08066857f698fbca663.mockapi.io/DB/${userDBId}`,
      {
        tasks: tasks,
        folders: folders,
      }
    );
  }
};
export const signin = (email, password) =>
  axios.get(`https://6339e08066857f698fbca663.mockapi.io/DB`).then((res) => {
    const selected = res.data.find((el) => el.credits.email === email);
    if (selected.credits.password === password) {
      const data = {
        user: selected.credits.email.slice(
          0,
          selected.credits.email.indexOf("@")
        ),
        tasks: selected.tasks,
        folders: selected.folders,
        id: selected.id,
      };
      return data;
    } else {
      return 0;
    }
  });
export const signup = (email, password) =>
  axios.get("https://6339e08066857f698fbca663.mockapi.io/DB").then((res) => {
    let id;
    if (res.data.length === 0) {
      id = 1;
    } else {
      id = +res.data.at(-1).id + 1;
    }

    const user = email.slice(0, email.indexOf("@"));
    if (!res.data.find((el) => el.credits.email === email)) {
      axios.post("https://6339e08066857f698fbca663.mockapi.io/DB", {
        credits: {
          email: email,
          password: password,
        },
        tasks: [],
        folders: [],
        bg: "",
      });
    }
    const data = { id: id, user: user };
    return data;
  });

export const setToDefault = () =>
  axios
    .get("https://6339e08066857f698fbca663.mockapi.io/default")
    .then((res) => {
      const result = res.data[0];
      const data = {
        tasks: result.tasks,
        folders: result.folders,
        bg: result.bg,
      };
      console.log(data);
      return data;
    });

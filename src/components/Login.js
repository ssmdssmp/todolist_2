import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import { refreshTokenSetup } from "../utils/refreshToken";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import userImg from "../img/user.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { signin, signup, setToDefault } from "../services/MainService";

const Login = ({
  user,
  setUser,
  userDBId,
  setUserDBId,
  setTasks,
  setFolders,
  setBg,
  password,
  openFolders,
}) => {
  const [loginOpen, setLoginOpen] = useState(true);

  useEffect(() => {
    if (userDBId !== "") {
      setLoginOpen(false);
    }
  }, []);
  useEffect(() => {
    if (openFolders) {
      setLoginOpen(false);
    }
  }, [openFolders]);
  const loginRef = useRef();
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (event.target === document.querySelector(".login-link img")) {
            return;
          } else {
            setLoginOpen(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(loginRef);
  const clientId =
    "257402161708-jt2j1bejaad3fe46sppc41bp61d0o5bv.apps.googleusercontent.com";
  useEffect(() => {
    const initClient = () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  // console.log(loginInput);
  const googleLogout = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2 !== null) {
      auth2.signOut().then(auth2.disconnect().then(() => {}));

      setToDefault()
        .then((res) => {
          localStorage.clear();
          setTasks(res.tasks);
          setFolders(res.folders);
          localStorage.setItem("tasks", JSON.stringify(res.tasks));
          localStorage.setItem("folders", JSON.stringify(res.folders));
          setUser("");
          setUserDBId("");
        })
        .catch(() => {
          setTasks([]);
          setFolders([]);
        });
    }
  };

  const onSuccess = (res) => {
    const data = res;

    axios
      .get("https://6339e08066857f698fbca663.mockapi.io/DB")
      .then((result) => {
        let index;
        if (result.data.length !== 0) {
          index = result.data.at(-1).id;
        } else {
          index = 0;
        }

        const found = result.data.find(
          (el) => el.credits.email === data.profileObj.email
        );

        console.log(password);
        if (!found) {
          axios
            .post("https://6339e08066857f698fbca663.mockapi.io/DB", {
              credits: {
                email: res.profileObj.email,
                password: password,
              },
              tasks: [],
              folders: [],
              bg: "",
            })
            .then(() => {
              setUserDBId(+index + 1);
              setUser(
                res.profileObj.email.slice(0, res.profileObj.email.indexOf("@"))
              );
              localStorage.setItem("userDBId", +index + 1);
              localStorage.setItem(
                "user",
                res.profileObj.email.slice(0, res.profileObj.email.indexOf("@"))
              );
            });
        } else {
          setUserDBId(found.id);
          setUser(
            res.profileObj.email.slice(0, res.profileObj.email.indexOf("@"))
          );
          setTasks(found.tasks);
          localStorage.setItem("tasks", JSON.stringify(found.tasks));
          setFolders(found.folders);
          localStorage.setItem("folders", JSON.stringify(found.folders));
          localStorage.setItem("userDBId", found.id);
          localStorage.setItem(
            "user",
            res.profileObj.email.slice(0, res.profileObj.email.indexOf("@"))
          );
        }
      });
    refreshTokenSetup(res);
  };
  const handleSubmit = (values, a) => {
    switch (a) {
      case "signup": {
        signup(values.email, values.password)
          .then((res) => {
            setUser(res.user);
            setUserDBId(res.id);
            localStorage.setItem("userDBId", res.id);
            localStorage.setItem("user", res.user);
          })
          .then(setToDefault());
        break;
      }
      case "signin": {
        signin(values.email, values.password).then((res) => {
          localStorage.clear();
          if (!res) {
            console.log("wrong password");
            return;
          } else {
            setUser(res.user);
            setUserDBId(res.id);
            localStorage.setItem("userDBId", res.id);
            localStorage.setItem("user", res.user);
            localStorage.setItem("tasks", JSON.stringify(res.tasks));
            localStorage.setItem("folders", JSON.stringify(res.folders));
            setTasks(res.tasks);
            setFolders(res.folders);
            console.log(res.folders);
          }
        });

        break;
      }
      default: {
        console.log(values);
        return;
      }
    }
  };

  const onFailure = (res) => {};
  const MyInput = ({ ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <input {...props} {...field} />
        {meta.touched && meta.error ? (
          <div className="form-error">{meta.error}</div>
        ) : null}
      </>
    );
  };

  return (
    <div ref={loginRef} className="login">
      <div className="login-link" onClick={() => setLoginOpen(!loginOpen)}>
        <p>{user}</p>
        <img src={userImg} alt="" />
      </div>
      {loginOpen ? (
        <>
          {userDBId === "" ? (
            <>
              <p>Sign in to sync Your Progress</p>
              <div className="login-inputs">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email()
                      .required("Enter your correct email"),
                    password: Yup.string()
                      .required()
                      .min(8, "8 characters minimum"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, "signup");

                    resetForm({ values: "" });
                  }}
                >
                  {(props) => (
                    <Form className="form">
                      <MyInput placeholder="Email" name="email" />
                      <MyInput
                        autoComplete="true"
                        placeholder="Password"
                        name="password"
                        type="password"
                      />

                      <div className="login-buttons">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(props.values, "signin");
                          }}
                          id="signin"
                        >
                          Sign In
                        </button>
                        <button id="signup" type="submit">
                          Sign Up
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <GoogleLogin
                prompt="select_account"
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={(res) => onSuccess(res)}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                style={{ marginTop: "100px" }}
                isSignedIn={true}
              />
              <div className="link-wrapper">
                <Link to="./terms" className="terms-link">
                  Terms of usage
                </Link>
                <Link to="./privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="login-inputs">
                <p style={{ marginTop: userDBId ? "0vh" : "4vh" }}>
                  You are logged as {user}
                </p>
              </div>
              <div
                className="login-buttons"
                style={{ justifyContent: "center", width: "100%" }}
              >
                <button onClick={() => googleLogout()}>Sign Out</button>
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Login;

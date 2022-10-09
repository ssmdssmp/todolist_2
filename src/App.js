import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import "./Calendar.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
function App() {
  const [bg, setBg] = useState(
    localStorage.getItem("bg") ||
      "https://shared.cdn.smp.schibsted.com/v2/images/e38e20d0-cf8a-453d-881c-a5edbd068d6d?fit=crop&format=auto&h=900&w=1600&s=b1533bfd995eaf85e62cf4881c46c1cf87df54da"
  );
  const router = createHashRouter([
    {
      path: "/",
      element: <MainPage bg={bg} setBg={setBg} />,
    },
    {
      path: "/terms",
      element: <TermsPage />,
    },
    {
      path: "/privacy",
      element: <PrivacyPage />,
    },
  ]);

  return (
    <GoogleOAuthProvider
      clientId={
        "257402161708-jt2j1bejaad3fe46sppc41bp61d0o5bv.apps.googleusercontent.com"
      }
    >
      <div className="App">
        <div className="bg">
          <img src={bg} alt="" />
        </div>
        <RouterProvider router={router} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

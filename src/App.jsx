import Login from "./Component/Auth/Login.jsx";
import Signup from "./Component/Auth/Signup.jsx";
import ForgetPassword from "./Component/Auth/ForgetPassword.jsx";
import Home from "./Home.jsx";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  return (
    // User detail thevaillai na <Route></Route>
    // Basic authenticated or user details must na "PrivateRoute" use pannanum.
    <Routes>
      {/*Auth*/}
      <Route path="/login" Component={Login} />
      <Route path="/signup" Component={Signup} />
      <Route path="/forgetPassword" Component={ForgetPassword} />

      {/*Chat UI*/}
      <Route
        path="/"
        exact
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

import React from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { signInAuthFirebase } from "../../lib/firebase/auth";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    // Handle login logic here
    try {
      const a = await signInAuthFirebase(email.value, password.value);
      if (a) {
        navigate("/");
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <div className="descLink">
          <p>
            <Link to="/forgetPassword">Forget Password?</Link>
          </p>
        </div>
        <div className="descLink">
          <p>
            If you don't have an account?<Link to="/signup">Signup</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;

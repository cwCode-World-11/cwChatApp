import { useRef } from "react";
import { Link } from "react-router-dom";
import { resetAuthFirebase } from "../../lib/firebase/auth";

const ForgetPassword = () => {
  const emailRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await resetAuthFirebase(emailRef.current.value);
      alert("Unnoda mail ah check pannu");
    } catch (err) {
      console.error("err:", err);
      alert(err);
    }
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}>
      <h2 style={{ textAlign: "center", marginTop: "1em" }}>Password Reset</h2>
      <form
        onSubmit={handleSubmit}
        className="login-form"
        style={{ margin: "auto" }}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" ref={emailRef} required />
        </div>
        <button type="submit" className="login-button">
          Reset
        </button>
        <div className="descLink">
          <p>
            <Link to="/login">Login</Link>
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
};

export default ForgetPassword;

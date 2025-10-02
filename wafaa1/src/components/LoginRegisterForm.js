import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import "boxicons/css/boxicons.min.css";
import { useNavigate } from "react-router-dom";


const LoginRegisterForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  // States login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // States register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // === Fonction login ===
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email: loginEmail,
        password: loginPassword,
      });

      setMessage("✅ Login successful!");
      // Stocker le token dans le localStorage si présent
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      navigate("/projects"); // Redirection ici
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  // === Fonction register ===
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
      });

      setMessage("✅ Registration successful!");
      setIsRegister(false); // revenir au login
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      console.log("Register response:", res.data);
    } catch (err) {
      console.error("Register error:", err);
      setMessage(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
  <div className={`wrapper ${isRegister ? "active" : ""}`}>
      <span className="bg-animate"></span>
      <span className="bg-animate2"></span>

  {/* === Login Form === */}
      <div className="form-box login">
        <h2 className="animation" style={{ "--i": 0, "--j": 21 }}>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
            <input
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <label>Email</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 2, "--j": 23 }}>
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button
            className="btn animation"
            type="submit"
            style={{ "--i": 3, "--j": 24 }}
          >
            Login
          </button>
          
          <div
            className="logreg-link animation"
            style={{ "--i": 4, "--j": 25 }}
          >
            <p>
              Don't have an account?{" "}
              <span
                className="register-link"
                onClick={() => {
                  setIsRegister(true);
                  setMessage("");
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>

      <div className="info-text login">
        <h2 className="animation" style={{ "--i": 0, "--j": 20 }}>
          Welcome Back!
        </h2>
        <p className="animation" style={{ "--i": 1, "--j": 21 }}>
          Please login to continue.
        </p>
      </div>

      {/* === Registration Form === */}
      <div className="form-box register">
        <h2 className="animation" style={{ "--i": 5, "--j": 0 }}>
          Sign Up
        </h2>
        <form onSubmit={handleRegister}>
          <div className="input-box animation" style={{ "--i": 6, "--j": 1 }}>
            <input
              type="text"
              placeholder="Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />
            <label>Name</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 7, "--j": 2 }}>
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <label>Email</label>
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 8, "--j": 3 }}>
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button
            className="btn animation"
            type="submit"
            style={{ "--i": 9, "--j": 4 }}
          >
            Sign Up
          </button>
          <div
            className="logreg-link animation"
            style={{ "--i": 10, "--j": 5 }}
          >
            <p>
              Already have an account?{" "}
              <span
                className="login-link"
                onClick={() => {
                  setIsRegister(false);
                  setMessage("");
                }}
              >
                Login
              </span>
            </p>
          </div>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>

      <div className="info-text register">
        <h2 className="animation" style={{ "--i": 11, "--j": 6 }}>
          Welcome!
        </h2>
        <p className="animation" style={{ "--i": 12, "--j": 7 }}>
          Please register to create an account.
          
        </p>
      </div>
    </div>
  );
};

export default LoginRegisterForm;

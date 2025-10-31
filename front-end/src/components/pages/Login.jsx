import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    const user = { email, password };
    const response = await axios.post("http://localhost:5000/api/users/login", user);

    console.log("Response:", response.data);

    if (response.data.status && response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("Saved token:", response.data.token);
      navigate("/dashboard");
    } else {
      toast.error(response.data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign In</h2>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className={styles.linkText}>
          Don’t have an account?
          <Link to="/" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

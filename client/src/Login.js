import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import './Registration.css'; // Assuming the CSS is already there

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/Registration/login", formData);
      setMessage("Login successful! 🎉");

      // Navigate to the "Main" page after successful login
      setTimeout(() => {
        navigate("/Main"); // Navigate to the 'Main' route
      }, 1000); // Adding a delay before redirecting for a better user experience

      setFormData({ email: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(
        error.response?.data || "Invalid email or password."
      );
    }
  };

  return (
    <div className="Main-div">
      <form className="form-container" onSubmit={handleSubmit}>
     

        <div className="form-group">
            <div className="login-heading">
                <h2>Log in</h2>
            </div>
            {message && (
          <p className={message.includes("successful") ? "message-success" : "message-error"}>
            {message}
          </p>
        )}
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="form-button">Log In</button>
        <p className="login-text">
        Don't have an account.?{" "}
            <button
              type="button"
              className="login-button"
              onClick={() => navigate("/Registration")}
            >
              Register
            </button>
          </p>
      </form>
    </div>
  );
}

export default Login;

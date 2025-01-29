import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Registration.css";

function Register() {
  const navigate = useNavigate(); // Initialize navigation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

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
      const response = await axios.post(
        "http://localhost:5000/Registration/api/register",
        formData
      );

      setMessage("Registration successful! 🎉 Redirecting to login...");
      setSuccess(true);
      setFormData({ name: "", email: "", password: "" }); // Reset form

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response?.status === 409) {
        setMessage("User already registered. Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login if already registered
        }, 3000);
      } else {
        setMessage(
          error.response?.data || "An error occurred. Please try again later."
        );
      }
      setSuccess(false);
    }
  };

  return (
    <>
    
      <div className="Main-div">
        
        <form className="form-container" onSubmit={handleSubmit}>
         
        <div className="login-heading">
                <h2>Registation</h2>
            </div>
            {message && (
          <p className={message.includes("successful") ? "message-success" : "message-error"}>
            {message}
          </p>
        )}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
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

          <button type="submit" className="form-button">Register</button>

          {/* Already Registered? Log in Button */}
          <p className="login-text">
            Already registered.?{" "}
            <button
              type="button"
              className="login-button"
              onClick={() => navigate("/Login")}
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;

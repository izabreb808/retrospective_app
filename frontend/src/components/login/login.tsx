import { useState } from "react";
import axios, { AxiosError } from "axios";
import "@/loginPage.css";
import { Register } from "../register/register";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/app");
    } catch (error) {
      let errorMsg = "Błąd logowania";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response?.data?.error) {
          errorMsg = axiosError.response.data.error;
        }
      }
      setMessage(errorMsg);
    }
  };

  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  return (
    <div className="login">
      <div className="loginPage">
        <h1>Logowanie</h1>

        <input
          placeholder="Username"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={() => setShowRegisterDialog(true)}>
          Zarejestruj
        </button>

        <button onClick={handleLogin}>Zaloguj</button>

        {message && <p className="error">{message}</p>}
      </div>

      <Register
        open={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
      />
    </div>
  );
};

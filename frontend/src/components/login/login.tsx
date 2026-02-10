import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "@/loginPage.css";
import { Register } from "../register/register";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("loginBody");
    return () => {
      document.body.classList.remove("loginBody");
    };
  }, []);


  const handleLogin = async () => {
    try {
      const res = await axios.post("https://retrospective-app-w474.onrender.com/login", { email, password });
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
          placeholder="Login"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button 
          onClick={handleLogin}
          style={{ background: '#3498db', marginBottom: 10 }}
        >
          Zaloguj
        </button>

        <button 
          onClick={() => setShowRegisterDialog(true)}
          style={{ background: '#95a5a6' }}
        >
          Zarejestruj
        </button>

        {message && <p className="error">{message}</p>}
      </div>

      <Register
        open={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
      />
    </div>
  );
};

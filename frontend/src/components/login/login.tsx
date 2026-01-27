import { useState } from "react";
import axios, { AxiosError } from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      setToken(res.data.token);
      setMessage("Zalogowano pomyślnie!");
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

  return (
    <div>
      <h2>Logowanie</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Zaloguj</button>
      {token && <p>Token JWT: {token}</p>}
      <p>{message}</p>
    </div>
  );
};

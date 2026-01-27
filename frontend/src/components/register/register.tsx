import { useState } from "react";
import axios, { AxiosError } from "axios";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", { email, password });
      setMessage(res.data.message);
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
      <h2>Rejestracja</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Zarejestruj</button>
      <p>{message}</p>
    </div>
  );
};

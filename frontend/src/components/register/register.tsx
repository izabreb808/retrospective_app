import { useState, type SetStateAction } from "react";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";

type RegisterProps = {
  open: boolean;
  onClose: () => void;
};

export const Register = ({ open, onClose }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });

      setMessage(res.data.message);
      setEmail("");
      setPassword("");
    } catch (err) {
      let errorMsg = "Błąd rejestracji";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        if (axiosError.response?.data?.error) {
          errorMsg = axiosError.response.data.error;
        }
      }
      setError(errorMsg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Rejestracja nowego użytkownika</DialogTitle>

      <DialogContent>
        <div className="registerPage">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Hasło"
            type="password"
            value={password}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Zamknij
        </Button>

        <Button
          onClick={handleRegister}
          variant="contained"
          disabled={!email || !password}
        >
          Zarejestruj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

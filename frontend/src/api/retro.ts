import axios from "axios";

const API = "http://localhost:5000";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getRetro = () =>
  axios.get(`${API}/retro`, authHeader());

export const saveRetro = (columns: unknown) =>
  axios.post(`${API}/retro`, { columns }, authHeader());

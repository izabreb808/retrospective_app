import axios from "axios";
import { API_URL } from "../config";

const API = API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTeam = () =>
  axios.get(`${API}/team`, authHeader());

export const addTeamMember = (name: string, role: string, avatar: string) =>
  axios.post(`${API}/team`, { name, role, avatar }, authHeader());

export const deleteTeamMember = (id: string) =>
  axios.delete(`${API}/team/${id}`, authHeader());

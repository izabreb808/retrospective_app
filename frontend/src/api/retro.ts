import axios from "axios";
import { API_URL } from "../config";

const API = API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getRetros = () =>
  axios.get(`${API}/retros`, authHeader());

export const createRetro = (name: string, date: string) =>
  axios.post(`${API}/retros`, { name, date }, authHeader());

export const getRetro = (id: string) =>
  axios.get(`${API}/retros/${id}`, authHeader());

export const saveRetro = (id: string, columns: unknown) =>
  axios.put(`${API}/retros/${id}`, { columns }, authHeader());

export const deleteRetro = (id: string) =>
  axios.delete(`${API}/retros/${id}`, authHeader());

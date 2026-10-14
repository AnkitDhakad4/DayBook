import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../lib/api.js';

const showError = (error, fallback) => toast.error(error.response?.data?.message || fallback);

export const useProjectStore = create((set) => ({
  projects: [], currentProject: null, isLoading: false, error: '',
  fetchProjects: async () => {
    set({ isLoading: true, error: '' });
    try { const response = await api.get('/projects'); set({ projects: response.data.data || [], isLoading: false }); }
    catch (error) { const message = error.response?.data?.message || 'Could not load your projects'; set({ isLoading: false, error: message }); showError(error, message); }
  },
  fetchProject: async (id) => {
    set({ isLoading: true, currentProject: null });
    try { const response = await api.get(`/projects/${id}`); set({ currentProject: response.data.data, isLoading: false }); return response.data.data; }
    catch (error) { set({ isLoading: false }); showError(error, 'Could not load this project'); throw error; }
  },
  createProject: async (project) => {
    try { const response = await api.post('/projects', project); set((state) => ({ projects: [response.data.data, ...state.projects] })); toast.success('Project created'); return response.data.data; }
    catch (error) { showError(error, 'Could not create project'); throw error; }
  },
  updateProject: async (id, updates) => {
    try { const response = await api.patch(`/projects/${id}`, updates); const project = response.data.data; set((state) => ({ projects: state.projects.map((item) => item.id === id ? { ...item, ...project } : item), currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...project } : state.currentProject })); toast.success('Project updated'); return project; }
    catch (error) { showError(error, 'Could not update project'); throw error; }
  },
  deleteProject: async (id) => {
    try { await api.delete(`/projects/${id}`); set((state) => ({ projects: state.projects.filter((project) => project.id !== id), currentProject: state.currentProject?.id === id ? null : state.currentProject })); toast.success('Project deleted'); }
    catch (error) { showError(error, 'Could not delete project'); throw error; }
  }
}));

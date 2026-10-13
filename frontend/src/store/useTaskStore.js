import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../lib/api.js';

const showError = (error, fallback) => toast.error(error.response?.data?.message || fallback);

export const useTaskStore = create((set, get) => ({
  tasks: [], currentTask: null, filters: { status:'', priority:'', search:'', sortBy:'created_at', order:'desc' }, isLoading: false,
  fetchTasks: async () => {
    set({ isLoading:true });
    try { const response = await api.get('/tasks', { params:get().filters }); set({ tasks:response.data.data || [], isLoading:false }); }
    catch (error) { set({ isLoading:false }); showError(error,'Could not load your tasks'); }
  },
  fetchTask: async (id) => {
    set({ isLoading:true, currentTask:null });
    try { const response = await api.get(`/tasks/${id}`); set({ currentTask:response.data.data, isLoading:false }); return response.data.data; }
    catch (error) { set({ isLoading:false }); showError(error,'Could not load this task'); throw error; }
  },
  createTask: async (task) => {
    try { const response=await api.post('/tasks',task); set((state)=>({tasks:[response.data.data,...state.tasks] })); toast.success('Task created'); return response.data.data; }
    catch (error) { showError(error,'Could not create task'); throw error; }
  },
  updateTask: async (id, updates) => {
    try { const response=await api.patch(`/tasks/${id}`,updates); const task=response.data.data; set((state)=>({tasks:state.tasks.map((item)=>item.id===id?task:item),currentTask:state.currentTask?.id===id?task:state.currentTask})); toast.success('Changes saved'); return task; }
    catch (error) { showError(error,'Could not update task'); throw error; }
  },
  deleteTask: async (id) => {
    try { await api.delete(`/tasks/${id}`); set((state)=>({tasks:state.tasks.filter((task)=>task.id!==id),currentTask:state.currentTask?.id===id?null:state.currentTask})); toast.success('Task deleted'); }
    catch (error) { showError(error,'Could not delete task'); throw error; }
  },
  addSubtask: async (taskId,title) => {
    try { const response=await api.post(`/tasks/${taskId}/subtasks`,{title}); await get().fetchTask(taskId); toast.success('Step added'); return response.data.data; }
    catch (error) { showError(error,'Could not add step'); throw error; }
  },
  toggleSubtask: async (taskId,subtaskId,is_completed) => {
    try { await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`,{is_completed}); await get().fetchTask(taskId); }
    catch (error) { showError(error,'Could not update step'); throw error; }
  },
  deleteSubtask: async (taskId,subtaskId) => {
    try { await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`); await get().fetchTask(taskId); toast.success('Step removed'); }
    catch (error) { showError(error,'Could not remove step'); throw error; }
  },
  setFilters: (updates) => set((state)=>({filters:{...state.filters,...updates}})),
  moveTask: async (taskId,newStatus) => {
    const previousTasks=get().tasks;
    set((state)=>({tasks:state.tasks.map((task)=>task.id===taskId?{...task,status:newStatus,progress:newStatus==='done'?100:task.progress}:task)}));
    try { const response=await api.patch(`/tasks/${taskId}`,{status:newStatus}); const updated=response.data.data; set((state)=>({tasks:state.tasks.map((task)=>task.id===taskId?updated:task)})); }
    catch (error) { set({tasks:previousTasks}); showError(error,'Could not move task'); }
  }
}));

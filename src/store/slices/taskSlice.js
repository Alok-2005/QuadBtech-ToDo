import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Utility function to update localStorage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initial state for the task slice
const initialState = {
  tasks: JSON.parse(localStorage.getItem("tasks") || "[]"), // Load tasks from localStorage
  lists: JSON.parse(localStorage.getItem("lists") || "[]"), // Load lists from localStorage
  selectedTask: null,
  activeTab: "all", // Options: 'all', 'today', 'important', 'planned', 'assigned'
  view: "list", // Options: 'list', 'grid'
  theme: "light", // Options: 'light', 'dark'
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: uuidv4(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      saveToLocalStorage("tasks", state.tasks);
    },

    // Toggle a task's completion status
    toggleTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Update an existing task
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Delete a task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveToLocalStorage("tasks", state.tasks);
      if (state.selectedTask === action.payload) {
        state.selectedTask = null;
      }
    },

    // Select a task
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },

    // Set active tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Toggle between 'list' and 'grid' views
    toggleView: (state) => {
      state.view = state.view === 'list' ? 'grid' : 'list';
    },

    // Toggle between 'light' and 'dark' themes
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },

    // Add a step to a task
    addTaskStep: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        if (!task.steps) task.steps = [];
        task.steps.push(action.payload.step);
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Toggle a step's completion status
    toggleTaskStep: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task?.steps) {
        const step = task.steps.find(s => s.id === action.payload.stepId);
        if (step) {
          step.completed = !step.completed;
          saveToLocalStorage("tasks", state.tasks);
        }
      }
    },

    // Set a task's due date
    setTaskDueDate: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.dueDate = action.payload.dueDate;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Set a task's reminder
    setTaskReminder: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.reminder = action.payload.reminder;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Set a task's repeat frequency
    setTaskRepeat: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.repeat = action.payload.repeat;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Update task notes
    updateTaskNotes: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.notes = action.payload.notes;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Update task tags
    updateTaskTags: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.tags = action.payload.tags;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Update task priority
    updateTaskPriority: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // Create a repeated task
    createRepeatedTask: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task && task.repeat !== 'never') {
        const newTask = { 
          ...task, 
          id: uuidv4(), 
          createdAt: new Date().toISOString(),
          completed: false 
        };

        // Reset steps
        if (newTask.steps) {
          newTask.steps = newTask.steps.map(step => ({ 
            ...step, 
            completed: false,
            id: uuidv4() // Unique step IDs
          }));
        }

        // Adjust due date
        if (newTask.dueDate) {
          const dueDate = new Date(newTask.dueDate);
          switch (task.repeat) {
            case 'daily':
              dueDate.setDate(dueDate.getDate() + 1);
              break;
            case 'weekly':
              dueDate.setDate(dueDate.getDate() + 7);
              break;
            case 'monthly':
              dueDate.setMonth(dueDate.getMonth() + 1);
              break;
            default:
              break;
          }
          newTask.dueDate = dueDate.toISOString();
        }

        state.tasks.push(newTask);
        saveToLocalStorage("tasks", state.tasks);
      }
    },

    // List-related reducers
    addList: (state, action) => {
      state.lists.push(action.payload);
      saveToLocalStorage("lists", state.lists);
    },
    updateList: (state, action) => {
      const index = state.lists.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = { ...state.lists[index], ...action.payload };
        saveToLocalStorage("lists", state.lists);
      }
    },
    deleteList: (state, action) => {
      state.lists = state.lists.filter(l => l.id !== action.payload);
      saveToLocalStorage("lists", state.lists);
    },
    addTaskToList: (state, action) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list && !list.tasks.includes(action.payload.taskId)) {
        list.tasks.push(action.payload.taskId);
        saveToLocalStorage("lists", state.lists);
      }
    },
    removeTaskFromList: (state, action) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.tasks = list.tasks.filter(id => id !== action.payload.taskId);
        saveToLocalStorage("lists", state.lists);
      }
    },
  },
});

// Export actions and reducer
export const {
  addTask,
  toggleTask,
  updateTask,
  deleteTask,
  selectTask,
  setActiveTab,
  toggleView,
  toggleTheme,
  addTaskStep,
  toggleTaskStep,
  setTaskDueDate,
  setTaskReminder,
  setTaskRepeat,
  updateTaskNotes,
  updateTaskTags,
  updateTaskPriority,
  createRepeatedTask,
  addList,
  updateList,
  deleteList,
  addTaskToList,
  removeTaskFromList,
} = taskSlice.actions;

export default taskSlice.reducer;

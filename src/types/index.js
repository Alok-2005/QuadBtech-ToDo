// Task structure
// Represents a single task in the app
const Task = {
  id: "", // Unique identifier
  title: "", // Task title
  completed: false, // Task completion status
  priority: "low", // Priority: 'low' | 'medium' | 'high'
  dueDate: undefined, // Optional: Due date (ISO string format)
  reminder: undefined, // Optional: Reminder date/time (ISO string format)
  repeat: "none", // Repeat frequency: 'daily' | 'weekly' | 'monthly' | 'none'
  notes: undefined, // Optional: Additional notes
  steps: [], // Optional: Steps associated with the task
  createdAt: "", // Task creation timestamp (ISO string format)
  isOutdoor: undefined, // Optional: Whether the task is for outdoor activities
};

// User structure
// Represents a user in the app
const User = {
  id: "", // Unique user ID
  name: "", // User's name
  email: "", // User's email
  avatar: "", // URL for user's avatar
};

// Auth state structure
// Represents the authentication state of the app
const AuthState = {
  user: null, // Currently logged-in user (null if not authenticated)
  isAuthenticated: false, // Whether the user is authenticated
  loading: false, // Loading state
  error: null, // Authentication error message
};

// Task list structure
// Represents a list containing multiple tasks
const TaskList = {
  id: "", // Unique identifier for the task list
  title: "", // Title of the list
  tasks: [], // Array of task IDs belonging to this list
};

// Task state structure
// Represents the overall task state in the app
const TaskState = {
  tasks: [], // Array of tasks
  selectedTask: null, // ID of the currently selected task
  loading: false, // Loading state
  error: null, // Error message related to task operations
  view: "list", // Current view: 'list' | 'grid'
  theme: "light", // Current theme: 'light' | 'dark'
  activeTab: "", // Currently active tab
  lists: [], // Array of task lists
};

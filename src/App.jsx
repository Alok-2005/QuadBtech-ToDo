import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Auth from "./components/Auth";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Sidebar from "./components/Sidebar";
import TaskDetails from "./components/TaskDetails";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Search, Grid, Moon, Sun } from "lucide-react";
import { logout } from "./store/slices/authSlice";
import { toggleView, toggleTheme } from "./store/slices/taskSlice";
import { Toaster } from "react-hot-toast";
import Confetti from "react-confetti";

const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { tasks, theme, view } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const completedTasks = tasks.filter((task) => task.completed);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
        <Toaster position="top-right" />
        {completedTasks.length > 0 && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={500}
            recycle={false}
            colors={["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"]}
          />
        )}
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b px-4 py-3 lg:px-6 lg:py-4 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <Layout className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                <h1 className="text-xl lg:text-2xl font-bold">Do It</h1>
              </div>
              <div className="flex items-center gap-4 lg:gap-6">
                <button
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                  onClick={() => dispatch(toggleTheme())}
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <Search className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                <Grid
                  className={`w-5 h-5 cursor-pointer ${
                    view === "grid" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => dispatch(toggleView())}
                />
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <img
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary"
                    />
                    <div className="absolute right-0 mt-2 w-40 lg:w-48 py-2 bg-popover rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium">Hey, {user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                      <div className="border-t my-2" />
                      <button
                        onClick={() => dispatch(logout())}
                        className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col lg:flex-row">
            <div className="flex-1 p-4 lg:p-6">
              <TaskInput />
              <TaskList />
            </div>
            <TaskDetails />
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

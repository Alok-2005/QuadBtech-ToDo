import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../store/slices/taskSlice";
import { Bell, RotateCcw, Calendar, Plus, Star, CloudSun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWeatherForLocation} from "../services/weatherService"
import toast from "react-hot-toast";

const TaskInput = () => {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("indoor");
  const [showReminder, setShowReminder] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [reminderTime, setReminderTime] = useState("");
  const [repeatOption, setRepeatOption] = useState("none");
  const [dueDate, setDueDate] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.tasks.theme);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title", {
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
          color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
        },
      });
      return;
    }

    try {
      if (taskType === "outdoor") {
        const weatherData = await getWeatherForLocation("India");
        if (!weatherData.isGoodTime) {
          toast(
            (t) => (
              <div className="flex items-center gap-3">
                <CloudSun className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Weather Alert</p>
                  <p className="text-sm">
                    Current conditions: {weatherData.temperature}°C, {weatherData.condition}
                  </p>
                  <div className="mt-2">
                    <button
                      className="mr-2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                      onClick={() => {
                        createTask();
                        toast.dismiss(t.id);
                      }}
                    >
                      Create Anyway
                    </button>
                    <button
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ),
            {
              duration: 6000,
              style: {
                borderRadius: "10px",
                background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
                color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
              },
            }
          );
          return;
        }
      }

      createTask();
    } catch (error) {
      toast.error("Failed to add task. Please try again.", {
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
          color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
        },
      });
    }
  };

  const createTask = () => {
    const now = new Date();
    const task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      priority,
      createdAt: now.toISOString(),
      reminder: reminderTime
        ? new Date(
            now.setHours(Number.parseInt(reminderTime.split(":")[0]), Number.parseInt(reminderTime.split(":")[1]))
          ).toISOString()
        : undefined,
      repeat: repeatOption,
      dueDate: dueDate || undefined,
      isOutdoor: taskType === "outdoor",
    };

    dispatch(addTask(task));
    toast.success("✨ Task added successfully!", {
      icon: "🎯",
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
        color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
      },
    });

    // Reset form
    setTitle("");
    setReminderTime("");
    setRepeatOption("none");
    setDueDate("");
    setShowReminder(false);
    setShowRepeat(false);
    setShowDueDate(false);
    setPriority("medium");
    setTaskType("indoor");
  };

  const priorityColors = {
    low: "text-blue-500 dark:text-blue-400",
    medium: "text-yellow-500 dark:text-yellow-400",
    high: "text-red-500 dark:text-red-400",
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">To Do ▼</h2>
      <form onSubmit={handleSubmit} className="bg-card dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPriority((prev) => {
                  switch (prev) {
                    case "low":
                      return "medium";
                    case "medium":
                      return "high";
                    case "high":
                      return "low";
                  }
                });
              }}
              className={`${priorityColors[priority]}`}
            >
              <Star className="w-5 h-5" />
            </motion.button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add A Task"
              className="flex-1 outline-none bg-transparent text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="p-1 border rounded bg-background dark:bg-gray-600 text-foreground dark:text-white border-input dark:border-gray-500"
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReminder(!showReminder)}
              className={`${showReminder ? "text-primary dark:text-primary-400" : "text-muted-foreground dark:text-gray-400"} hover:text-primary dark:hover:text-primary-300`}
            >
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRepeat(!showRepeat)}
              className={`${showRepeat ? "text-primary dark:text-primary-400" : "text-muted-foreground dark:text-gray-400"} hover:text-primary dark:hover:text-primary-300`}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDueDate(!showDueDate)}
              className={`${showDueDate ? "text-primary dark:text-primary-400" : "text-muted-foreground dark:text-gray-400"} hover:text-primary dark:hover:text-primary-300`}
            >
              <Calendar className="w-5 h-5" />
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary dark:bg-primary-600 text-primary-foreground dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 dark:hover:bg-primary-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              ADD TASK
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {(showReminder || showRepeat || showDueDate) && (
            <motion.div
              className="mt-4 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {showReminder && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 bg-accent dark:bg-gray-700 p-2 rounded"
                >
                  <Bell className="w-4 h-4 text-accent-foreground dark:text-gray-300" />
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="p-1 border rounded bg-background dark:bg-gray-600 text-foreground dark:text-white border-input dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
                    />
                    <button
                      onClick={() => {
                        /* Set reminder logic */
                      }}
                      className="px-2 py-1 bg-primary dark:bg-primary-600 text-primary-foreground dark:text-white rounded text-sm"
                    >
                      Set
                    </button>
                  </div>
                </motion.div>
              )}
              {showRepeat && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 bg-accent dark:bg-gray-700 p-2 rounded"
                >
                  <RotateCcw className="w-4 h-4 text-accent-foreground dark:text-gray-300" />
                  <select
                    value={repeatOption}
                    onChange={(e) => setRepeatOption(e.target.value)}
                    className="p-1 border rounded bg-background dark:bg-gray-600 text-foreground dark:text-white border-input dark:border-gray-500"
                  >
                    <option value="none">No repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </motion.div>
              )}
              {showDueDate && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 bg-accent dark:bg-gray-700 p-2 rounded"
                >
                  <Calendar className="w-4 h-4 text-accent-foreground dark:text-gray-300" />
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="p-1 border rounded bg-background dark:bg-gray-600 text-foreground dark:text-white border-input dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default TaskInput;

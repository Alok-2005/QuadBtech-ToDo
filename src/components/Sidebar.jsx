import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ListTodo, Calendar, Star, Users, Plus, Search, X, Clock, CheckCircle } from "lucide-react";
import { setActiveTab, addList } from "../store/slices/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart } from "react-minimal-pie-chart";
import AddListButton from "./AddListButton";

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tasks.activeTab);
  const tasks = useSelector((state) => state.tasks.tasks);
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.tasks.theme);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

  const plannedTasks = tasks.filter((task) => task.dueDate); // Tasks with a due date
  const completedTasks = tasks.filter((task) => task.completed); // Overall completed tasks
  const pendingTasks = todayTasks.filter((task) => !task.completed); // Today's pending tasks
  const completionPercentage = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  const handleAddList = () => {
    if (newListTitle.trim()) {
      dispatch(
        addList({
          id: `list-${Date.now()}`,
          title: newListTitle.trim(),
          tasks: [],
        })
      );
      setNewListTitle("");
      setShowAddList(false);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col h-screen max-h-screen overflow-y-auto md:w-80 lg:w-96">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={
            user?.avatar ||
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XDove6OIK74ky7aGB9LzoIWf2hliaa.png"
          }
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hey,</p>
          <p className="font-medium text-gray-900 dark:text-white">{user?.name || "ABCD"}</p>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="space-y-2">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
        <button
          onClick={() => dispatch(setActiveTab("all"))}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
            activeTab === "all"
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span>All Tasks</span>
        </button>
        <button
          onClick={() => dispatch(setActiveTab("today"))}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
            activeTab === "today"
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Today</span>
        </button>
        <button
          onClick={() => dispatch(setActiveTab("important"))}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
            activeTab === "important"
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Star className="w-5 h-5" />
          <span>Important</span>
        </button>
        <button
          onClick={() => dispatch(setActiveTab("assigned"))}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
            activeTab === "assigned"
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Assigned to me</span>
        </button>
        <button
          onClick={() => dispatch(setActiveTab("planned"))}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
            activeTab === "planned"
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Planned</span>
        </button>
      </nav>

      {/* Add List Button */}
      <AddListButton />

      {/* Add List Dialog */}
      <AnimatePresence>
        {showAddList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Create new list</h3>
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List name"
                className="w-full px-3 py-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddList(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddList}
                  className="px-4 py-2 bg-primary dark:bg-primary-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-primary-500"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Section */}
      <div className="mt-auto">
        {/* Today's Tasks */}
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Today's Tasks</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayTasks.length}</p>
        </div>

        {/* Overall Progress Bar */}
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1">
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                className="h-full bg-green-500 dark:bg-green-400"
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Pending ({pendingTasks.length})</span>
              <span>Done ({completedTasks.length})</span>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="w-24 h-24 relative">
            <PieChart
              data={[{ value: completedTasks.length, color: theme === "dark" ? "#4ADE80" : "#22C55E" }, 
                     { value: pendingTasks.length, color: theme === "dark" ? "#374151" : "#DCF7E3" }]}
              lineWidth={20}
              rounded
              animate
              reveal={completionPercentage}
              background={theme === "dark" ? "#1F2937" : "#F3F4F6"}
              label={({ dataEntry }) => dataEntry.value > 0 ? `${Math.round(dataEntry.percentage)}%` : ""}
              labelStyle={{
                fontSize: "10px",
                fontFamily: "sans-serif",
                fill: theme === "dark" ? "#E5E7EB" : "#374151",
              }}
              labelPosition={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

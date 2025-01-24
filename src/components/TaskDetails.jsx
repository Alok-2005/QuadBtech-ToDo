import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Bell, Calendar, RotateCcw, X, Trash2, Clock, Tag, CheckSquare, CloudSun, MessageSquare, XCircle } from "lucide-react";
import {
  addTaskStep,
  toggleTaskStep,
  setTaskDueDate,
  setTaskReminder,
  setTaskRepeat,
  updateTaskNotes,
  deleteTask,
  selectTask,
  updateTaskTags,
  updateTaskPriority,
} from "../store/slices/taskSlice";
import { motion, AnimatePresence } from "framer-motion";
import { getWeatherForLocation } from "../services/weatherService";

const TaskDetails = () => {
  const dispatch = useDispatch();
  const selectedTaskId = useSelector((state) => state.tasks.selectedTask);
  const task = useSelector((state) => state.tasks.tasks.find((t) => t.id === selectedTaskId));
  const [newStep, setNewStep] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [notes, setNotes] = useState(task?.notes || "");
  const theme = useSelector((state) => state.tasks.theme);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (task?.isOutdoor) {
      getWeatherForLocation("India").then((data) => setWeatherData(data));
    }
  }, [task?.isOutdoor]);

  useEffect(() => {
    if (task?.reminder && Notification.permission === "granted") {
      const reminderTime = new Date(task.reminder).getTime();
      const now = new Date().getTime();

      if (reminderTime > now) {
        const timeout = setTimeout(() => {
          new Notification("Task Reminder", {
            body: task.title,
            icon: "/favicon.ico",
          });
        }, reminderTime - now);

        return () => clearTimeout(timeout);
      }
    }
  }, [task?.reminder]);

  if (!task) return null;

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    dispatch(
      addTaskStep({
        taskId: task.id,
        step: {
          id: Date.now().toString(),
          title: newStep.trim(),
          completed: false,
        },
      })
    );
    setNewStep("");
  };

  const handleSetDueDate = (date) => {
    dispatch(setTaskDueDate({ taskId: task.id, dueDate: date }));
    setShowDatePicker(false);
  };

  const handleSetReminder = () => {
    if (!reminderTime) return;

    const reminderDate = new Date();
    const [hours, minutes] = reminderTime.split(":");
    reminderDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0);

    if (reminderDate.getTime() < Date.now()) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    dispatch(
      setTaskReminder({
        taskId: task.id,
        reminder: reminderDate.toISOString(),
      })
    );

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    setShowReminderPicker(false);
    setReminderTime("");
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      const updatedTags = [...(task.tags || []), newTag.trim()];
      dispatch(updateTaskTags({ taskId: task.id, tags: updatedTags }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = (task.tags || []).filter(tag => tag !== tagToRemove);
    dispatch(updateTaskTags({ taskId: task.id, tags: updatedTags }));
  };

  const handleSaveNotes = () => {
    dispatch(updateTaskNotes({ taskId: task.id, notes }));
  };


  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    dispatch(selectTask(null));
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full sm:w-80 bg-card dark:bg-gray-800 border-l border-border dark:border-gray-700 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-card-foreground dark:text-white">{task.title}</h3>
        <button onClick={() => dispatch(selectTask(null))}>
          <X className="w-5 h-5 text-muted-foreground dark:text-gray-400 hover:text-card-foreground dark:hover:text-white" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Weather Information */}
        {task.isOutdoor && weatherData && (
          <div className="flex items-center gap-2 bg-accent dark:bg-gray-700 p-2 rounded">
            <CloudSun className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">Current Weather</p>
              <p className="text-sm">
                {weatherData.temperature}°C, {weatherData.condition}
              </p>
            </div>
          </div>
        )}

        {/* Priority */}
        <div className="relative">
          <button
            onClick={() => setShowPriorityPicker(!showPriorityPicker)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${priorityColors[task.priority]} w-full`}
          >
            <Tag className="w-4 h-4" />
            <span className="capitalize">{task.priority} Priority</span>
          </button>

          <AnimatePresence>
            {showPriorityPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 w-full bg-popover dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 p-2 z-10"
              >
                {["low", "medium", "high"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      dispatch(updateTaskPriority({ id: task.id, priority }));
                      setShowPriorityPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg ${priorityColors[priority]} mb-1 last:mb-0`}
                  >
                    <span className="capitalize">{priority}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-primary dark:text-primary-400" />
            <span className="font-medium text-card-foreground dark:text-white">Steps</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddStep()}
              placeholder="Add Step"
              className="flex-1 bg-transparent outline-none text-card-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-500"
            />
          </div>
          {task.steps?.map((step) => (
            <motion.div
              key={step.id}
              className="flex items-center gap-2 ml-6 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => dispatch(toggleTaskStep({ taskId: task.id, stepId: step.id }))}
                className="w-4 h-4 rounded-sm border-2 border-primary dark:border-primary-400 appearance-none cursor-pointer checked:bg-primary dark:checked:bg-primary-400 checked:border-primary dark:checked:border-primary-400"
              />
              <span
                className={step.completed ? "line-through text-muted-foreground dark:text-gray-500" : "text-card-foreground dark:text-white"}
              >
                {step.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Reminder */}
        <div className="relative">
          <button
            onClick={() => setShowReminderPicker(!showReminderPicker)}
            className="flex items-center gap-2 text-card-foreground dark:text-white hover:text-primary dark:hover:text-primary-400 w-full"
          >
            <Bell className="w-4 h-4" />
            <span>Set Reminder</span>
            {task.reminder && (
              <span className="ml-auto text-sm text-muted-foreground dark:text-gray-400">
                {new Date(task.reminder).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showReminderPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 w-full bg-popover dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 p-4 z-10"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded bg-background dark:bg-gray-600 text-foreground dark:text-white border-input dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
                  />
                  <button
                    onClick={handleSetReminder}
                    className="px-3 py-1 bg-primary dark:bg-primary-600 text-primary-foreground dark:text-white rounded-lg text-sm"
                  >
                    Set
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Due Date */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 text-card-foreground dark:text-white hover:text-primary dark:hover:text-primary-400 w-full"
          >
            <Calendar className="w-4 h-4" />
            <span>Add Due Date</span>
            {task.dueDate && (
              <span className="ml-auto text-sm text-muted-foreground dark:text-gray-400">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 w-full bg-popover dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 p-4 z-10"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
                  <input
                    type="date"
                    value={task.dueDate || ""}
                    onChange={(e) => handleSetDueDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1 px-2 py-1 border rounded bg-background dark:bg-gray-600 text-foreground dark:text-white border-input dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Repeat */}
        {/* Repeat */}
<div className="relative">
  <button
    onClick={() => setShowRepeatOptions(!showRepeatOptions)}
    className="flex items-center justify-between gap-2 text-card-foreground dark:text-white hover:text-primary dark:hover:text-primary-400 w-full"
  >
    <span className="flex items-center gap-2">
      <RotateCcw className="w-4 h-4" />
      <span>Repeat</span>
    </span>
    {task.repeat && (
      <span className="text-sm text-muted-foreground dark:text-gray-400">
        {task.repeat.charAt(0).toUpperCase() + task.repeat.slice(1)} {/* Capitalize */}
      </span>
    )}
  </button>

  <AnimatePresence>
    {showRepeatOptions && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 mt-2 w-full bg-popover dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 p-3 z-10"
      >
        <div className="grid grid-cols-2 gap-3">
          {["daily", "weekly", "monthly", "never"].map((repeatOption) => (
            <button
              key={repeatOption}
              onClick={() => {
                dispatch(setTaskRepeat({ taskId: task.id, repeat: repeatOption }));
                setShowRepeatOptions(false);
              }}
              className="flex items-center justify-center px-3 py-2 rounded-lg text-card-foreground dark:text-white hover:bg-accent hover:dark:bg-gray-600 border border-transparent hover:border-primary dark:hover:border-primary-400 transition-colors"
            >
              {repeatOption.charAt(0).toUpperCase() + repeatOption.slice(1)} {/* Capitalize */}
            </button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>


        
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-primary dark:text-primary-400" />
          <span className="font-medium text-card-foreground dark:text-white">Tags</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-4 h-4 text-muted-foreground dark:text-gray-400" />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleAddTag}
            placeholder="Add Tag"
            className="flex-1 bg-transparent outline-none text-card-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-500"
          />
        </div>
        {task.tags && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <div 
                key={tag} 
                className="flex items-center gap-1 bg-accent dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
              >
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>
                  <XCircle className="w-4 h-4 text-muted-foreground dark:text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>


      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-primary dark:text-primary-400" />
          <span className="font-medium text-card-foreground dark:text-white">Notes</span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes for this task"
          className="w-full min-h-[100px] bg-accent dark:bg-gray-700 rounded-lg p-3 text-card-foreground dark:text-white outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
        />
        {notes !== (task?.notes || "") && (
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleSaveNotes}
              className="px-3 py-1 bg-primary dark:bg-primary-600 text-primary-foreground dark:text-white rounded-lg text-sm"
            >
              Save Notes
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
};

export default TaskDetails;

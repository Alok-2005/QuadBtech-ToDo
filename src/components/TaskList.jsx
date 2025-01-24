import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTask, updateTaskPriority, updateTask, selectTask } from "../store/slices/taskSlice";
import { Star, CloudSun, CheckCircle2, ClipboardList, Edit2, Save, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const view = useSelector((state) => state.tasks.view);
  const activeTab = useSelector((state) => state.tasks.activeTab);
  const theme = useSelector((state) => state.tasks.theme);
  const dispatch = useDispatch();

  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const filterTasks = () => {
    switch (activeTab) {
      case "all":
        return tasks;
      case "today":
        const today = new Date().toDateString();
        return tasks.filter((task) => new Date(task.createdAt).toDateString() === today);
      case "important":
        return tasks.filter((task) => task.priority === "high");
      case "assigned":
        return tasks.filter((task) => task.assignedTo);
      case "planned":
        return tasks.filter((task) => task.dueDate);
      default:
        return tasks;
    }
  };

  const filteredTasks = filterTasks();

  const groupedTasks = {
    Today: filteredTasks.filter((task) => {
      const taskDate = new Date(task.createdAt).toDateString();
      const today = new Date().toDateString();
      return taskDate === today && !task.completed;
    }),
    Upcoming: filteredTasks.filter((task) => task.dueDate && !task.completed),
    Completed: filteredTasks.filter((task) => task.completed),
  };

  const handleTaskCompletion = (task) => {
    dispatch(toggleTask(task.id));
    if (!task.completed) {
      toast.success(`Task "${task.title}" marked as completed!`);
    }
  };

  const handleTaskPriorityChange = (task) => {
    dispatch(
      updateTaskPriority({
        id: task.id,
        priority: task.priority === "high" ? "medium" : "high",
      })
    );
    toast.success(`Priority updated for "${task.title}"`);
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditedTitle(task.title);
  };

  const handleSaveClick = (task) => {
    if (editedTitle.trim() === "") {
      toast.error("Task title cannot be empty!");
      return;
    }

    dispatch(
      updateTask({
        id: task.id,
        title: editedTitle,
      })
    );
    setEditTaskId(null);
    toast.success(`Task "${editedTitle}" updated!`);
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditedTitle("");
  };

  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <>
      {completedTasks.length > 0 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
          colors={["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"]}
        />
      )}
      <div className="space-y-6">
        {/* Grouping Tasks */}
        {["Today", "Upcoming", "Completed"].map((group) => {
          let groupTasks = [];

          // Use the groupedTasks object to select the tasks for each section
          if (group === "Today") {
            groupTasks = groupedTasks.Today;
          } else if (group === "Upcoming") {
            groupTasks = groupedTasks.Upcoming;
          } else {
            groupTasks = groupedTasks.Completed;
          }

          if (!groupTasks.length) return null;

          return (
            
            <div key={group}>
              <h3 className="text-lg font-semibold text-muted-foreground dark:text-gray-400">{group}</h3>
              <div
                className={`${
                  view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"
                }`}
              >
                {groupTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex flex-col bg-card dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      task.completed ? "opacity-60" : ""
                    }`}
                    role="button"
                    aria-label={`Task: ${task.title}`}
                    onClick={() => {
                      if (editTaskId !== task.id) {
                        dispatch(selectTask(task.id));
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {/* Task Checkbox */}
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskCompletion(task)}
                            className="w-5 h-5 rounded-sm border-2 border-primary dark:border-primary-400 appearance-none cursor-pointer"
                          />
                          {task.completed && (
                            <div className="absolute inset-0 flex items-center justify-center text-primary dark:text-primary-400">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Task Details or Edit Input */}
                        {editTaskId === task.id ? (
                          <div className="flex flex-1">
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="flex-1 px-2 py-1 border rounded-md dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span
                              className={`${
                                task.completed
                                  ? "line-through text-muted-foreground dark:text-gray-500"
                                  : "text-card-foreground dark:text-white"
                              }`}
                            >
                              {task.title}
                              {task.isOutdoor && (
                                <span className="ml-2 inline-flex items-center">
                                  <CloudSun className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                                </span>
                              )}
                            </span>
                            {task.dueDate && (
                              <span className="text-xs text-muted-foreground dark:text-gray-400">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Task Priority */}
                      <div className="flex items-center gap-3">
                        <Star
                          className={`w-5 h-5 cursor-pointer ${
                            task.priority === "high"
                              ? "text-yellow-500 dark:text-yellow-400 fill-current"
                              : "text-muted-foreground dark:text-gray-400"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskPriorityChange(task);
                          }}
                        />
                      </div>
                    </div>

                    {/* Edit/Save/Cancel Actions */}
                    {editTaskId === task.id ? (
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveClick(task);
                          }}
                          className="px-2 py-1 bg-green-500 text-white rounded-md"
                        >
                          <Save className="w-4 h-4 inline-block mr-1" />
                          Save
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEdit();
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded-md"
                        >
                          <XCircle className="w-4 h-4 inline-block mr-1" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end items-center mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(task);
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* No Tasks Fallback */}
        {!tasks.length && (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <ClipboardList className="w-12 h-12 text-muted-foreground dark:text-gray-500" />
            <p className="text-muted-foreground dark:text-gray-400">
              No tasks found. Add some tasks to get started!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskList;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addList, deleteList } from "../store/slices/taskSlice"; // Import deleteList action
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

const AddListButton = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.tasks.theme);
  const existingLists = useSelector((state) => state.tasks.lists);
  
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = () => {
    const trimmedTitle = newListTitle.trim();
    
    // Validation
    if (!trimmedTitle) {
      toast.error("List name cannot be empty", {
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
          color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
        },
      });
      return;
    }

    // Check for duplicate list names
    const isDuplicate = existingLists.some(list => list.title.toLowerCase() === trimmedTitle.toLowerCase());
    
    if (isDuplicate) {
      toast.error("A list with this name already exists", {
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
          color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
        },
      });
      return;
    }

    // Add list
    dispatch(
      addList({
        id: `list-${Date.now()}`,
        title: trimmedTitle,
        tasks: [],
      })
    );

    // Reset and close dialog
    setNewListTitle("");
    setShowAddList(false);

    // Success toast
    toast.success("List created successfully!", {
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
        color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
      },
    });
  };

  const handleDeleteList = (listId) => {
    dispatch(deleteList(listId)); // Dispatch delete action
    toast.success("List deleted successfully!", {
      style: {
        borderRadius: "10px",
        background: theme === "dark" ? "hsl(var(--popover))" : "hsl(var(--background))",
        color: theme === "dark" ? "hsl(var(--popover-foreground))" : "hsl(var(--foreground))",
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setShowAddList(true)}
        className="mt-4 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-yellow-400 dark:border-yellow-500 sm:w-auto"
      >
        <Plus className="w-5 h-5" />
        <span>Add list</span>
      </button>

      <AnimatePresence>
        {showAddList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 sm:w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create new list</h3>
                <button 
                  onClick={() => setShowAddList(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                placeholder="List name"
                className="w-full px-3 py-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-400"
                autoFocus
                maxLength={30}
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

      {/* Render existing lists with delete option */}
      {existingLists.map((list) => (
        <div key={list.id} className="flex justify-between items-center mt-2">
          <span>{list.title}</span>
          <button onClick={() => handleDeleteList(list.id)} className="text-red-500 hover:text-red-700">
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

export default AddListButton;

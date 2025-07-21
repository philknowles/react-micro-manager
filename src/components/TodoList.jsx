import React, { useState, useEffect } from "react";
import "./TodoList.css";
import TodoItem from "./TodoItem/TodoItem";
import { FaPlus } from 'react-icons/fa';

const TodoList = () => {
    // All state definitions and functions (useState, useEffect, addItem, etc.)
    // remain exactly the same as in the previous "card-based" example.
    // I am omitting them here for brevity, but you should keep them.

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDate();
    const currentDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const startingData = [
        { id: Date.now() + 1, description: "Review project proposal", category: "Client Work", today: "2025-07-21", timeSpent: 1.5, stage: 'Review', due: "2025-07-25", completed: false },
        { id: Date.now() + 2, description: "Daily Stand-up Meeting", category: "Team Sync", today: "2025-07-21", timeSpent: 0.5, stage: 'Admin', due: "2025-07-21", completed: false },
        { id: Date.now() + 3, description: "Develop new feature", category: "Development", today: "2025-07-20", timeSpent: 4, stage: 'In Progress', due: "2025-07-28", completed: false },
        { id: Date.now() + 4, description: "Personal development course", category: "Learning", today: "2025-07-20", timeSpent: 1, stage: 'Learning', due: "2025-08-01", completed: false }
    ];

    const [currentItems, setCurrentItems] = useState(() => {
        const storedItems = localStorage.getItem("todoItems");
        return storedItems ? JSON.parse(storedItems) : startingData;
    });

    const [newItemTitle, setNewItemTitle] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [newToday, setNewToday] = useState(currentDate);
    const [timeSpent, setTimeSpent] = useState("");
    const [isStage, setIsStage] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [editItemId, setEditItemId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editToday, setEditToday] = useState("");
    const [editTimeSpent, setEditTimeSpent] = useState("");
    const [editStage, setEditStage] = useState("");
    const [editDueDate, setEditDueDate] = useState("");

    useEffect(() => {
        localStorage.setItem("todoItems", JSON.stringify(currentItems));
    }, [currentItems]);

    function addItem(newItem) {
        setCurrentItems(currentItems => [...currentItems, newItem].sort((a, b) => new Date(b.today) - new Date(a.today)));
    }
    
    function deleteItem(itemToDelete) {
        setCurrentItems(currentItems.filter((item) => item.id !== itemToDelete));
    }
    
    function startEditing(item) {
        setEditItemId(item.id);
        setEditTitle(item.description);
        setEditCategory(item.category);
        setEditToday(item.today);
        setEditTimeSpent(item.timeSpent);
        setEditStage(item.stage);
        setEditDueDate(item.due);
    }
    
    function saveEdit(itemId) {
        setCurrentItems(currentItems.map(item => item.id === itemId ? {
            ...item,
            description: editTitle,
            category: editCategory,
            today: editToday,
            timeSpent: editTimeSpent,
            stage: editStage,
            due: editDueDate
        } : item));
        cancelEditing();
    }
    
    function cancelEditing() {
        setEditItemId(null);
    }
    
    function toggleCompleted(itemId) {
        const updatedItems = currentItems.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        setCurrentItems(updatedItems);
    }

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('en-CA'); // YYYY-MM-DD format
    };

    const groupedItems = currentItems.reduce((acc, item) => {
        const date = item.today;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    const sortedDates = Object.entries(groupedItems).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;
        const newItem = {
            id: Date.now(),
            description: newItemTitle,
            category: newItemCategory,
            today: newToday || currentDate,
            timeSpent: parseFloat(timeSpent) || 0,
            stage: isStage,
            due: dueDate,
            completed: false,
        };
        addItem(newItem);
        setNewItemTitle("");
        setNewItemCategory("");
        setNewToday(currentDate);
        setTimeSpent("");
        setIsStage("");
        setDueDate("");
    };

    return (
        <div className="micro-manager-container">
            <header className="app-header">
                <h1>Micro Manager</h1>
            </header>

            {/* The Add Item form remains the same as the previous suggestion */}
            <section className="add-item-section">
                <form className="add-item-form" onSubmit={handleFormSubmit}>
                    <div className="form-row-single">
                        <input value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} type="text" placeholder="What needs to be done?" className="form-input-main" />
                    </div>
                    <div className="form-row-grid">
                        <input value={timeSpent} type="number" step="0.1" onChange={(e) => setTimeSpent(e.target.value)} placeholder="Time (hrs)" title="Time Spent"/>
                        <input value={isStage} type="text" onChange={(e) => setIsStage(e.target.value)} placeholder="Stage" title="Stage"/>
                        <input value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} type="text" placeholder="Category" title="Category"/>
                        <input value={newToday} type="date" onChange={(e) => setNewToday(e.target.value)} title="Activity Date"/>
                        <input value={dueDate} type="date" onChange={(e) => setDueDate(e.target.value)} title="Due Date"/>
                         <button type="submit" id="submit-button" disabled={!newItemTitle.trim()}>
                            <FaPlus /> Add
                        </button>
                    </div>
                </form>
            </section>

            <main className="task-list-container">
                {sortedDates.map(([date, items]) => {
                    const totalTimeForDate = items.reduce((total, item) => total + parseFloat(item.timeSpent || 0), 0);

                    return (
                        <div key={date} className="task-group">
                            <div className="task-group-header">
                                <h2>{new Date(date.replace(/-/g, '/')).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                                <span>Total: <strong>{totalTimeForDate.toFixed(1)} hrs</strong></span>
                            </div>

                            {/* Spreadsheet Header */}
                            <div className="todo-grid todo-grid-header">
                                <div className="header-cell"></div> {/* Checkbox col */}
                                <div className="header-cell">Description</div>
                                <div className="header-cell">Time</div>
                                <div className="header-cell">Stage</div>
                                <div className="header-cell">Category</div>
                                <div className="header-cell">Due Date</div>
                                <div className="header-cell">Actions</div>
                            </div>
                            
                            {/* Spreadsheet Body */}
                            <div className="todo-grid-body">
                                {items.map((item) => (
                                    <TodoItem
                                        key={item.id}
                                        item={item}
                                        isEditing={editItemId === item.id}
                                        onEdit={() => startEditing(item)}
                                        onSave={() => saveEdit(item.id)}
                                        onCancel={cancelEditing}
                                        editTitle={editTitle} setEditTitle={setEditTitle}
                                        editCategory={editCategory} setEditCategory={setEditCategory}
                                        editToday={editToday} setEditToday={setEditToday}
                                        editDueDate={editDueDate} setEditDueDate={setEditDueDate}
                                        editTimeSpent={editTimeSpent} setEditTimeSpent={setEditTimeSpent}
                                        editStage={editStage} setEditStage={setEditStage}
                                        deleteCallback={deleteItem}
                                        toggleCompleted={() => toggleCompleted(item.id)}
                                        formatDisplayDate={formatDisplayDate}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default TodoList;
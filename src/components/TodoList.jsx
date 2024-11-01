import React, { useState, useEffect } from "react";
import "./TodoList.css";
import TodoItem from "./TodoItem/TodoItem";

const TodoList = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDate();
    const currentDate = `${month}/${day}/${year}`;

    const startingData = [
        { id: Date.now() + 1, description: "Administrative", category: "Job", today: currentDate, timeSpent: 0.5, stage: 'Admin', due: "2024-10-31", completed: false },
        { id: Date.now() + 2, description: "Scrum", category: "Job", today: currentDate, timeSpent: 0.5, stage: 'Admin', due: "2024-11-01", completed: false },
        { id: Date.now() + 3, description: "Breaks", category: "Job", today: "10/30/2024", timeSpent: 0.5, stage: 'Admin', due: "2024-11-02", completed: false },
        { id: Date.now() + 4, description: "Personal Development", category: "Job", today: "10/30/2024", timeSpent: 0.5, stage: 'Admin', due: "2024-11-03", completed: false }
    ];

    const [currentItems, setCurrentItems] = useState(() => {
        const storedItems = localStorage.getItem("todoItems");
        return storedItems ? JSON.parse(storedItems) : startingData;
    });

    const [newItemTitle, setNewItemTitle] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [newToday, setNewToday] = useState("");
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

    // Update localStorage whenever currentItems changes
    useEffect(() => {
        localStorage.setItem("todoItems", JSON.stringify(currentItems));
    }, [currentItems]);

    function addItem(newItem) {
        setCurrentItems([...currentItems, newItem]);
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
        setEditTitle("");
        setEditCategory("");
        setEditToday("");
        setEditTimeSpent("");
        setEditStage("");
        setEditDueDate("");
    }

    // Toggle completed status and ensure the state update triggers useEffect to save
    function toggleCompleted(itemId) {
        const updatedItems = currentItems.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        setCurrentItems(updatedItems); // This will trigger useEffect
    }

    const getTotalTimeSpent = () => {
        return currentItems.reduce((total, item) => total + parseFloat(item.timeSpent || 0), 0);
    };

    const groupedItems = currentItems.reduce((acc, item) => {
        const date = item.today;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    const sortedDates = Object.entries(groupedItems).sort(([dateA], [dateB]) => {
        return new Date(dateB) - new Date(dateA);
    });

    return (
        <div className="container">
            <h1>Micro Manager</h1>
            <div className="total-time">
                <strong>Total Time Spent:</strong> {getTotalTimeSpent()} hours
            </div>
            <div className="list-input">
                <input value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} type="text" placeholder="Add Description..." />
                <input value={newToday} type="date" onChange={(e) => setNewToday(e.target.value)} placeholder="Today's Date..." />
                <input value={timeSpent} type="number" step="0.01" onChange={(e) => setTimeSpent(e.target.value)} placeholder="Time Spent" />
                <input value={isStage} type="text" onChange={(e) => setIsStage(e.target.value)} placeholder="Stage..." />
                <input value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} type="text" className="category" placeholder="Add Category..." />
                <input value={dueDate} type="date" onChange={(e) => setDueDate(e.target.value)} placeholder="Due Date..." />
                <button onClick={() => {
                    const newItem = {
                        id: Date.now(),
                        description: newItemTitle,
                        category: newItemCategory,
                        today: newToday || currentDate,
                        timeSpent: parseFloat(timeSpent),
                        stage: isStage,
                        due: dueDate,
                        completed: false,
                    };
                    addItem(newItem);
                    setNewItemTitle("");
                    setNewItemCategory("");
                    setNewToday("");
                    setTimeSpent("");
                    setIsStage("");
                    setDueDate("");
                }} id="submit" disabled={!newItemTitle.trim() || !newItemCategory.trim()}>Create</button>
            </div>

            <div className="list-items">
                {sortedDates.map(([date, items]) => {
                    const totalTimeForDate = items.reduce((total, item) => total + parseFloat(item.timeSpent || 0), 0);

                    return (
                        <div key={date} className="date-group">
                            <h2>{date}</h2>
                            <div><strong>Total Time Spent for {date}: {totalTimeForDate} hours</strong></div>
                            <div className="header">
                                <div className="date">Date</div>
                                <div className="title">Time Spent</div>
                                <div className="description">Description</div>
                                <div className="stage">Owner/Stage</div>
                                <div className="category">Category</div>
                                <div className="due-date">Due Date</div>
                                <div className="completed">Completed</div>
                                <div className="actions">Actions</div>
                            </div>
                            <div className="body">
                                {items.map((item) => (
                                    <TodoItem
                                        key={item.id}
                                        item={item}
                                        isEditing={editItemId === item.id}
                                        onEdit={() => startEditing(item)}
                                        onSave={() => saveEdit(item.id)}
                                        onCancel={cancelEditing}
                                        editTitle={editTitle}
                                        setEditTitle={setEditTitle}
                                        editCategory={editCategory}
                                        setEditCategory={setEditCategory}
                                        editToday={editToday}
                                        setEditToday={setEditToday}
                                        dueDate={dueDate}
                                        setDueDate={setDueDate}
                                        editDueDate={editDueDate}
                                        setEditDueDate={setEditDueDate}
                                        editTimeSpent={editTimeSpent}
                                        setEditTimeSpent={setEditTimeSpent}
                                        editStage={editStage}
                                        setEditStage={setEditStage}
                                        deleteCallback={deleteItem}
                                        toggleCompleted={() => toggleCompleted(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TodoList;

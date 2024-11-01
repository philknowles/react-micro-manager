import React from "react";
import "./TodoItem.css";
import { AiFillDelete, AiTwotoneEdit, AiFillSave, AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";

const TodoItem = ({
    item,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    editTitle,
    setEditTitle,
    editCategory,
    setEditCategory,
    editToday,
    setEditToday,
    editTimeSpent,
    setEditTimeSpent,
    editDueDate,
    setEditDueDate,
    editStage,
    setEditStage,
    deleteCallback,
    toggleCompleted
}) => {
    return (
        <div className="wrapper">
            {isEditing ? (
                <>
                    <div className="date">
                        <input type="date" value={editToday} onChange={(e) => setEditToday(e.target.value)} />
                    </div>
                    <div className="time-spent">
                        <input type="number" step="0.01" value={editTimeSpent} onChange={(e) => setEditTimeSpent(e.target.value)} />
                    </div>
                    <div className="description">
                        <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </div>
                    <div className="stage">
                        <input type="text" value={editStage} onChange={(e) => setEditStage(e.target.value)} />
                    </div>
                    <div className="category">
                        <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                    </div>
                    <div className="due-date">
                        <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                    </div>
                    <div className="status">Status</div>
                    <div className="actions">
                        <button onClick={onSave} className="btn btn-none"><AiFillSave /></button>
                        <button onClick={onCancel} className="btn btn-none"><AiFillCloseCircle /></button>
                    </div>
                </>
            ) : (
                <>
                    <div className="date">{item.today}</div>
                    <div className="title">{item.timeSpent}</div>
                    <div className="description" style={{ textDecoration: item.completed ? `line-through` : `` }}>{item.description}</div>
                    <div className="stage">{item.stage}</div>
                    <div className="category">{item.category}</div>
                    <div className="due-date">{item.due}</div>
                    <div className="status">
                        <button onClick={() => toggleCompleted(item.id)} className={"checker" + (item.completed ? " active" : "")}>
                            <AiOutlineCheckCircle />
                        </button>
                    </div>
                    <div className="actions">
                        <button onClick={onEdit} className="btn btn-none"><AiTwotoneEdit /></button>
                        <button onClick={() => deleteCallback(item.id)} className="btn btn-none delete"><AiFillDelete /></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TodoItem;

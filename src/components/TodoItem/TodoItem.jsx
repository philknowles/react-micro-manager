import React from 'react';
import { 
    AiFillDelete, 
    AiTwotoneEdit, 
    AiFillSave, 
    AiFillCloseCircle, 
    AiOutlineCheckCircle, 
    AiFillCheckCircle 
} from "react-icons/ai";

// This component is now structured to output a single row with cells,
// matching the grid defined in the CSS.
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
    // editToday is no longer needed in the row as it's in the group header
    editTimeSpent,
    setEditTimeSpent,
    editDueDate,
    setEditDueDate,
    editStage,
    setEditStage,
    deleteCallback,
    toggleCompleted,
    formatDisplayDate // Use the formatting function from the parent
}) => {

    // The component returns one of two possible row structures
    const content = isEditing ? (
        // EDITING VIEW: A <form> that acts as a grid row
        <form className="todo-row editing-row" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
            <div className="cell cell-checkbox">
                {/* Checkbox is non-interactive during edit mode */}
                <AiOutlineCheckCircle color="#ccc" />
            </div>
            <div className="cell">
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus />
            </div>
            <div className="cell">
                <input type="number" step="0.1" value={editTimeSpent} onChange={e => setEditTimeSpent(e.target.value)} />
            </div>
            <div className="cell">
                <input type="text" value={editStage} onChange={e => setEditStage(e.target.value)} />
            </div>
            <div className="cell">
                <input type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} />
            </div>
            <div className="cell">
                <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
            </div>
            <div className="cell todo-actions">
                <button type="submit" className="save-btn" title="Save"><AiFillSave /></button>
                <button type="button" onClick={onCancel} className="cancel-btn" title="Cancel"><AiFillCloseCircle /></button>
            </div>
        </form>
    ) : (
        // NORMAL VIEW: A <div> that acts as a grid row
        <div className={`todo-row ${item.completed ? 'completed' : ''}`}>
            <div className="cell cell-checkbox" onClick={() => toggleCompleted(item.id)} title="Toggle Complete">
                {item.completed ? <AiFillCheckCircle className="completed-icon" /> : <AiOutlineCheckCircle />}
            </div>
            <div className="cell todo-cell-description" title={item.description}>
                {item.description}
            </div>
            <div className="cell" title="Time Spent">
                {item.timeSpent} hrs
            </div>
            <div className="cell" title="Stage">
                {item.stage || 'N/A'}
            </div>
            <div className="cell" title="Category">
                {item.category || 'N/A'}
            </div>
            <div className="cell" title="Due Date">
                {formatDisplayDate(item.due)}
            </div>
            <div className="cell todo-actions">
                <button onClick={onEdit} className="edit-btn" title="Edit"><AiTwotoneEdit /></button>
                <button onClick={() => deleteCallback(item.id)} className="delete-btn" title="Delete"><AiFillDelete /></button>
            </div>
        </div>
    );

    return content;
};

export default TodoItem;
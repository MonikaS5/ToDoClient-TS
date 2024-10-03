import axios from "axios";
import { useEffect, useState } from "react";
import { PencilSquare, Trash, EmojiSmile, PlusCircle, Save } from 'react-bootstrap-icons';

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newDescription, setNewDescription]= useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");

    // Fetch tasks from database
    useEffect(() => {
        axios.get('https://todos-rk4n.onrender.com/getTodoList')
            .then(result => {
                setTodoList(result.data)
            })
            .catch(err => console.log(err))
    }, [])

    // Function to handle the editable state for a specific row
    const handleEditTask = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedDescription(rowData.description);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        }
    };



    // Function to add task to the database
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newDescription || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('https://todos-rk4n.onrender.com/addTodoList', { task: newTask, description: newDescription, status: newStatus, deadline: newDeadline })
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    // Function to save edited data to the database
    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            description: editedDescription,
            status: editedStatus,
            deadline: editedDeadline,
        };

        // If the fields are empty
        if (!editedTask || !editedDescription || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }



        // Updating edited data to the database through updateById API
        axios.post('https://todos-rk4n.onrender.com/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                setEditableId(null);
                setEditedTask("");
                setEditedDescription("");
                setEditedStatus("");
                setEditedDeadline(""); // Clear the edited deadline
                window.location.reload();
            })
            .catch(err => console.log(err));
    }


    // Delete task from database
    const deleteTask = (id) => {
        axios.delete('https://todos-rk4n.onrender.com/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err =>
                console.log(err)
            )
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7 ">
                    <h2 className="text-start mb-2"><span className="text-warning me-2"><EmojiSmile /></span>Todos </h2>

                    {Array.isArray(todoList) ? (
                        <ul >
                            {todoList.map((data) => (
                                <div className='container border border-dark rounded mb-3 p-3' key={data._id}>
                                    <div className="row">
                                        <div className="col-md-9">
                                            <div className="form-group">
                                                <p className="fw-bold">
                                                    <span>Task :  </span>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editedTask}
                                                            onChange={(e) => setEditedTask(e.target.value)}
                                                        />
                                                    ) : (
                                                        
                                                        data.task
                                                    )}</p>
                                            </div>
                                            <div className="form-group">
                                                <p>
                                                    <span className="fw-bold">Description :  </span>
                                                    {editableId === data._id ? (
                                                        <textarea
                                                            rows="3"
                                                            className="form-control"
                                                            value={editedDescription}
                                                            onChange={(e) => setEditedDescription(e.target.value)}>
                                                        </textarea>
                                                    ) : (
                                                        <>
                                                        {data.description} 
                                                        </>
                                                    )}</p>
                                            </div>
                                            <div className="form-group">
                                                <p >
                                                    <span className="fw-bold">Status :  </span>

                                                    {editableId === data._id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.status
                                                    )}</p>
                                            </div>
                                            <div className="form-group">
                                                <p>
                                                    <span className="fw-bold"> Deadline : </span>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="datetime-local"
                                                            className="form-control"
                                                            value={editedDeadline}
                                                            onChange={(e) => setEditedDeadline(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.deadline ? new Date(data.deadline).toLocaleString("en-GB",{hour12: true}) : ''
                                                    )}</p>
                                            </div>

                                        </div>
                                        <div className="col-md-3 ">

                                            <div className="btn-group " role="group" aria-label="Basic mixed styles example">
                                                <button type="button" title="Edit" className="btn btn-outline-secondary btnedit" onClick={() => handleEditTask(data._id)}>
                                                    <h5>< PencilSquare /></h5></button>
                                                <button type="button" title="Save" className="btn btn-outline-secondary btnsave" onClick={() => saveEditedTask(data._id)}>
                                                    <h5><Save /></h5></button>
                                                <button type="button" title="Delete" className="btn btn-outline-secondary btndel" onClick={() => deleteTask(data._id)}>
                                                    <h5>< Trash /></h5></button>

                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <>
                            <h3> Loading...</h3>
                        </>
                    )}
                </div>
                <div className="col-md-5">
                    <h2 className="text-start mb-2"><span className="text-primary me-2"><PlusCircle /></span>Add Task</h2>
                    <form className=" p-4 bg-light">
                        <div className="mb-3">
                            <label>Task</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Your Task"
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                rows="3"
                                className="form-control"
                                
                                placeholder="Enter Description"
                                onChange={(e) => setNewDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <select  className="form-select" onChange={(e) => setNewStatus(e.target.value)}>
                                <option selected disabled>Select Status...</option>
                                <option value="In progress">In Progress</option>
                                <option value="Pending">Pending</option>
                                <option value="complete " >Complete</option>
                            </select>
                           

                        </div>
                        <div className="mb-3">
                            <label>Deadline</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button onClick={addTask} className="btn btn-primary btn-sm">
                            Add Task
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
export default Todo;

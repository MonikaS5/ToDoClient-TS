import axios from "axios";
import { useEffect, useState } from "react";
import { PencilSquare, Trash, EmojiSmile, PlusCircle, Save } from 'react-bootstrap-icons';



//Defining type for ToDO item

interface ToDoItem{
    _id: string;
    task: string;
    description: string;
    status: string;
   deadline?: string;
}

const Todo: React.FC = () => {
    const [todoList, setTodoList] = useState<ToDoItem[]>([]);
    const [editableId, setEditableId] = useState<string | null>(null);
    const [editedTask, setEditedTask] = useState<string>("");
    const [editedDescription, setEditedDescription] = useState<string>("");
    const [editedStatus, setEditedStatus] = useState<string>("");
    const [newTask, setNewTask] = useState("");
    const [newDescription, setNewDescription]= useState("");
    const [newStatus, setNewStatus] = useState<string>("");
    const [newDeadline, setNewDeadline] = useState<string>("");
    const [editedDeadline, setEditedDeadline] = useState<string>("");

    // Fetch tasks from database
    useEffect(() => {
        axios.get('http://localhost:5000/getTodoList')
            .then(result => {
                setTodoList(result.data)
            })
            .catch(err => console.log(err))
    }, [])

    // Function to handle the editable state for a specific row
    const handleEditTask = (id: string) => {
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
    const addTask = (e:React.FormEvent) => {
        e.preventDefault();
        if (!newTask || !newDescription || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://localhost:5000/addTodoList', { task: newTask, description: newDescription, status: newStatus, deadline: newDeadline })
            .then(res => {
               setTodoList(prevList=>[...prevList, res.data]);
               setNewTask("");
               setNewDescription("");
               setNewStatus("");
               setNewDeadline("");
            })
            .catch(err => console.log(err));
    }

    // Function to save edited data to the database
    const saveEditedTask = (id:string) => {
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
        axios.post('http://localhost:5000/updateTodoList/' + id, editedData)
            .then(() => {
                setTodoList(prevList=>
                    prevList.map(item=>(item._id===id ?{...item, ...editedData}:item))
                ); //update specific task
                setEditableId(null);
                setEditedTask("");
                setEditedDescription("");
                setEditedStatus("");
                setEditedDeadline(""); 
                
            })
            .catch(err => console.log(err));
    }


    // Delete task from database
    const deleteTask = (id:string) => {
        axios.delete('http://localhost:5000/deleteTodoList/' + id)
            .then(() => {
                setTodoList(prevList=> prevList.filter(item=>item._id !== id));
            })
            .catch(err =>
                console.log(err)
            )
    }

    const resetFields = (e: React.FormEvent) =>{
       e.preventDefault();
        setNewTask("");
        setNewDescription("");
        setNewStatus("");
        setNewDeadline("");

    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7 ">
                    <h2 className="text-start mb-2"><span className="text-warning me-2"><EmojiSmile /></span>ToDos </h2>

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
                                                            rows={3}
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
                                                        <select
                                                            className="form-control"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value)}
                                                        >
                                                            <option value="" disabled>Select Status...</option>
                                                            <option value="In Progress" >In Progress</option>
                                                            <option value="Pending" >Pending</option>
                                                            <option value="Complete" >Complete</option>
                                                        </select>
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
                                                <button type="button" title="Edit" className="btn btn-outline-secondary btnEdit" onClick={() => handleEditTask(data._id)}>
                                                    <h5>< PencilSquare /></h5></button>
                                                <button type="button" title="Save" className="btn btn-outline-secondary btnSave" onClick={() => saveEditedTask(data._id)}>
                                                    <h5><Save /></h5></button>
                                                <button type="button" title="Delete" className="btn btn-outline-secondary btnDel" onClick={() => deleteTask(data._id)}>
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
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                rows={3}
                                className="form-control"
                                value={newDescription}
                                placeholder="Enter Description"
                                onChange={(e) => setNewDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <select  className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="" disabled>Select Status...</option>
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
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button type="submit" onClick={addTask} className="btn btn-primary btn-sm me-3">
                            Add Task
                        </button>
                        <button type="button" onClick={e=>resetFields(e)} className="btn btn-secondary btn-sm">
                           Reset
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
export default Todo;

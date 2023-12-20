import { css, jsx } from "@emotion/react";
import '../index.css';
import { useEffect, useState } from "react";
import Axios from "axios";
import fetchUserData from "../utils/fetchUserData"

const TodayTasks = () => {

    // const [tasks, setTasks] = useState([]);
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);

    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchData() {
            const res = await fetchUserData()
            console.log(res.data);
            setUser(res.data);
        }
        fetchData();
    }, [])

    useEffect(() => {
        if(user.personality){
            Axios.get(`/tasks/${user.personality}`)
            .then((response) => {
                console.log(response);
                setTodos(response.data.tasks);
            })
        }
        
    },[user])

    const handleInput = (e) => {
        setTodo(e.target.value);
    }

    const addTodo = () => {
        setTodo('');
        setTodos([...todos, todo]);
    };

    const deleteTodo = (todo) => {
        setTodos(todos.filter((t) => t._id !== todo._id));
    }

    return (
        <div style={{ marginBottom: '10px' }}>
            <h1>Your Tasks for today</h1>
            <div className="todo">
                {/* <h2>Add todo</h2>
            <input value={todo} type="text" onChange={handleInput} style={{marginBottom: '10px', border: 'solid'}}/> */}
                {/* <button className="submitBtn" onClick={addTodo}>Add todo</button> */}
                {todos.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} deleteTodo={deleteTodo} />
                ))}
            </div>
        </div>
    )
}

const TodoItem = ({ todo, deleteTodo }) => {
    return (
        <div className="todoItem" >
            <input type="checkbox" style={{ marginRight: '10px' }} />
            <span style={{ marginRight: '10px' }} >{todo.title}</span>
            <span style={{ marginRight: '10px' }} >{todo.task}</span>
            <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteTodo(todo)}>Delete</span>
        </div>
    )
}

export default TodayTasks;
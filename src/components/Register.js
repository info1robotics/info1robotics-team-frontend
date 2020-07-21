import React, { useState, useContext, useRef, UseEffect, useEffect } from 'react';
import UsersService from '../services/UsersService';
import ServerMessage from '../components/ServerMessage';


const Register = (props) => {
    const [user, setUser] = useState({username: "", email: "", password: "", secret: "", role: "user"});
    const [message, setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        };
    }, []);

    const onChangeHandler = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        UsersService.activateUser(user).then(data => {
            const {success, message } = data;
            setMessage({success, msgBody: message});
            if(success) {
                timerID = setTimeout(() => {
                    props.history.push('/user/login');
                }, 2000);
            }
        });
    }

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <h1>Register</h1>
                <div className="dropdown-divider mt-3 mb-4"/>
                <label htmlFor="username" className="sr-only">Username</label>
                <input type="text" 
                       name="username" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter username" />
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="text" 
                       name="email" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter email" />
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" 
                       name="password" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter password" />
                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Register</button>
                
                {message? <ServerMessage message={message} /> : null} 
            </form>
        </div>
    )
};

export default Register;
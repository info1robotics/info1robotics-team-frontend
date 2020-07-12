import React, { useState, useContext } from 'react';
import AuthService from '../services/AuthService';
import {AuthContext} from '../contexts/AuthContext';
import ServerMessage from '../components/ServerMessage';


const Login = (props) => {
    const [user, setUser] = useState({username: "", password: ""});
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChangeHandler = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        AuthService.login(user).then(data => {
            const {isAuthenticated, user, message } = data;
            if(isAuthenticated) {
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                props.history.push('/uploads');
            } else {
                setMessage(message);
            }
        });
    }

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <h1>Sign In</h1>
                <label htmlFor="username" className="sr-only">Username</label>
                <input type="text" 
                       name="username" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter username" />
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" 
                       name="password" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter password" />
                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Log in</button>
                
                {message? <ServerMessage message={message} /> : null} 
            </form>
        </>
    )
};

export default Login;
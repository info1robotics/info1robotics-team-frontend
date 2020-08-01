import React, { useState, useContext } from 'react';
import UsersService from '../services/UsersService';
import {AuthContext} from '../contexts/AuthContext';
import ServerMessage from '../components/ServerMessage';
import Fade from 'react-reveal/Fade';

const Login = (props) => {
    const [user, setUser] = useState({username: "", password: ""});
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChangeHandler = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        UsersService.login(user).then(data => {
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
        <Fade down duration={300} distance={"16px"}>
            <form onSubmit={onSubmitHandler}>
                <h1>Sign In</h1>
                <div className="dropdown-divider mt-3 mb-4"/>
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
                <button className="btn btn-lg btn-primary btn-block shadow mb-2"
                    type="submit">Log in</button>
                
                {message? <ServerMessage message={message} /> : null} 
            </form>
        </Fade>
    )
};

export default Login;
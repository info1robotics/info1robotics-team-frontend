import React, { useState, useContext } from 'react';
import UsersService from '../services/UsersService';
import {AuthContext} from '../contexts/AuthContext';
import ServerMessage from '../components/ServerMessage';


const NewUserInvite = (props) => {
    const [user, setUser] = useState({email: "", role: "user"});
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChangeHandler = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        UsersService.inviteNewUser(user).then(data => {
            if(data.success) {
                props.history.push('/admin');
            } else {
                setMessage({success: data.success, msgBody: data.message});
            }
        });
    }

    const onRadioChangeHandler = (event) => {
        if(event.target.id === "radioRoleUser") {
            setUser({...user, role: "user"});
        } else if(event.target.id === "radioRoleAdmin") {
            setUser({...user, role: "admin"});
        }
    }

    return (
        <>
            <form onSubmit={onSubmitHandler}>
                <h1>Sign In</h1>
                <div className="dropdown-divider mt-3 mb-4"/>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="text" 
                       name="email" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter email" />
                
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="radioOptions" defaultChecked={true} id="radioRoleUser" onChange={onRadioChangeHandler} />
                    <label class="form-check-label" htmlFor="userRadio">User</label>
                </div>

                <div class="form-check form-check-inline mt-3 mb-3">
                    <input class="form-check-input" type="radio" name="radioOptions" id="radioRoleAdmin" onChange={onRadioChangeHandler} />
                    <label class="form-check-label" htmlFor="userRadio">Admin</label>
                </div>

                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Invite</button>
                
                {message? <ServerMessage message={message} /> : null} 
            </form>
        </>
    )
};

export default NewUserInvite;
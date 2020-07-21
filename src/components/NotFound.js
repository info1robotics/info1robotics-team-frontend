import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import UsersService from '../services/UsersService';

const NotFound = (props) => {

    const { isAuthenticated, user, setIsAuthenticated, setUser} = useContext(AuthContext);

    const onChangeUsersButtonClickHandler = () => {
        UsersService.logout().then(data => {
            if(data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
                props.history.push('/user/login');
            }
        });
    }
    return (
        <div className="row justify-content-center p-3">
            <div className="col-12 col-md-6">
                <div class="jumbotron float-center">
                    <h1 class="display-4">Whoops!</h1>
                    <p class="lead">If you're looking for something, it's not here or you're not authorized to see it.</p>
                    <hr class="my-4"/>
                    <p>Maybe try logging in or switching users?</p>
                    <p class="lead">
                        <Link class="btn btn-primary mr-2" to="/user/login">Log in</Link>
                        <button class="btn btn-secondary " onClick={onChangeUsersButtonClickHandler}>Change Users</button>
                    </p>
                </div>
            </div>
        </div>
        
        
        
    );
};

export default NotFound;
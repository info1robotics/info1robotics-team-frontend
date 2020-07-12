import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import AuthService from '../services/AuthService';
import { AuthContext } from '../contexts/AuthContext';


const Navbar = props => {
    const { isAuthenticated, user, setIsAuthenticated, setUser} = useContext(AuthContext);

    const onClickLogoutHandler = () => {
        AuthService.logout().then(data => {
            if(data.success) {
                setUser(data.user);
                setIsAuthenticated(false);
                props.history.push('/home');
            }
        });
    };

    const unauthenticatedNav = () => {
        return (
            <>
                <Link to="/">
                    <li className="btn btn-link nav-item nav-link">Home</li>
                </Link>
                <Link to="/user/login">
                    <li className="btn btn-link nav-item nav-link">Login</li>
                </Link>
                <Link to="/user/register">
                    <li className="btn btn-link nav-item nav-link">Register</li>
                </Link>
            </>
        );
    };

    const authenticatedNav = () => {
        return (
        <>
            <Link to="/">
                <li className="btn btn-link nav-item nav-link">Home</li>
            </Link>
            <Link to="/uploads">
                <li className="btn btn-link nav-item nav-link">Uploads</li>
            </Link>
            {
                user.role === "admin" ?
                <Link to="/admin">
                    <li className="btn btn-link nav-item nav-link">Admin</li>
                </Link> : null
            }
            <button type="button"
                className="btn btn-link nav-item nav-link" onClick={onClickLogoutHandler}>Logout</button>
            
        </>
        );
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="brand-name">infO(1) Robotics</div>
            <Link to="/">
                <div className="navbar-brand"></div>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                    {!isAuthenticated? unauthenticatedNav() : authenticatedNav()}
                </ul>
            </div>
        </nav>
    );
};

export default withRouter(Navbar);
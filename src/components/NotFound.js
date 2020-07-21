import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="row justify-content-center p-3">
            <div className="col-12 col-md-6">
                <div class="jumbotron float-center">
                    <h1 class="display-4">Whoops!</h1>
                    <p class="lead">If you're looking for something, it's not here or you're not authorized to see it.</p>
                    <hr class="my-4"/>
                    <p>Maybe try logging in?</p>
                    <p class="lead">
                        <Link class="btn btn-primary btn-lg" to="/user/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
        
        
        
    );
};

export default NotFound;
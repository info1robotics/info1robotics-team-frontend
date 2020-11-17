import { useState, useEffect, useContext, useReducer } from "react";
import React from 'react';
import UsersService from "../services/UsersService";
import { Link } from "react-router-dom";
import UploadsService from "../services/UploadsService";
import UploadCard from "./UploadCard";
import { AuthContext } from "../contexts/AuthContext";
import { latestReviews, outdatedReviews } from '../utils/ReviewsUtils';
import ServerMessage from "./ServerMessage";
import Fade from 'react-reveal/Fade';
import constants from "../constants";

const AllUsers = (props) => {

    const [usersJSX, setUsersJSX] = useState([]);
    const [usersUpdate, setUsersUpdate] = useState(props.users.map(user => { return { role: user.role, _id: user._id, username: user.username, email: user.email } }));
    const authContext = useContext(AuthContext);


    useEffect(() => {
        setUsersJSX(
            props.users.map(user => {
                return (
                    <tr>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td><input type="checkbox" aria-label="" name={user._id} defaultChecked={user.role === "admin"} disabled={authContext.user._id === user._id} onChange={onChangeHandler} /></td>
                    </tr>
                );
            })
        );
    }, []);


    const onChangeHandler = (event) => {

        for (var i = 0; i < usersUpdate.length; i++) {
            if (usersUpdate[i]._id === event.target.name) {
                let updatedArray = [...usersUpdate];
                updatedArray[i].role = event.target.checked ? "admin" : "user";
                setUsersUpdate(updatedArray);
                break;
            }

        }




    };

    const onSendUsersUpdate = async (event) => {

        const data = await UsersService.updateUsers(usersUpdate);


        if (data.success) {
            console.log(props);
            props.history.push('/home');
            props.history.push('/admin');
        } else {
            /* TODO */
        }
    };


    return (

        <>
            <ul className="col list-group">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Admin?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersJSX}
                    </tbody>
                </table>
            </ul>
            <div className="text-center"><button role="button" className="btn btn-secondary shadow rounded mb-2" onClick={onSendUsersUpdate}>Update Users</button></div>
        </>
    );

};

const ReadyToBeIntegratedUploads = (props) => {

    const [uploadsJSX, setUploadsJSX] = useState([]);

    useEffect(() => {

        const validUploads = props.uploads.filter(upload => {

            const lReviews = latestReviews(upload.reviews);

            return !upload.integrated
                && lReviews.length > 0
                && lReviews.filter(review => review.positive).length === lReviews.length;
        });

        if (validUploads.length > 0)
            setUploadsJSX(
                validUploads.map(upload => <UploadCard upload={upload} />)
            );
        else setUploadsJSX(
            <ServerMessage message={{ success: true, msgBody: "There's nothing ready..." }} />
        )




    }, []);

    return <>{uploadsJSX}</>;
}


const AdminPanel = (props) => {

    const [users, setUsers] = useState([]);
    const [uploads, setUploads] = useState([]);

    const [hasFetched, setHasFetched] = useState(false);


    useEffect(() => {

        const fetchData = async () => {
            const usersData = await UsersService.getAllUsers();
            const uploadsData = await UploadsService.getAllUploads();

            if (usersData.success) {
                setUsers(usersData.users);
            }

            if (uploadsData.success) {
                setUploads(uploadsData.uploads);
            }

            setHasFetched(true);
        };

        fetchData();


    }, []);


    const FetchedView = () => {
        return (
            <Fade down duration={300} distance={"16px"}>
                <a href={`http://${constants.BACKEND_IP}:${constants.BACKEND_PORT}/visits/export/all`} className="btn btn-primary shadow" download>Download Lab Visits Report</a>
                <div className="shadow rounded mb-2 p-3 mb-5">
                    <div className="row pt-3 justify-content-center pb-3 ">
                        <div className="col-12 text-center">
                            <h2 className="">All Users</h2>
                            <Link to="/inviteUser" type="button" className="btn btn-primary float-center shadow mb-2">Invite User</Link>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col">
                            <AllUsers users={users} history={props.history} />
                        </div>

                    </div>
                </div>

                <div className="shadow rounded">
                    <div className="row pt-3 justify-content-center pb-3">
                        <div className="col-12 text-center">
                            <h2 className="">Uploads ready for the Notebook</h2>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <ReadyToBeIntegratedUploads uploads={uploads} />
                    </div>
                </div>

            </Fade>
        );
    };


    const UnfetchedView = () => {
        return <h1>Loading...</h1>;
    }



    return (
        <>
            {hasFetched ? FetchedView() : UnfetchedView()}
        </>
    );
};

export default AdminPanel;

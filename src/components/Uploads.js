import React, { useState, useEffect, useRef, useContext } from 'react';

import UploadsService from '../services/UploadsService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ServerMessage from './ServerMessage';
import ReviewsService from '../services/ReviewsService';
import UploadCard from './UploadCard';

const Uploads = (props) => {
    
    const [myUploadsJSX, setMyUploadsJSX] = useState([]);
    const [otherUploadsJSX, setOtherUploadsJSX] = useState([]);
    const authContext = useContext(AuthContext);


    useEffect( () => {
        if(!authContext.isAuthenticated) props.history.push('/home');
        else {

            // MY UPLOADS
            UploadsService.getMyUploads().then(data => {
                const {uploads} = data;
        
                let aux = [];
                for(var i = 0; i < uploads.length; i++) {
                    aux.push(<UploadCard upload={uploads[i]} />);
                }
        
                if(aux.length !== 0) setMyUploadsJSX(aux);
                else setMyUploadsJSX((
                    <ServerMessage clsName={"ml-3"} message={{success: true, msgBody: "You haven't uploaded anything yet."}} />
                ));
                
            });


            //OTHER UPLOADS

            UploadsService.getAllUploads().then(data => {
                const {uploads} = data;
        
                let aux = [];
                for(var i = 0; i < uploads.length; i++) {
                    aux.push();
                }
        
                setOtherUploadsJSX(
                    uploads
                        .filter(upload => upload.author._id !== authContext.user._id)
                        .map(upload => <UploadCard upload={upload} />)
                );
                
            });
        }
    }, []);
    

    return (
        <>
        <div className="row pt-3 justify-content-center pb-3">
            <div className="col-12 text-center">
                <h2 className="">My Uploads</h2>
                <Link to="/uploads/new" type="button" className="btn btn-primary float-center">New Upload</Link>
            </div>
        </div>

        <div className="row justify-content-center">
            {myUploadsJSX}
        </div>

        <div className="dropdown-divider m-4"/>
        <div className="row pt-3 justify-content-center pb-3">
            <div className="col-6 text-center">
                <h2 className="">Other Uploads</h2>
            </div>
        </div>

        <div className="row justify-content-center">
            {otherUploadsJSX}
        </div>
            
            
        </>
    );
};

export default Uploads;
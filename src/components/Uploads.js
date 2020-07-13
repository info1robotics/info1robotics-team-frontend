import React, { useState, useEffect, useRef, useContext } from 'react';

import UploadsService from '../services/UploadsService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ServerMessage from './ServerMessage';

const UploadCard = (props) => {
    let tagsJSX = [];

    for(var i = 0; i < props.upload.tags.length; i++) {
        tagsJSX.push(<h5 className="pr-1" style={{display: "inline"}}><span className="badge badge-primary">{props.upload.tags[i]}</span></h5>);
    };

    return (
        <div className="col-12 col-md-4 p-2">
            <div className="card" style={{width: "100%"}}>
                <div className="card-body">
                    <h5 className="card-title">{props.upload.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{props.upload.author.username}</h6>
                    {tagsJSX}
                    <h5></h5> { /* pentru separarea intre tag-uri si butoane */}
                    <a href={"http://localhost:5002/uploads/download/" + props.upload.name} className="card-link" download>Download</a> {/* TODO: trebuie neaparat sa vad cum sa folosesc proxy-ul pt file download */}
                    <Link to={`/upload/${props.upload._id}`} className="card-link">Details</Link>
                </div>
            </div>
        </div>
        
    );
};

const Uploads = (props) => {
    
    const [myUploadsJSX, setMyUploadsJSX] = useState([]);
    const [allUploadsJSX, setAllUploadsJSX] = useState([]);
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


            //ALL UPLOADS

            UploadsService.getAllUploads().then(data => {
                const {uploads} = data;
        
                let aux = [];
                for(var i = 0; i < uploads.length; i++) {
                    aux.push(<UploadCard upload={uploads[i]} />);
                }
        
                setAllUploadsJSX(aux);
                
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

        <div className="row pt-3 justify-content-center pb-3">
            <div className="col-6 text-center">
                <h2 className="">All Uploads</h2>
            </div>
        </div>

        <div className="row justify-content-center">
            {allUploadsJSX}
        </div>
            
            
        </>
    );
};

export default Uploads;
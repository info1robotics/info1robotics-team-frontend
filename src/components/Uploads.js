import React, { useState, useEffect, useRef, useContext } from 'react';

import UploadsService from '../services/UploadsService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const UploadCard = (props) => {
    let tagsJSX = [];

    for(var i = 0; i < props.upload.tags.length; i++) {
        tagsJSX.push(<h5><span className="badge badge-primary">{props.upload.tags[i]}</span></h5>);
    };

    return (
        <div className="col-4">
            <div className="card" style={{width: "100%"}}>
                <div className="card-body">
                    <h5 className="card-title">{props.upload.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{props.upload.filename}</h6>
                    {tagsJSX}
                    <a href={"http://localhost:5002/uploads/download/" + props.upload.filename} className="card-link" download>Download</a> {/* trebuie neaparat sa vad cum sa folosesc proxy-ul pt file download */}
                    <Link to={`/upload/${props.upload.filename}`} className="card-link">Details</Link>
                </div>
            </div>
        </div>
        
    );
};

const Uploads = (props) => {
    
    const [uploadsJSX, setUploadsJSX] = useState([]);
    const authContext = useContext(AuthContext);


    useEffect( () => {
        if(!authContext.isAuthenticated) props.history.push('/home');
        else {
            UploadsService.getMyUploads().then(data => {
                const {uploads} = data;
        
                let aux = [];
                for(var i = 0; i < uploads.length; i++) {
                    aux.push(<UploadCard upload={uploads[i]} />);
                }
        
                console.log(aux);
                setUploadsJSX(aux);
                
            });
        }
    }, []);
    

    return (
        <>
        <div className="row pt-3 pb-3">
            <div className="col">
                <h2 className="">My Uploads</h2>
            </div>
            <div className="col">
                <Link to="/uploads/new" type="button" className="btn btn-primary float-right">New Upload</Link>
            </div>

            
        </div>

        <div className="row">
            {uploadsJSX}
        </div>
            
            
        </>
    );
};

export default Uploads;
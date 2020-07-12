import React, { useState, useEffect } from 'react';

import UploadsService from '../services/UploadsService';

const UploadCard = (props) => {
    return <div className="row"><h1>{props.upload.name}</h1></div>;
};

const Uploads = () => {
    
    const [uploadsJSX, setUploadsJSX] = useState([]);

    useEffect( () => {
        UploadsService.getMyUploads().then(data => {
            const {uploads} = data;
    
            let aux = [];
            for(var i = 0; i < uploads.length; i++) {
                aux.push(<UploadCard upload={uploads[i]} />);
            }
    
            console.log(aux);
            setUploadsJSX(aux);
            
        });
    }, []);
    

    return (
        <>
        <div className="row">
            <div className="col">
                <h2>My Uploads</h2>
            </div>
            <div className="col">
                <button type="button" className="btn btn-primary float-right">New Upload</button>
            </div>

            
        </div>

        
        {uploadsJSX}
            
            
        </>
    );
};

export default Uploads;
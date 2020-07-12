import React, { useState, useContext, useRef, UseEffect, useEffect } from 'react';
import ServerMessage from './ServerMessage';
import UploadsService from '../services/UploadsService';


const UploadNew = (props) => {
    const [upload, setUpload] = useState({file: null, tags: ""});
    const [message, setMessage] = useState(null);
    let timerID = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(timerID);
        };
    }, []);

    const onChangeHandler = (event) => {
        setUpload({...upload, [event.target.name] : event.target.value});
    };

    
    const onFileChangeHandler = (event) => {
        event.preventDefault();
        setUpload({...upload, [event.target.name] : event.target.files[0]});

    }

    const resetForm = () => {
        setUpload({file: null, tags: ""});
    }

    const onSubmitHandler = (event) => {
        let uploadForm = new FormData();

        uploadForm.append('file', upload.file);
        uploadForm.append('tags', upload.tags);

        event.preventDefault();
        UploadsService.newUpload(uploadForm).then(data => {
            const {success, message} = data;
            setMessage({success, msgBody: message});
            resetForm();
            if(success) {
                timerID = setTimeout(() => {
                    props.history.push('/uploads');
                }, 2000);
            }
        });
    }


    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <h1>New Upload</h1>
                <label htmlFor="file" className="sr-only">File Input</label>
                <input type="file"
                       name="file"
                       onChange={onFileChangeHandler}
                       className="form-control-file" />


                <label htmlFor="tags" className="sr-only">Tags</label>
                <input type="text" 
                       name="tags" 
                       onChange={onChangeHandler}
                       className="form-control"
                       placeholder="Enter tags separated by commas" />
                <button className="btn btn-lg btn-primary btn-block"
                    type="submit">Upload</button>
                
                {message? <ServerMessage message={message} /> : null} 
            </form>
        </div>
    )
};

export default UploadNew;
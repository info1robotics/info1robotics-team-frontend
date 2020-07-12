import React, { useEffect, useState } from 'react';
import UploadsService from '../services/UploadsService';

const UploadDash = (props) => {

    const [upload, setUpload] = useState({});
    useEffect(() => {
        UploadsService.getUpload(props.match.params.flname).then((data) => {
            if(data.success) {
                setUpload(data.upload);
            } else {
                /* TODO: SeverMessage */
            }
        });
    }, []);
    return (
        <>
        <h2>Details for: {upload.name}</h2>
        <h6 className="mb-2 text-muted">{upload.filename}</h6>
        </>
    );

};

export default UploadDash;

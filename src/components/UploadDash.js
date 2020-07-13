import React, { useEffect, useState } from 'react';
import UploadsService from '../services/UploadsService';


const UploadDash = (props) => {

    const [upload, setUpload] = useState({});
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        UploadsService.getUpload(props.match.params.id).then((data) => {
            if(data.success) {
                setUpload(data.upload);
                setHasFetched(true);
            } else {
                /* TODO: SeverMessage */
            }
        });
    }, []);


    const FetchedView = () => {
        return (
            <div className="row pt-3 justify-content-center">
                <div className="col-12 col-md-6">
                    <h2 className="">{upload.name}</h2>
                    <h6 className="mb-2 text-muted">{upload._id}</h6>
                    </div>
                    <div className="col-12 col-md-2">
                        <a href={"http://localhost:5002/uploads/download/" + upload.name} type="button" className="btn btn-primary btn-block float-right">Download</a> {/* la fel si aici */}
                </div>
                
            </div>
        );
    };


    
    return (
        <>
        {hasFetched? FetchedView() : null}
        </>
    );

};

export default UploadDash;

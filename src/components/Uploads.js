import React, { useState, useEffect, useRef, useContext } from 'react';

import UploadsService from '../services/UploadsService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ServerMessage from './ServerMessage';
import ReviewsService from '../services/ReviewsService';
import UploadCard from './UploadCard';
import Fade from 'react-reveal/Fade';


const Uploads = (props) => {
    
    const [myUploadsJSX, setMyUploadsJSX] = useState([]);
    const [otherUploadsJSX, setOtherUploadsJSX] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
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

                //OTHER UPLOADS

                UploadsService.getAllUploads().then(data => {
                    const {uploads} = data;
            
                    let aux = [];
                    for(var i = 0; i < uploads.length; i++) {
                        aux.push();
                    }
            
                    const filteredUploads = uploads
                                            .filter(upload => upload.author._id !== authContext.user._id)
                                            .map(upload => <UploadCard upload={upload} />);

                    if(filteredUploads.length !== 0) setOtherUploadsJSX(filteredUploads);
                    else setOtherUploadsJSX((
                        <ServerMessage message={{success: true, msgBody: "There's nothing here yet."}} />
                    ));

                    setHasFetched(true);
                    
                });
                
            });


        }
    }, []);
    

    const fetchedView = () => {
        return (
        <Fade down duration={300} distance={"16px"}>
        <div className="shadow mt-3 mb-5 p-3">
            <div className="row pt-3 justify-content-center mb-2">
                <div className="col-12 text-center">
                    <h2 className="mb-2">My Uploads</h2>
                    <Link to="/uploads/new" type="button" className="btn btn-primary float-center shadow mb-2">New Upload</Link>
                </div>
            </div>

            <div className="row justify-content-center">
                {myUploadsJSX}
            </div>
        </div>
        



        <div className="shadow mt-3 mb-5 p-3">
            <div className="row pt-3 justify-content-center pb-3">
                <div className="col-6 text-center">
                    <h2 className="">Other Uploads</h2>
                </div>
            </div>

            <div className="row justify-content-center">
                {otherUploadsJSX}
            </div>

        </div>
        
            
            
        </Fade>
        );
        
    };

    const unfetchedView = () => {
        return <h1>Loading...</h1>;
    };


    return (
        <>{hasFetched? fetchedView() : unfetchedView()}</>
    );
};

export default Uploads;
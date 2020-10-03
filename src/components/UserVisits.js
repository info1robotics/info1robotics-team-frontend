import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-reveal/Fade';
import VisitsService from '../services/VisitsService';
var dateFormat = require('dateformat');

const timeDelta = (d1, d2) => {
    const delta = d1.getTime() - d2.getTime();
    const hours = Math.floor(delta / 3600000), minutes = Math.floor(delta % 3600000 / 60000), seconds = Math.floor(delta % 3600000 % 60000 / 1000);

    return {hours, minutes, seconds};
};


const UserVisit = (props) => {

    const simplifiedTime = (d) => {
        return dateFormat(d, "d.m.yyyy, H:M:s")
    };

    return (
    <Fade down duration={300} distance={"16px"}>
        <div className="col col-md-3">
            <div className="card rounded shadow border-0" style={{width: "100%"}}>
            <div className="card-body">
                <h5 className="card-title">
                    <svg viewBox="0 0 16 16" className="bi bi-person-fill" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                    {props.visit.user.username}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">Since {simplifiedTime(props.visit.startDate)}</h6>
                <p className="card-text"></p>
            </div>
            </div>
        </div>
    </Fade>
        
        
    );

}

const UserVisits = (props) => {

    const [inProgressVisitsJSX, setInProgressVisitsJSX] = useState([]);
    const [myVisit, setMyVisit] = useState({});
    const [inProgressTimer, setInProgressTimer] = useState("");
    const [hasFetched, setHasFetched] = useState(false);

    let checkXButton = useRef();

    const inProgressTimerTick = () => {
        if(myVisit.startDate) {
            const time = timeDelta(new Date(), new Date(myVisit.startDate));

            setInProgressTimer(`${time.hours}:${time.minutes}:${time.seconds}`);   
        }
    };

    const fetchInProgressVisits = () => {
        VisitsService.getInProgressVisits().then(data => {
            console.log(data);
            if(data.success) {
                setInProgressVisitsJSX(
                    data.visits.map(visit => <UserVisit visit={visit} key={visit._id} />)
                );
                if(hasFetched) checkXButton.current.removeAttribute("disabled");
            }
            setHasFetched(true);
        });

        VisitsService.getMyVisit().then(data => {
            if(data.success) {
                if(data.visit) {
                    setMyVisit(data.visit);
                } else {
                    setMyVisit({});
                }
                if(hasFetched) checkXButton.current.removeAttribute("disabled");
            }
        });

        
    };


    useEffect(() => {
        fetchInProgressVisits();
    }, []);

    useEffect(() => {
        const inProgressTimerInterval = setInterval(() => {

            inProgressTimerTick();
            
        }, 1000);

        return () => clearInterval(inProgressTimerInterval);
    }, [myVisit]);

    const getButtonCheckX = () => {

        const checkout = () => {
            if(checkXButton.current) {
                checkXButton.current.setAttribute("disabled", "disabled");
            }
            VisitsService.checkout().then(data => {
                if(data.success) {
                    fetchInProgressVisits();
                    setMyVisit({});
                    setInProgressTimer("");
                }
            });
        };
        
        const checkin = () => {
            if(checkXButton.current) {
                checkXButton.current.setAttribute("disabled", "disabled");
            }
            VisitsService.checkin().then(data => {
                if(data.success) {
                    fetchInProgressVisits();
                }
            });
        };

        if(myVisit.startDate) {
            return <button ref={checkXButton} className={`btn btn-lg btn-block btn-danger shadow mb-2 m-3`} onClick={checkout}>Exit lab</button>
        } else {
            return <button ref={checkXButton} className={`btn btn-lg btn-block btn-success shadow mb-2 m-3`} onClick={checkin}>Enter lab</button>
        }
    };

    const FetchedView = () => {
        return (
            <div>
                <div className="shadow-lg rounded round mb-3 bg-white d-flex align-items-center h-100 p-3">
                    <div className="container h-100 text-center">
                        {inProgressTimer !== ""? <h2 className="font-weight-bold">You've been in the lab for {inProgressTimer}.</h2> 
                        
                        : 

                        (!myVisit.startDate? <h2 className="font-weight-bold">You are away from the lab.</h2> : "LOADING...")}
                        <div className="row">
                            {getButtonCheckX()}
                        </div>
                        <div className="row h-100 justify-content-center">
                            {inProgressVisitsJSX}
                        </div>
                        
                    </div>
                </div>
            </div> 
        );
     };
    
    const UnfetchedView = () => {
        return <h1>Loading...</h1>
    }


    return (
    <Fade down duration={300} distance={"16px"}>
        { hasFetched? FetchedView() : UnfetchedView() }
    </Fade>
    );
};

export default UserVisits;
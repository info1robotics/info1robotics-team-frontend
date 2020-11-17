import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-reveal/Fade';
import VisitsService from '../services/VisitsService';
var dateFormat = require('dateformat');

const timeDelta = (d1, d2) => {
    const delta = d1.getTime() - d2.getTime();
    const hours = Math.floor(delta / 3600000), minutes = Math.floor(delta % 3600000 / 60000), seconds = Math.floor(delta % 3600000 % 60000 / 1000);

    return {hours, minutes, seconds};
};

const VisitStatusLabel = (props) => {

    const [inProgressTimer, setInProgressTimer] = useState("");

    useEffect(() => {
        inProgressTimerTick();
    }, [props.myVisit]);

    const inProgressTimerTick = () => {
        if(props.myVisit.startDate) {
            const time = timeDelta(new Date(), new Date(props.myVisit.startDate));

            setInProgressTimer(`${time.hours < 10? "0" : ""}${time.hours}:${time.minutes < 10? "0" : ""}${time.minutes}:${time.seconds < 10? "0" : ""}${time.seconds}`);   
        } else setInProgressTimer("");
    };


    useEffect(() => {
        const inProgressTimerInterval = setInterval(() => {

            inProgressTimerTick();
            
        }, 1000);
        return () => clearInterval(inProgressTimerInterval);
    }, [props.myVisit]);

    if(inProgressTimer !== "")
        return <h2 className="font-weight-bold">{`You've been in the lab for ${inProgressTimer}.`}</h2>;
    else if(!props.myVisit.startDate) 
        return <h2 className="font-weight-bold">You are away from the lab.</h2>;
    else return "LOADING...";
};

const CheckXButton = (props) => {

    let checkXButton = useRef();

    const getButtonCheckX = () => {

        const checkout = () => {
            if(checkXButton.current) {
                checkXButton.current.setAttribute("disabled", "disabled");
            }
            props.checkoutCallback();
        };
        
        const checkin = () => {
            if(checkXButton.current) {
                checkXButton.current.setAttribute("disabled", "disabled");
            }
            props.checkinCallback();
        };

        if(checkXButton.current && props.myVisit.startDate) {
            checkXButton.current.removeAttribute("disabled");
        }


        if(props.myVisit.startDate) {
            return <button ref={checkXButton} className={`btn btn-lg btn-block btn-danger shadow mb-2 m-3`} onClick={checkout} disabled={props.disabled}>Exit lab</button>
        } else {
            return <button ref={checkXButton} className={`btn btn-lg btn-block btn-success shadow mb-2 m-3`} onClick={checkin} disabled={props.disabled}>Enter lab</button>
        }
    };

    return (
        <div className="row">
            {getButtonCheckX()}
        </div>
    );
};

const VisitChoiceSolo = (props) => {
    
    const checkinCallback = () => {
        props.checkinCallback();
    }

    
    const checkoutCallback = () => {
        props.checkoutCallback();
    }
    return (
        <><CheckXButton myVisit={props.myVisit} checkinCallback={checkinCallback} checkoutCallback={checkoutCallback}  /></>
    )

};

const VisitChoiceMulti = (props) => {
    const [guests, setGuests] = useState("");


    const checkinCallback = () => {
        props.checkinCallback(guests);
    }

    const checkoutCallback = () => {
        props.checkoutCallback();
    }

    const onGuestsInputChangeHandler = (e) => {
        setGuests(e.target.value);
    };

    return (
        <>
            <div className="row">
                <input type="text" className="form-control mb-2 m-3" placeholder="Enter guest(s) name(s)" onChange={onGuestsInputChangeHandler} defaultValue={props.myVisit.guests} disabled={props.myVisit.startDate} />
            </div>
            <CheckXButton myVisit={props.myVisit} checkinCallback={checkinCallback} checkoutCallback={checkoutCallback} disabled={guests === "" && !props.myVisit.startDate}  />
        </>
    );
}
const UserVisit = (props) => {

    const simplifiedTime = (d) => {
        return dateFormat(d, "d.m.yyyy, H:M:s")
    };

    return (
    <>
        <div className="col col-md-3">
            <div className="card rounded shadow border-0" style={{width: "100%"}}>
            <div className="card-body">
                <h5 className="card-title">
                    <svg viewBox="0 0 16 16" className="bi bi-person-fill" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                    {props.visit.user.username + (props.visit.guests? ` (cu ${props.visit.guests})` : "")}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">Since {simplifiedTime(props.visit.startDate)}</h6>
                <p className="card-text"></p>
            </div>
            </div>
        </div>
    </>
        
        
    );

}

const VisitChoiceDialogue = (props) => {

    const soloBtnClicked = () => {
        props.soloCallback();
    };

    const multiBtnClicked = () => {
        props.multiCallback();
    };

    return (
        <div>
            <div className="row"><div className="col"><h3 className="text-center">Did you come with any guests?</h3></div></div>
            <div className="row">
                <div className="col-6"><div className="row"><button className={`btn btn-lg btn-primary btn-block shadow mb-2 m-3`} onClick={soloBtnClicked}>I'm on my own</button></div></div>
                <div className="col-6"><div className="row"><button className={`btn btn-lg btn-primary shadow btn-block mb-2 m-3`} onClick={multiBtnClicked}>I'm with someone</button></div></div>
            </div>
        </div>
    );
}

const UserVisits = (props) => {

    const [inProgressVisitsJSX, setInProgressVisitsJSX] = useState([]);
    const [myVisit, setMyVisit] = useState({});
    const [userChoice, setUserChoice] = useState(0);
    const [hasFetched, setHasFetched] = useState(false);

    let guestTextBox = useRef();

    useEffect(() => {
        fetchInProgressVisits();
        updateUserChoice();

    }, []);

    useEffect(() => {
        updateUserChoice();
    }, [myVisit]);


    const updateUserChoice = () => {
        if(myVisit.startDate) {
            if(myVisit.guests == "")
                setUserChoice(1);
            else setUserChoice(2);
        } else setUserChoice(0);
    };


    const fetchInProgressVisits = () => {
        VisitsService.getInProgressVisits().then(data => {
            console.log(data);
            if(data.success) {
                setInProgressVisitsJSX(
                    data.visits.map(visit => <UserVisit visit={visit} key={visit._id} />)
                );
            }
        });

        VisitsService.getMyVisit().then(data => {
            if(data.success) {
                if(data.visit) {
                    setMyVisit(data.visit);
                } else {
                    setMyVisit({});
                }
            }
            setHasFetched(true);
        });

        
    };

    const checkout = () => {
        VisitsService.checkout().then(data => {
            if(data.success) {
                fetchInProgressVisits();
            }
        });
    };


    const checkin = (guests) => {
        VisitsService.checkin(guests).then(data => {
            if(data.success) {
                fetchInProgressVisits();
            }
        });
    };

    const resetUserChoice = () => {
        setUserChoice(0);
    }


    const FetchedView = () => {

        let visitChoice = <VisitChoiceDialogue soloCallback={() => setUserChoice(1)} multiCallback={() => setUserChoice(2)} />;
        if(userChoice == 1) {
            visitChoice = <VisitChoiceSolo myVisit={myVisit} checkoutCallback={checkout} checkinCallback={checkin}/>;
        } else if(userChoice == 2) {
            visitChoice = <VisitChoiceMulti myVisit={myVisit} checkoutCallback={checkout} checkinCallback={checkin} />;
        }

        return (
            <div>
                <div className="shadow-lg rounded round mb-3 bg-white d-flex align-items-center h-100 p-3">
                    <div className="container h-100 text-center">
                        <VisitStatusLabel myVisit={myVisit}/>

                        {visitChoice}

                        {userChoice !== 0 && !myVisit.startDate? <button type="button" class="btn btn-lg btn-link font-weight-bold" onClick={resetUserChoice}>{`< Go Back`}</button> : null}
                        
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
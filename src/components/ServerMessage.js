import React from 'react';


const getStyle = (props) => {
    let baseClass = "alert ";
    if(!props.message.success)
        baseClass = baseClass + "alert-danger";
    else
        baseClass = baseClass + "alert-primary";
    return baseClass + " text-center";
    
}
const ServerMessage = (props) =>{ 
    return (
        <div className={getStyle(props) + " " + props.clsName} role="alert">
            {props.message.msgBody}
        </div>
    );
}

export default ServerMessage;
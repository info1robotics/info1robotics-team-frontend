import React from 'react';
import Fade from 'react-reveal/Fade';


const Home = () => {
    return (
    <Fade down duration={300} distance={"16px"}>
        <div style={{height: "85vh"}}>
            <div class="jumbotron jumbotron-fluid shadow-lg round mb-3 bg-white d-flex align-items-center h-100">
                <div class="container text-center">
                    <h1 class="display-4 font-weight-bold">Welcome!</h1>
                    <p class="lead">Click a link from the navbar on the top to start.</p>
                </div>
            </div>
        </div> 
    </Fade>
    );
};

export default Home;
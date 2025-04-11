import React, { useState, useEffect } from 'react';



import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
  }

const Home = () => {
    return(
        <div className={"border"}>
            <h1>Welcome to Visualize!</h1>
            <p>This app is intended to help readers visualize and immerse into stories better</p>
            <p>Click one of the options below for what you want to do!</p>
            <ButtonLink to="/chooseyourstory">Choose Your Story!</ButtonLink>
            <br></br>
            <p>Create your own story, querying for and choosing images ot make your own visual story!</p>
            <ButtonLink to="/ownstory">Visualize Your Own Images!</ButtonLink>
            <p>Take images you already have and visualize them!</p>
        </div>
    );
};

export default Home;
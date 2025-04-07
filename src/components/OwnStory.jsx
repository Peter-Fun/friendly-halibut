import React, { useState, useEffect } from 'react';



import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
  }

const OwnStory = () => {
    return(
        <div>
            <ButtonLink to="/">Go Back Home</ButtonLink>
            <h1>Visualize Your Images!</h1>
            <h2>Upload your own images and visualize them!</h2>

            <form classname = "upload-form">
                <label>
                    Your Image
                    <br></br>
                </label>
                <input type = "file" className = "file-input"/>
            </form>
            <ButtonLink to="/visualize">Visualize!!!</ButtonLink>
        </div>
    )

};

export default OwnStory;
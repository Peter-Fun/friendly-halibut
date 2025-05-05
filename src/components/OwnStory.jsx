import React, { useState, useEffect } from 'react';



import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
  }

const OwnStory = () => {
    const visualize = (e) => {
        e.preventDefault();

        const fileInput = document.querySelector('.file-input');
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file first!");
            return;
        }
        else{
            // Encode the file using the FileReader API
            const reader = new FileReader();
            reader.onloadend = () => {
                // Use a regex to remove data url part
                const base64String = reader.result
                    .replace('data:', '')
                    .replace(/^.+,/, '');
                fetch("https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/visualize", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        "image": base64String
                    })
                });
                console.log(base64String);
                // Logs wL2dvYWwgbW9yZ...
            };
            reader.readAsDataURL(file);
        }
    }
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
            <div onClick = {visualize}>
                <ButtonLink to={"/Visualize"}>Visualize!!!</ButtonLink>
            </div>
        </div>
    )

};

export default OwnStory;
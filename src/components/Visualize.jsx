import React, { useState, useEffect } from 'react'

import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
}

const Visualize = () => {
    const [image, update_image] = useState("");

    function Image(){
        VisualizedImage();
        if (image != ""){
            return <div>
                <img src={`data:image/jpeg;base64,${image}`} alt="Visualized" />
            </div>;
        }
        else{
            setTimeout(VisualizedImage, 1000);
            return <div>
                <p>Loading...</p>
            </div>;
            
        }
    }

    function VisualizedImage(){
        //alert("GET attempted");
        fetch(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/visualize`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => 
            update_image(data["message"]["image"])
        )
        .catch(error => console.error("Fetch error:", error));
    }

    return(
        <div>
            <h1>Visualized!</h1>
            <h2>Here is your visualized image!</h2>
            <Image />
            <ButtonLink to="/">Continue the Story</ButtonLink>
            <br></br>
            <ButtonLink to="/final">I'm done!</ButtonLink>
        </div>
    )

};

export default Visualize;
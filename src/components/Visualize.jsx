import React, { useState, useEffect } from 'react'

import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
}

const Visualize = () => {
    const [image, update_image] = useState("");

    const [imageTag, update_imageTag] = useState(<div>
        <p>Loading...</p>
    </div>);

    useEffect(() => {
        VisualizedImage();

        const interval = setInterval(() => {
            if (image != ""){
                Image();
                clearInterval(interval);
            }
            else{
                VisualizedImage();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [image]);
    

    function Image(){
        //alert("cry me a " + image);
        if (image != ""){
            update_imageTag(<div>
                <img src={`data:image/jpeg;base64,${image}`} alt="Visualized" />
            </div>);
            return;
        }
        else{
            update_imageTag(<div>
                <p>Loading...</p>
            </div>);
            return;
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
            {imageTag}
            <ButtonLink to="/">Continue the Story</ButtonLink>
            <br></br>
            <ButtonLink to="/final">I'm done!</ButtonLink>
        </div>
    )

};

export default Visualize;
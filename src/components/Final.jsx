import React, { useState, useEffect } from "react";
import { use } from "react";


import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
}

const Final = () => {
    const [imageindex, update_imageindex] = useState(0);
    const [images, update_images] = useState([]);
    const [imageDisplay, update_imageDisplay] = useState(<div>
        <p>Loading...</p>
    </div>);

    useEffect(() => {
        fetch(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/imagelist`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => 
            update_images(data["message"]["images"])

        )
        .catch(error => console.error("Fetch error:", error));
        showImage();
    }, [images]);

    const nextImage = () => {
        if (imageindex < images.length - 1){
            update_imageindex(imageindex + 1);
        }
        else{
            update_imageindex(0);
        }
        showImage();
    }

    const prevImage = () => {
        if (imageindex > 0){
            update_imageindex(imageindex - 1);
        }
        else{
            update_imageindex(images.length - 1);
        }
        showImage();
    }

    const showImage = () => {
        if (images.length > 0){
            update_imageDisplay(<div>
                <img src={`data:image/jpeg;base64,${images[imageindex]}`} alt="Visualized" />
            </div>);
        }
        else{
            update_imageDisplay(<div>
                <p>Loading...</p>
            </div>);
        }
    }

    const pdfify = (e) => {
        e.preventDefault();
        //alert("GET attempted");
        fetch(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/final`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) =>{
            if (!response.ok) {
                throw new Error("No PDF :(");
            }
            return response.blob();
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "visualized_story.pdf";
            a.click();
        })
        .catch(error => console.error("Fetch error:", error));
    }
    const clear = (e) => {
        e.preventDefault();
        //alert("GET attempted");
        fetch(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/clear`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => alert(data["message"]))
        .catch(error => console.error("Fetch error:", error));
    }
    return(
        <div>
            <h1>Final Product!</h1>
            <h2>Here is your visualized story!</h2>
            {imageDisplay}
            <button onClick={prevImage}>Previous Image</button>
            <button onClick={nextImage}>Next Image</button>
            <div>
                <button onClick={pdfify}>Download your pdf!</button>
            </div>
            <div onClick ={clear}>
                <button>Click here to reset your story!</button>
            </div>
            <ButtonLink to="/">Do it again!</ButtonLink>
        </div>
    )

};

export default Final;
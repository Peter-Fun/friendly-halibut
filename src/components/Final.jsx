import React from "react";


import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
}

const Final = () => {
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
            <button onClick={pdfify}>Download your pdf!</button>
            <div onClick ={clear}>
                <button>Click here to reset your story!</button>
            </div>
            <ButtonLink to="/">Do it again!</ButtonLink>
        </div>
    )

};

export default Final;
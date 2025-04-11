import React, { useState, useEffect } from 'react';
import axios from "axios";

const API_URL = "http://localhost:5000/data";

import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
  }

const ChooseYourStory = () => {
    const [story, update_story] = useState("");
    const [images, update_images] = useState([]);
    const [selected_image, update_selected_image] = useState(-1);

    const inputChange = (e) => {
        update_story(e.target.value);
    }

    const getData = (e) => {
        e.preventDefault();
        // alert(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`);
        console.log(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`);
        fetch(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => update_images(data["message"]["images"]))
        .catch(error => console.error("Fetch error:", error));
    };

    const visualize = (e) =>{
        e.preventDefault();
        if (selected_image != -1){
            //alert(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/visualize?image=${images[selected_image]}`);
            console.log(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/visualize?image=${images[selected_image]}`);
            fetch("https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/visualize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "image": images[selected_image]
                })
            })
        }
        else{
            alert("Please select an image first!");
        }
    }

    const imageSelect = (index) =>{
        update_selected_image(index);
        window.scrollBy({
            top: 3000, // Adjust the value to control scroll distance
            left: 0,
            behavior: 'smooth' // Optional: Adds smooth scrolling animation
        });
    }
    function Images(){
        if (images.length > 0){
            if (selected_image != -1){
                return <div>
                <h2>Select an Image</h2>
                <div>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={`data:image/jpeg;base64,${img}`}
                            alt={`Image ${index + 1}`}
                            onClick={() => imageSelect(index)}
                        />
                    ))}
                </div>
                <h2>Selected Image</h2>
                    <img
                        src={`data:image/jpeg;base64,${images[selected_image]}`}
                        alt="Selected"
                    />
                </div>
            }
            return <div>
                <h2>Select an Image</h2>
                <div>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={`data:image/jpeg;base64,${img}`}
                            alt={`Image ${index + 1}`}
                            onClick={() => imageSelect(index)}
                        />
                    ))}
                </div>
            </div>
        }
    }
    return(
        <div className="ChooseYourStory">
            <h1>Choose Your Story!</h1>
            <h2>Fill out the query below to find your images!</h2>

            <p>What do you want your story to be about?</p>
            <form onSubmit={getData} className="story-form">
                <label>
                    <input 
                        type="text"
                        value = {story}
                        placeholder="Your Story"
                        onChange={inputChange}

                    ></input>
                </label>
                <input type = "submit" value="Submit" className = "submit-button"/>
            </form>
            <Images/>
            <div onClick={visualize}>
                <ButtonLink to={(selected_image == -1) ? "" : "/Visualize"}>Go!</ButtonLink>
            </div>
        </div>
    )

};

export default ChooseYourStory;
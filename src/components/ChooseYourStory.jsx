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
    const [selected_image, update_selected_image] = useState(null);

    const inputChange = (e) => {
        update_story(e.target.value);
    }

    const getData = (e) => {
        e.preventDefault();
        alert(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`);
        console.log(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`);
        /*
        axios
            .get(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`)
            .then((response) => {
                alert(response.data.images);
                update_images(response.data.message);
            })
            .catch((error) => {
                alert("Error fetching data "+ error);
            });
        */
        fetch(`https://friendly-halibut-qx9q94px5q7hg6w-5000.app.github.dev/data?query=${(story)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => update_images(data.images))
        .catch(error => console.error("Fetch error:", error));

    };

    const imageSelect = (image) =>{
        update_selected_image(image);
    }
    return(
        <div className="ChooseYourStory">
            <ButtonLink to="/">Go Back Home</ButtonLink>
            <h1>Choose Your Story!</h1>
            <h2>Fill out the query below to find your images!</h2>

            <p>What do you want your story to be about?</p>
            <form onSubmit={getData} className="story-form">
                <label>
                    <input 
                        type="text"
                        value = {story}
                        onChange={inputChange}
                    
                    ></input>
                </label>
                <input type = "submit" value="Submit" className = "submit-button"/>
            </form>
            <ButtonLink to="/Visualize">Go!</ButtonLink>
            {images.length > 0 && (
                <div>
                    <h2>Select an Image</h2>
                    <div>
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={`data:image/jpeg;base64,${img}`}
                                alt={`Image ${index + 1}`}
                                onClick={() => imageSelect(img)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {selected_image && (
                <div>
                    <h2>Selected Image</h2>
                    <img
                        src={`data:image/jpeg;base64,${selected_image}`}
                        alt="Selected"
                    />
                </div>
            )}
        </div>
    )

};

export default ChooseYourStory;
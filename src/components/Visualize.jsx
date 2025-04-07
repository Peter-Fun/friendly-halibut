import React from "react";


import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
  }

const Visualize = () => {
    return(
        <div>
            <h1>Visualized!</h1>
            <h2>Here is your visualized image!</h2>
            <image alt="nothin lol"></image>
            <ButtonLink to="/">Continue the Story</ButtonLink>
            <br></br>
            <ButtonLink to="/final">I'm done!</ButtonLink>
        </div>
    )

};

export default Visualize;
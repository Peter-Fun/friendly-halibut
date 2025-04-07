import React from "react";


import { Link } from "react-router";

function ButtonLink({to, children}){
    return <Link to={to}><button>{children}</button></Link>;
  }

const Final = () => {
    return(
        <div>
            <h1>Final Product!</h1>
            <h2>Choose the Image You Want!</h2>
            <button>Download when it works</button>
            <ButtonLink to="/">Do it again!</ButtonLink>
        </div>
    )

};

export default Final;
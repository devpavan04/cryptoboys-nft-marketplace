import NavBar from "../components/Navbar/Navbar";
import React from "react";

const Container = props => {
    
    return <div>
        <NavBar auth={props.auth}/>
        <div>
            {props.children}
        </div>
    </div>
}

export default Container;
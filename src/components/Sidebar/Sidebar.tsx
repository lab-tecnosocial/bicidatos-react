import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"
const Sidebar = (props) => {


  return (
    <>
      <div className={`sidebar`}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
        
      
      </ul>
    </div>
      
    </>
  );
};

export default Sidebar;
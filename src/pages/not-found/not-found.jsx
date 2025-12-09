import React from 'react';
import "./not-found.scss";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div id='not-found'>
        <h1>404 <span>Sahifa topimadi</span></h1>
        <Link to="/">Bosh sahifa</Link>
    </div>
  )
}

export default NotFound
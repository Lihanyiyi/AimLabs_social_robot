import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Header component
export default function Header(props) {
    const navigate = useNavigate();

    // Function to handle the "Home" button click
    function handleHomeButtonClick() {
        const endWebgazer = async () => {
            await window.webgazer.end();
        }
        endWebgazer(); // End the webgazer instance when navigating back to the home page
        navigate("/"); // Navigate back to the home page
    }
   
    // Render the JSX representing the Header component
    return (
        <div className="navBar">
            {/* Display experiment details */}
            <div className='experimentDetails'>
                <ul>
                    <li>Experiment ID: <p>{props.experimentNumber}</p></li>
                    <li>Session: <p>{props.sessionNumber}</p></li>
                    <li>Trial: <p>{props.trialNum}</p></li>
                    <li>Target Type: <p>{props.targetType}</p></li>
                </ul>
            </div>
            {/* Render the "Home" button */}
            <button className='home-btn' onClick={() => handleHomeButtonClick()}>Home</button>
        </div>
        
    )
}

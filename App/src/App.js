// Import necessary modules from React and react-router-dom library
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

// Import the components used in the application
import Calibration from "./pages/Calibration";
import Experiment from "./pages/Experiment";
import Home from "./pages/Home";
import Main from "./pages/Components/Main";

// Define the main component named "App"
export default function App() {
  // State variables to store the experiment number, session number, and target type
  const [experimentNumber, setExperimentNumber] = useState(1);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [targetType, setTargetType] = useState("shapes");
  const [recordedChunks, setRecordedChunks] = useState([]);
  console.log(experimentNumber)
  // Return the JSX (React components) to be rendered
  return (
    <div>
      
      {/* React Router configuration using Routes and Route components */}
      <Routes>
      
        {/* Route for the home page */}
        {/* When the path is "/", it renders the Home component */}
        {/* It also passes down three functions as props to the Home component to update the state variables */}
        <Route
          path="/"
          element={
            <Home
              setExperimentNumber={setExperimentNumber}
              setSessionNumber={setSessionNumber}
              setTargetType={setTargetType}
            />
          }
        />

        {/* Route for the calibration page */}
        {/* When the path is "/calibration", it renders the Calibration component */}
        <Route path="/calibration" element={<Calibration />} />
        
        {/* Route for the experiment page */}
        {/* When the path matches "/experiment/*", it renders the Experiment component */}
        {/* It also passes down the state variables and the update functions as props to the Experiment component */}
        
        <Route
          path="/experiment/*"
          element={
            <Experiment
              experimentNumber={experimentNumber}
              sessionNumber={sessionNumber}
              targetType={targetType}
              setExperimentNumber={setExperimentNumber}
              setSessionNumber={setSessionNumber}
              setTargetType={setTargetType}
              setRecordedChunks={setRecordedChunks}
            />
          }
        />
        
      </Routes>
     
    </div>
  );
}

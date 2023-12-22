// Import necessary modules and styles
import React from "react";
import { useState, useRef, useEffect } from "react";
import "../App.css";
import Header from "./Components/Header";
import Main from "./Components/Main";
import h337 from 'heatmap.js';
import { startWebgazer } from "../utils/webgazerUtils";  
import { useNavigate } from 'react-router-dom';

// Define the Experiment component
export default function Experiment(props) {
  // Number of trials in the experiment
  let numOfTrials = 120;
  // State variables to manage the experiment progress, response time, gaze data, and API response
  const [trial, setTrial] = useState(0);
  const [time, setTime] = useState(Date.now());
  const [wrong, setWrong] = useState("");
  const [responseTime, setResponseTime] = useState({ 0: { Time: Date.now(), Wrong: false } });
  const [distructionData, setDistructionData] = useState({ "startTime": 0, "endTime": 0, "yawn": 0, "sneeze": 0, "sing": 0 });
  const [apiResponse, setApiResponse] = useState({ response: "" });
  const [webgazerIsSet, setWebgazerIsSet] = useState(false);
  const [start, setStart] = useState(true);
  

  // Refs for random elements and heatmap data
  const randomEltArr = useRef([]);
  const heatmapData = useRef([]);

  // Ref for heatmap configuration and last gaze data and time
  const config = useRef({
    radius: 25,
    maxOpacity: .5,
    minOpacity: 0,
    blur: .75
  });
  const lastTimeRef = useRef("");
  const lastGazeRef = useRef("");
  const webgazer = window.webgazer;
  window.saveDataAcrossSessions = true;
  
  
  // useEffect hook to check if the experiment trials are completed
  useEffect(() => {
    if (trial > numOfTrials) {
      download();
      generateAndDisplayHeatmap(heatmapData.current);
    }
  }, [trial]);

  // useEffect hook to fetch data from the API on component mount
  useEffect(() => {
    console.log("Fetching...");
    if(start){
      fetchDataFromApi("shapes").then((trials) => {
        setApiResponse({ response: trials }); // Save the fetched data in the state
      });
    }
    // fetchDataFromApi("shapes").then((trials) => {
    //   setApiResponse({ response: trials }); // Save the fetched data in the state
    // });
  }, [start]);

  // useEffect hook to initialize and remove webgazer, and set up the heatmap
  useEffect(() => {
    const initializeWebgazer = async () => {
      await startWebgazer();
      webgazer.showVideoPreview(false).showPredictionPoints(false).applyKalmanFilter(true);
      setWebgazerIsSet(true);
    }

    const removeWebgazer = async () => {
      webgazer.end();
    }

    initializeWebgazer();
    webgazer.removeMouseEventListeners();
    setupHeatmap();
    webgazer.setGazeListener(eyeListener);

    return () => {
      removeWebgazer();
      
    }
  }, []);

  // Function to fetch data from the API
  const fetchDataFromApi = async (targetType) => {
    try {
      const response = await fetch(`http://localhost:9000/api/trials/${targetType}`);
      const trials = await response.json();
      return trials;
    } catch (error) {
      console.error("ErrorWithApi", error);
      return [];
    }
  };

  // Function to generate and display the heatmap
  function generateAndDisplayHeatmap(data) {
    // Convert the heatmapData array to an object format expected by heatmap.js
    let heatmapDataObject = {
      max: 100, // Specify the maximum value for color intensity (adjust as needed)
      data: data.map(point => ({
        x: point.x,
        y: point.y,
        value: point.value
      }))
    };
    // Create a heatmap instance
    const heatmapInstance = h337.create(config.current);

    // Add the data to the heatmap instance
    heatmapInstance.setData(heatmapDataObject);

    // Create a new tab and append the heatmap canvas to it
    const newTab = window.open("", "_blank");
    newTab.document.body.appendChild(heatmapInstance._renderer.canvas);

    // Create an image element from the heatmap canvas
    const heatmapImage = new Image();
    heatmapImage.src = heatmapInstance._renderer.canvas.toDataURL();

    const blob = dataURLtoBlob(heatmapImage.src);
    // Create a download link for the image
    const downloadLink = newTab.document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `expt:_${props.experimentNumber}_session_${props.sessionNumber}.png`; // Specify the filename for the downloaded image

    // Simulate a click on the download link to trigger the download
    newTab.document.body.appendChild(downloadLink);
    downloadLink.setAttribute("download", `expt:_${props.experimentNumber}_session_${props.sessionNumber}.png`);
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Close the new tab
    newTab.close();
  }

  // Function to convert dataURL to Blob
  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Function to set up the heatmap
  function setupHeatmap() {
    // Don't use the mousemove listener
    document.addEventListener('click', async (event) => {
      webgazer.recordScreenPosition(event.clientX, event.clientY, 'click');
    });
    let height = window.innerHeight;
    console.log("height: ",height/2);
    let width = window.innerWidth;
    console.log("width: ",width/2);
    let container = document.getElementById('app');
    config.current.container = container;
  }

  // Function to handle the gaze data received from webgazer
  async function eyeListener(data, clock) {
    if (lastTimeRef.current === "") {
      lastTimeRef.current = clock;
    }

    if (!!lastGazeRef.current) {
      if (!!lastGazeRef.current.x && !!lastGazeRef.current.y) {
        let duration = clock - lastTimeRef.current;
        let point = {
          x: Math.floor(lastGazeRef.current.x),
          y: Math.floor(lastGazeRef.current.y),
          value: duration,
          time: Date.now()
        };

        heatmapData.current.push(point); // Store the gaze data point in the heatmapData array
      }
    }

    lastGazeRef.current = data;
    lastTimeRef.current = clock;
  }

  // Function to record the response time for each trial
  function ResponseTime() {
    const currentTime = Date.now();
    setTrial((prev) => prev + 1);
    setResponseTime((prevResponseTime) => ({
      ...prevResponseTime,
      [trial]: {
        Time: Math.floor(currentTime - time),
        Evaluation: wrong,
      },
    }));
    setTime(Date.now());
    trial === numOfTrials && setDistructionData(prev => ({
      ...prev,
      "endTime": Date.now()
    }));
  }

  // Function to download the experiment data
  function download() {
    // Download the response time and distruction data
    const responseTimeLink = document.createElement("a");
    const responseTimeFile = new Blob([JSON.stringify(responseTime) + "\n\nDistraction Data:\n\n" + JSON.stringify(distructionData)], {
      type: "text/plain",
    });
    responseTimeLink.href = URL.createObjectURL(responseTimeFile);
    responseTimeLink.download = `expt:_${props.experimentNumber}_session_${props.sessionNumber}_Response_Time.txt`;
    responseTimeLink.click();
    URL.revokeObjectURL(responseTimeLink.href);

    // Download the random elements
    const randomElementsLink = document.createElement("a");
    const randomElementsFile = new Blob([JSON.stringify(apiResponse)], {
      type: "text/plain",
    });
    randomElementsLink.href = URL.createObjectURL(randomElementsFile);
    randomElementsLink.download = `expt:_${props.experimentNumber}_session_${props.sessionNumber}_Random_Elements.txt`;
    randomElementsLink.click();
    URL.revokeObjectURL(randomElementsLink.href);

    // Download the raw gaze data
    const rawGazeDataLink = document.createElement("a");
    const rawGazeDataFile = new Blob([JSON.stringify(heatmapData.current)], {
      type: "text/plain",
    });
    rawGazeDataLink.href = URL.createObjectURL(rawGazeDataFile);
    rawGazeDataLink.download = `expt:_${props.experimentNumber}_session_${props.sessionNumber}_Raw_Gaze_Data.txt`;
    rawGazeDataLink.click();
    URL.revokeObjectURL(rawGazeDataLink.href);
  }

  // Function to handle wrong responses
  function handleWrong(w) {
    setWrong(w);
  }
  
  // Render the JSX representing the Experiment component
  return (
    <div id="app" className="app">
      <Header
        trialNum={trial}
        experimentNumber={props.experimentNumber}
        sessionNumber={props.sessionNumber}
        targetType={props.targetType}
        setExperimentNumber={props.setExperimentNumber}
        setSessionNumber={props.setSessionNumber}
        setTargetType={props.setTargetType}
      />
      { (trial < numOfTrials+1  ? (
        <Main
          experimentNumber={props.experimentNumber}
          sessionNumber={props.sessionNumber}
          targetType={props.targetType}
          setTime={setTime}
          responseTime={responseTime}
          ResponseTime={ResponseTime}
          handleWrong={handleWrong}
          trial={trial}
          handleDistructionData={setDistructionData}
          randomEltArr={randomEltArr}
          trials={apiResponse.response}
          webgazerIsSet={webgazerIsSet}
        />

      ) : parseInt(props.sessionNumber )=== 8 ?( // if the session number is 8, then end the experiment，the application will not close, but it will show information below
        <div className="end-trail">
          <h1><font color="white">Thank you for your participation!</font></h1>
          <h1><font color="white">Please feel free to leave!</font></h1>
          </div>
        ):(
        <div className="end-trail">
          <h1>End of Session.</h1>        
          <button className="colors-btn" onClick={() => {
            if (parseInt(props.sessionNumber )=== 8) { //ignore the session number ===8 condition
              window.close();
            } 
            else{
              props.setSessionNumber((prev) => (parseInt(prev) + 1)) // if the session number is not 8, then go to next session
              props.setTargetType((prev) => { // change the target type
              return ((parseInt(props.sessionNumber)===1) || (parseInt(props.sessionNumber)===6)||(parseInt(props.sessionNumber)===7)) ? "shapes" : "colors"
              })
            // navigate("/experiment")
              setTrial(0)
              setStart(false)
              if((parseInt(props.sessionNumber)===1) || (parseInt(props.sessionNumber)===6)||(parseInt(props.sessionNumber)===7)){
                fetchDataFromApi("shapes").then((trials) => { 
                  setApiResponse({response: trials}); // Save the fetched data in the state
                  heatmapData.current = []
              });
              }
              else{
                fetchDataFromApi("colors").then((trials) => {
                  setApiResponse({response: trials}); // Save the fetched data in the state
                  heatmapData.current = []
              });
              }
              // fetchDataFromApi().then((trials) => {
              //   setApiResponse({response: trials}); // Save the fetched data in the state
              // });
              // heatmapData.current = []
            }
            
          }}>
            Next
          </button>
        </div>
      ))}
    </div>
  )
}
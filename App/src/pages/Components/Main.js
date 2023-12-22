import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import play from "../Images/play.png";
import { startRecording,stopRecording } from "../../utils/videorecorder";
// import { use } from "../../../../api/routes/trialsAPI";


//randomize the distructions
//make 20% of the shapes target per minute
// Define the Main component
export default function Main(props) {
  const [start, setStart] = useState(false);
  const [url, setUrl] = useState(null);
  const [qtrobot, setQtrobot] = useState({});
  const [timerWidth, setTimerWidth] = useState(400);
  const [randomShape, setRandomShape] = useState("");
  const distructions = useRef(["yawn", "sneeze", "sing"])
  const [randomElt, setRandomElt] = useState("");
  const trial= useRef(props.trial);
  
  
  

  
  
  // Function to connect to QTrobot using the provided URL
  // change the experiment number to connect to QTrobot
  useEffect(() => {
      var _url = prompt(
        "Please enter QTrobot rosbridge url:",
        "ws://192.168.100.2:9091"
      );
      _url = _url == null ? "ws://127.0.0.1:9091" : _url;
      if (url !== _url) {
        setUrl(_url);
      }
      console.log("connecting to QTrobot (please wait...)");
    }, []);
  
    // Function to create the QTrobot instance
  useEffect(() => {
    // eslint-disable-next-line no-undef
      setQtrobot(() => new QTrobot({
        url: url,
        connection: function () {
          console.log("connected to " + url);
        },
        error: function (error) {
          console.log(error);
        },
        close: function () {
          console.log("disconnected.");
        },
      }) 
    );
  }, [url]);
 
  
  // Function to update the random element state when the trials data changes
  useEffect(() => {
    if (props.trials) {
    setRandomElt(props.trials)
    if(props.trials !== "")  setRandomShape( <div className={props.trials[props.trial].shape} style={(props.trials[props.trial].shape === "Triangle") ?
    { "border-bottom": `150px solid ${props.trials[props.trial].color}` }
    : { "background-color": props.trials[props.trial].color }}>
  </div>)}
  },[props.trials]) 

  useEffect(() => { // here add the conditions for checking shape or color based on session number
    
    if (start) { // checking pass
      window.webgazer.removeMouseEventListeners();
      console.log("volume set to 60");
      console.log("trial: ", props.trial);
      qtrobot.set_volume(30); //change to the desired volume
      //checker function
      
      const interval = setInterval(() => {
        //checks if the users "response" is correct or incorrect
        if (parseInt(props.sessionNumber)=== 1 || parseInt(props.sessionNumber) === 2||parseInt(props.sessionNumber)=== 7 || parseInt(props.sessionNumber) === 8) {
          console.log("session number: ", props.sessionNumber)
          console.log("check for shape")
          if (randomElt[props.trial-1].shape === randomElt[props.trial-1].prevShape){
            props.handleWrong("Incorrect Pass")
            } else {
            props.handleWrong("Correct Pass");
            setTimerWidth(400);
            }

        }

        else{
          if (randomElt[props.trial-1].color === randomElt[props.trial-1].prevColor){
            props.handleWrong("Incorrect Pass")
            } else {
            props.handleWrong("Correct Pass");
            setTimerWidth(400);
            }
        }
        setRandomShape(() => RandomShape());
        props.ResponseTime();        
      }, 1000);
      const visual_interval = setInterval(() => {
        setTimerWidth((prev) => prev - 4);
      }, 10); //creates a visual timer....might not be working correctly if webgazer is running
      return () => {
        clearInterval(interval);
        clearInterval(visual_interval);
        setTimerWidth(400);
      };
    }
  
  }, [props.trial]);

  useEffect(() => {
    console.log(props.experimentNumber)
    console.log(props.sessionNumber)
    console.log(props.targetType)
    // here add conditions to control whether to do the distruction session or not
    if ((parseInt(props.sessionNumber)%2 === 1 && parseInt(props.sessionNumber) <= 4)|| (parseInt(props.sessionNumber) === 5)||(parseInt(props.sessionNumber) === 8)) {
    console.log("random distruction")
    if (start) {
      
      const oneMinInterval = setInterval(() => {
        //Sends a random distruction after the start of the experiment or 
        //the last distruction.
        // console.log(trial)
        if ((parseInt(props.sessionNumber)%2 === 1 && parseInt(props.sessionNumber) <= 4)|| (parseInt(props.sessionNumber) === 5)||(parseInt(props.sessionNumber) === 8)) {
          const randomInterval = setRandomInterval(randomDistruction, 10000, 30000); // currently 10000, 30000 is useless, usage for these numbers, please see setrandominterval function
          return () => {
            randomInterval.clear();
      };
        }
        }, 40000); //one distruction per 40 seconds, can change to any other times
      return () => {
        clearInterval(oneMinInterval)
      }
    }
  }
  }, [start, distructions]);
  useEffect(() => {
    //Random interval
    // here add conditions to control whether to do the distruction session or not, you need to both this and the one above to change the conditions to do distraction
    if ((parseInt(props.sessionNumber)%2 === 1 && parseInt(props.sessionNumber) <= 4)|| (parseInt(props.sessionNumber) === 5)||(parseInt(props.sessionNumber) === 8)) {
      console.log("random interval")
      if (start) {
        if ((parseInt(props.sessionNumber)%2 === 1 && parseInt(props.sessionNumber) <= 4)|| (parseInt(props.sessionNumber) === 5)||(parseInt(props.sessionNumber) === 8)) {
          const startingRandomInterval = setRandomInterval(randomDistruction, 10000, 30000);
          return () => {
            startingRandomInterval.clear();
        };
      }
    }
  }
  }, [start])
  //handle key down event
  useEffect (() => {
    document.addEventListener('keydown', handleKeyDown, true);

    return () => document.removeEventListener('keydown', handleKeyDown,true)
  }, [start,props.trial]); 
  //random interval function
  const setRandomInterval =(intervalFunction, minDelay, maxDelay) => {
    let timeout;
    const timeoutFunction = () => {
      intervalFunction();
    };
    const delay=10000;
    // to use the minDelay and maxDelay, please use the following line of code
    //const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    timeout = setTimeout(timeoutFunction, delay);
    return {
      clear() { clearTimeout(timeout) },
    };
  };
  
  //Random distruction function 

  function randomDistruction() {
    let distruction = distructions.current[Math.floor(Math.random() * (distructions.current.length - 1 - 0 + 1))];
    distructions.current.splice(distructions.current.indexOf(distruction),1)
    switch (distruction) {
      case "yawn":
        qtrobot.show_emotion('QT/yawn', qtrobot.play_gesture('QT/yawn'));
        logDistruction("yawn")
        break;
      case "sneeze":
        qtrobot.show_emotion('QT/with_a_cold_sneezing', qtrobot.play_audio('sneeze'));
        logDistruction("sneeze")
        break;
      case "sing":
        qtrobot.talk_audio('QT/5LittleBunnies');
        logDistruction("sing")
        break;
      default:
        qtrobot.show_emotion('yawn')
      
    }
  }
  // update the current value of trial here, so that the distraction data is correct
  useEffect(() => {
    trial.current = props.trial;
  },[props.trial])
  //logs the time and the trial at which a distruction occured
  function logDistruction(type){
    console.log("distruction");
    props.handleDistructionData((prev) => ({
      ...prev,
      [type] : `${Date.now()} (trial: ${trial.current})`
    }))
  }

  //checks if the user's click response is correct or not.
  function handleClick() {
    props.ResponseTime();
    if(parseInt(props.sessionNumber)=== 1 || parseInt(props.sessionNumber) === 2||parseInt(props.sessionNumber)=== 7 || parseInt(props.sessionNumber) === 8){
      (randomElt[props.trial-1].shape === randomElt[props.trial-1].prevShape
        ) ? props.handleWrong("Correct Click")
          : props.handleWrong("Incorrect Click");
    }
    else{
      (randomElt[props.trial-1].color === randomElt[props.trial-1].prevColor
        ) ? props.handleWrong("Correct Click")
          : props.handleWrong("Incorrect Click");
    }
    setRandomShape(() => RandomShape());
    setTimerWidth(400);
  }

  // handles enter and space key down events
  function handleKeyDown(e) {
    
    if (start){
    e.preventDefault();
    if (e.key === "Enter" || e.key === " "){
      
      handleClick();
      setTimerWidth(400);
    }}
    else {
      e.preventDefault();
      if (e.key === "Enter" || e.key === " ") handleStart();
      setTimerWidth(400);
    }
  }

  //returns a random shape JSX element
  function RandomShape() {
    return <div className={randomElt[props.trial].shape} style={(randomElt[props.trial].shape === "Triangle") ?
      { "border-bottom": `150px solid ${randomElt[props.trial].color}` }
      : { "background-color": randomElt[props.trial].color }}>
    </div>;
  }
  
  //handles the start of the experiment
  function handleStart() {
    setStart(true);
    console.log("experiment started");
    props.handleDistructionData((prev) => ({
      ...prev,
      "startTime": Date.now()
    }));
    
    props.setTime(Date.now());
    props.ResponseTime();
    
    
    
    
  }
  return (props.webgazerIsSet && randomElt !== "" ? (
    !start ? (
    <div id="main" className="main">
      <h1><font color="white"> For this session: Only focus on {props.targetType}.</font></h1>
    <h1><font color="white"> Click using the mouse once you see two consecutive same <b><font color="red">{props.targetType}</font></b> regardless of all other factors</font></h1>
      <h1><font color="white"> Click on the play button once you are ready</font></h1>
      <img className="play-btn" onClick={() => handleStart()} src={play} alt="play"/>
    </div>
  ) : (

    <div id="main" className="main">
      <div className="prompt">
        {randomShape}
        {/* {props.numbers && <p>{RandomSymbol()}</p>}
          {props.shapes && RandomShape()} */}
      </div>
      <div className="visual-time" style={{ width: `${timerWidth}px` }}></div>
      <div className="response" onClick={() => handleClick()}>
        <span className="checkmark">
          {/* <div className="checkmark_circle"></div> */}
          <div className="checkmark_stem"></div>
          <div className="checkmark_kick"></div>
        </span>
      </div>
    </div>
  )):<div className="main"><div className="loader"></div></div>)
}



// if (parseInt(props.sessionNumber)%4 === 1 || parseInt(props.sessionNumber)%4 === 0) {
      //   const interval = setInterval(() => {
      //     if (randomElt[props.trial-1].shape === randomElt[props.trial-1].prevShape){
      //       props.handleWrong("Incorrect Pass")
      //       } else {
      //       props.handleWrong("Correct Pass");
      //       setTimerWidth(400);
      //       }
      //       setRandomShape(() => RandomShape());
      //       props.ResponseTime();
      //   }, 1000);
      // }
      // else{
      //   const interval = setInterval(() => {
      //     if (randomElt[props.trial-1].color === randomElt[props.trial-1].prevColor){
      //       props.handleWrong("Incorrect Pass")
      //       } else {
      //       props.handleWrong("Correct Pass");
      //       setTimerWidth(400);
      //       }
      //       setRandomShape(() => RandomShape());
      //       props.ResponseTime();
      //   }, 1000);
      // }
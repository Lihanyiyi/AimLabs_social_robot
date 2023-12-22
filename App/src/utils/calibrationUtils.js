// import { use } from '../../../api/routes/trialsAPI';
import calculatePrecision from './precision_calculator';
import swal from 'sweetalert';


const webgazer = window.webgazer;

export const handleCalibrationPointClick = (id, calibrationPoints, setCalibrationPoints, pointCalibrate, handlePointCaliberate, canvas, navigate) => { 
  const updatedPoints = calibrationPoints;
  let updatedPointCaliberate = pointCalibrate
    if (!updatedPoints[id]) {
        updatedPoints[id] = 0;
      }
      updatedPoints[id]++;      
    if (updatedPoints[id] === 5) {
        document.getElementById(id).style.backgroundColor = 'yellow';
        document.getElementById(id).setAttribute('disabled', 'disabled');
        updatedPointCaliberate = pointCalibrate + 1;
        handlePointCaliberate((pointCalibrate + 1));
      } else if (updatedPoints[id] < 5) {
        const opacity = 0.2 * updatedPoints[id] + 0.2;
        document.getElementById(id).style.opacity = opacity;
      }
      // Show the middle calibration point after all other points have been clicked.
    if (updatedPointCaliberate === 8) {
            document.getElementById('Pt5').style.removeProperty('display');
        }
    if (updatedPointCaliberate >= 9) {
        // Hide all calibration points except the middle one
        document.querySelectorAll('.Calibration').forEach((i) => {
            i.style.display = 'none';
        });
        document.getElementById('Pt5').style.removeProperty('display');

        // Clear the canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  
        // Calculate the accuracy
        calcAccuracy(setCalibrationPoints, handlePointCaliberate, canvas, navigate);
      }
      setCalibrationPoints(updatedPoints);
  };
  // export const handlePointCaliberateChange = ()
  const calcAccuracy = (setCalibrationPoints, handlePointCaliberate, canvas, navigate) => {
    
    swal({
        title: "Calculating measurement",
        text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
        closeOnEsc: false,
        allowOutsideClick: false,
        closeModal: true
      }).then(() => {
        webgazer.params.storingPoints = true; // start storing the prediction points
        setTimeout(() => {
            webgazer.params.storingPoints = false; // stop storing the prediction points
            const past50 = webgazer.getStoredPoints(); // retrieve the stored points
            const precision_measurement = calculatePrecision(past50);
            // const accuracyLabel = "<a>Accuracy | " + precision_measurement + "%</a>";
            // document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
            swal({
              title: "Your accuracy measure is " + precision_measurement + "%",
              allowOutsideClick: false,
              buttons: {
                cancel: "Recalibrate",
                confirm: true,
              }
            }).then(isConfirm => {
              if (isConfirm) {
                ClearCanvas(canvas);
                navigate('/experiment');
              } else {
                // ClearCanvas(canvas);
                //  ClearCalibration(setCalibrationPoints, handlePointCaliberate);
                //  ShowCalibrationPoint();
                webgazer.clearData();
                
                // handleRestart(setCalibrationPoints, handlePointCaliberate, canvas);
                window.location.reload(false);
                
                
              }
            });
          }, 5000);
        });
  };
  const PopUpInstruction = (canvas) => {
    ClearCanvas(canvas);
    swal({
      title: 'Calibration',
      text:
        'Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.',
      buttons: {
        cancel: false,
        confirm: true,
      },
    }).then((isConfirm) => {
      
      ShowCalibrationPoint();
    });
  };

  const ShowCalibrationPoint = () => {
    document.querySelectorAll('.Calibration').forEach((i) => {
      i.style.removeProperty('display');
    });
    document.getElementById('Pt5').style.setProperty('display', 'none');
  };

  const ClearCalibration = (setCalibrationPoints, handlePointCaliberate) => {
    
    
    document.querySelectorAll('.Calibration').forEach((i) => {
      i.style.backgroundColor = 'red';
      i.style.opacity = '0.2';
      i.removeAttribute('disabled');
    });

    setCalibrationPoints({});
    handlePointCaliberate(0);
  };

  const ClearCanvas = (canvas) => {
    document.querySelectorAll('.Calibration').forEach((i) => {
      i.style.setProperty('display', 'none');
    });
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  export const handleRestart = (setCalibrationPoints, handlePointCaliberate, canvas) => {
    webgazer.clearData();
    ClearCalibration(setCalibrationPoints, handlePointCaliberate);
    PopUpInstruction(canvas);
  };
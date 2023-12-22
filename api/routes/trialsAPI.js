const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    let randomElt = { "shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor": "" };
    let randomEltArr = []
    const shapes = ["Circle", "Rectangle", "Triangle", "Diamond"]; // define the shape type
    const colors = ["#FFFFFF", "#f5da69", "#db9914", "#ee27f5"]; // define the colors
    let count = 0;
    let percentage = 0;
    let start = false;
    // app.get('/', (req, res) => {
    //     res.send(randomEltArr);
    // })
    while (percentage != 20) { // make sure that the consecutive shapes/colors is around 20% during the whole session
        const pTarget = 0.2
        randomEltArr = []
        count = 0
        randomElt = { "shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor": "" };
        start = false
        for (let i = 0; i < 120; i++) { // 120 is the number of trials in total, you can change it based on time
            let rand = Math.random()
            let sVc = Math.random()
            if (!start) {
                start = true;
                randomElt = ({
                    "shape": shapes[Math.floor(Math.random() * (shapes.length))],
                    "color": colors[Math.floor(Math.random() * (colors.length))],
                    "prevShape": randomElt.shape,
                    "prevColor": randomElt.color
                })
                if (rand <= pTarget) {
                    count = count + 1
                    // console.log(count)
                    randomElt = ({
                        ...randomElt,
                        "nextShape": sVc < 0.5 ? randomElt.shape : shapes[Math.floor(Math.random() * (shapes.length))],
                        "nextColor": sVc >= 0.5 ? randomElt.color : colors[Math.floor(Math.random() * (colors.length))]
                    })
                } else {
                    let newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                    let newColor = colors[Math.floor(Math.random() * (colors.length))]
                    while (newShape === randomElt.shape || newColor === randomElt.color) {
                        newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                        newColor = colors[Math.floor(Math.random() * (colors.length))]
                    }
                    randomElt = ({
                        ...randomElt,
                        "nextShape": newShape,
                        "nextColor": newColor
                    })
                }
            } else {
                randomElt = ({
                    "shape": randomElt.nextShape,
                    "color": randomElt.nextColor,
                    "prevShape": randomElt.shape,
                    "prevColor": randomElt.color
                })
                if (rand <= pTarget) {
                    count = count + 1
                    randomElt = ({
                        ...randomElt,
                        "nextShape": sVc < 0.5 ? randomElt.shape : shapes[Math.floor(Math.random() * (shapes.length))],
                        "nextColor": sVc >= 0.5 ? randomElt.color : colors[Math.floor(Math.random() * (colors.length))]
                    })
                } else {
                    let newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                    let newColor = colors[Math.floor(Math.random() * (colors.length))]
                    while (newShape === randomElt.shape || newColor === randomElt.color) {
                        newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                        newColor = colors[Math.floor(Math.random() * (colors.length))]
                    }
                    randomElt = ({
                        ...randomElt,
                        "nextShape": newShape,
                        "nextColor": newColor
                    })
                }
            }
            randomEltArr.push(randomElt);
        }
        percentage = (count / 120) * 100; // calculate the percentage of consecutive shapes/colors, do not forget to change if you change the number of trials
    }
    console.log("Done!!!")
    res.send(randomEltArr)
});
// similiar to the previous one, but this one is for shapes only
router.get("/shapes", (req, res) => {
    let randomElt = { "shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor": "" };
    let randomEltArr = []
    const shapes = ["Circle", "Rectangle", "Triangle", "Diamond"];
    const colors = ["#FFFFFF", "#f5da69", "#db9914", "#ee27f5"];
    let count = 0;
    let percentage = 0;
    let start = false;
    // app.get('/', (req, res) => {
    //     res.send(randomEltArr);
    // })
    while (percentage != 20) {
        const pTarget = 0.2
        randomEltArr = []
        count = 0
        randomElt = { "shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor": "" };
        start = false
        for (let i = 0; i < 120; i++) { // 120 is the number of trials in total, you can change it based on time
            let rand = Math.random()
            if (!start) {
                start = true;
                randomElt = ({
                    "shape": shapes[Math.floor(Math.random() * (shapes.length))],
                    "color": colors[Math.floor(Math.random() * (colors.length))],
                    "prevShape": randomElt.shape,
                    "prevColor": randomElt.color
                })
                if (rand <= pTarget) {
                    count = count + 1
                    // console.log(count)
                    randomElt = ({
                        ...randomElt,
                        "nextShape": randomElt.shape ,
                        "nextColor": colors[Math.floor(Math.random() * (colors.length))]
                    })
                } else {
                    let newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                    let newColor = colors[Math.floor(Math.random() * (colors.length))]
                    while (newShape === randomElt.shape || newColor === randomElt.color) {
                        newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                        newColor = colors[Math.floor(Math.random() * (colors.length))]
                    }
                    randomElt = ({
                        ...randomElt,
                        "nextShape": newShape,
                        "nextColor": newColor
                    })
                }
            } else {
                randomElt = ({
                    "shape": randomElt.nextShape,
                    "color": randomElt.nextColor,
                    "prevShape": randomElt.shape,
                    "prevColor": randomElt.color
                })
                if (rand <= pTarget) {
                    count = count + 1
                    
                    randomElt = ({
                        ...randomElt,
                        "nextShape": randomElt.shape,
                        "nextColor": colors[Math.floor(Math.random() * (colors.length))]
                    })
                } else {
                    let newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                    let newColor = colors[Math.floor(Math.random() * (colors.length))]
                    while (newShape === randomElt.shape || newColor === randomElt.color) {
                        newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                        newColor = colors[Math.floor(Math.random() * (colors.length))]
                    }
                    randomElt = ({
                        ...randomElt,
                        "nextShape": newShape,
                        "nextColor": newColor
                    })
                }
            }
            randomEltArr.push(randomElt);
        }
        percentage = (count / 120) * 100; // calculate the percentage of consecutive shapes/colors, do not forget to change if you change the number of trials
    }
    console.log("Done!!!")
    res.send(randomEltArr)
});
// similiar to the previous one, but this one is for colors only
router.get("/colors", (req, res) => {
    let randomElt = { "shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor": "" };
    let randomEltArr = []
    const shapes = ["Circle", "Rectangle", "Triangle", "Diamond"];
    const colors = ["#FFFFFF", "#f5da69", "#db9914", "#ee27f5"];
    let count = 0;
    let percentage = 0;
    let start = false;
    // app.get('/', (req, res) => {
    //     res.send(randomEltArr);
    // })
    while (percentage != 20) {
        const pTarget = 0.2
        randomEltArr = []
        count = 0
        randomElt = { "shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor": "" };
        start = false
        for (let i = 0; i < 120; i++) { // 120 is the number of trials in total, you can change it based on time
            let rand = Math.random()
            if (!start) {
                start = true;
                randomElt = ({
                    "shape": shapes[Math.floor(Math.random() * (shapes.length))],
                    "color": colors[Math.floor(Math.random() * (colors.length))],
                    "prevShape": randomElt.shape,
                    "prevColor": randomElt.color
                })
                if (rand <= pTarget) {
                    count = count + 1
                    // console.log(count)
                    randomElt = ({
                        ...randomElt,
                        "nextShape": shapes[Math.floor(Math.random() * (shapes.length))],
                        "nextColor": randomElt.color 
                    })
                } else {
                    let newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                    let newColor = colors[Math.floor(Math.random() * (colors.length))]
                    while (newShape === randomElt.shape || newColor === randomElt.color) {
                        newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                        newColor = colors[Math.floor(Math.random() * (colors.length))]
                    }
                    randomElt = ({
                        ...randomElt,
                        "nextShape": newShape,
                        "nextColor": newColor
                    })
                }
            } else {
                randomElt = ({
                    "shape": randomElt.nextShape,
                    "color": randomElt.nextColor,
                    "prevShape": randomElt.shape,
                    "prevColor": randomElt.color
                })
                if (rand <= pTarget) {
                    count = count + 1
                    // console.log(count)
                    randomElt = ({
                        ...randomElt,
                        "nextShape": shapes[Math.floor(Math.random() * (shapes.length))],
                        "nextColor": randomElt.color 
                    })
                } else {
                    let newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                    let newColor = colors[Math.floor(Math.random() * (colors.length))]
                    while (newShape === randomElt.shape || newColor === randomElt.color) {
                        newShape = shapes[Math.floor(Math.random() * (shapes.length))]
                        newColor = colors[Math.floor(Math.random() * (colors.length))]
                    }
                    randomElt = ({
                        ...randomElt,
                        "nextShape": newShape,
                        "nextColor": newColor
                    })
                }
            }
            randomEltArr.push(randomElt);
        }
        percentage = (count / 120) * 100; // calculate the percentage of consecutive shapes/colors, do not forget to change if you change the number of trials
    }
    console.log("Done!!!")
    res.send(randomEltArr)
});

module.exports = router;
import { fabric } from "fabric";

//import fabric, export AddTextBox funciton into canvas
//textbox button in canvas only

export const AddTextBox = (canvas) => {
  const randomTop = Math.floor(Math.random() * (300 - 30) + 30);
  const randomLeft = Math.floor(Math.random() * (600 - 20) + 20);
  let text = new fabric.Textbox("Your text here...", {
    width: 300,
    height: 300,
    top: 5,
    left: 5,
    hasControls: true, //this lets you rotate the box/adjust sizing the way you can with shapes
    fontSize: 25,
    fontFamily: "Verdana", //'Comic Sans MS'
    top: randomTop,
    left: randomLeft,
  });

  canvas.add(text);
  canvas.renderAll();
};

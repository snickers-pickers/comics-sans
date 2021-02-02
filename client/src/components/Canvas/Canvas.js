import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';
import { Circle, redSquare } from '../Shapes/Circle';
import image from '../../assets/girls.jpg';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import '../../styles/canvas.css';
import { fourPanel, threePanel, sixPanel } from './Templates';
//import { GithubPicker } from 'react-color';

const Canvas = (props) => {
  const [canvas, setCanvas] = useState('');

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  let windowHeightRatio = Math.floor(0.85 * window.innerHeight);
  let windowWidthRatio = Math.floor(0.85 * window.innerWidth);

  const initCanvas = () =>
    new fabric.Canvas('canvas', {
      //1:1 ratio
      height: windowHeightRatio,
      width: windowWidthRatio,
      backgroundColor: 'white',
    });

  const addSquare = (canvas) => {
    canvas.add(redSquare);
    canvas.renderAll();
  };

  const save = () => {
    var canvas = document.getElementById('canvas');
    canvas.toBlob(function (blob) {
      saveAs(blob, 'comic.png');
    });
  };

  const addCircle = (canvas) => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: 'blue',
      stroke: 'green',
      strokeWidth: 3,
    });
    canvas.add(circle);
    canvas.renderAll();
  };

  const addImage = (canvas) => {
    // svgs will not work
    new fabric.Image.fromURL(image, function (img) {
      img.scale(0.1).set('flipX', true);
      canvas.add(img);
      canvas.renderAll();
    });
  };

  const removeObject = () => {
    let activeObject = canvas.getActiveObjects();
    if (activeObject) {
      canvas.discardActiveObject();
      activeObject.forEach(function (object) {
        canvas.remove(object);
      });
    }
  };

  const colorChange = (color) => {
    const activeObject = canvas.getActiveObjects();
    activeObject.forEach((object) => {
      object.set({ fill: color });
      canvas.renderAll();
    });
  };

  const sendFront = () => {
    const activeObject = canvas.getActiveObjects();
    activeObject.forEach((object) => {
      object.bringToFront();
      canvas.renderAll();
    });
  };
  const sendBack = () => {
    const activeObject = canvas.getActiveObjects();
    activeObject.forEach((object) => {
      object.sendToBack();
      canvas.renderAll();
    });
  };

  return (
    <div className='col-md-12 text-center'>
      <Button className='btn btn-secondary' onClick={() => addSquare(canvas)}>
        Add Square
      </Button>
      <Button className='btn btn-secondary' onClick={() => addCircle(canvas)}>
        Add Circle
      </Button>
      <Button className='btn btn-secondary' onClick={() => addImage(canvas)}>
        Add Image
      </Button>
      <Button
        className='btn btn-secondary'
        onClick={() => removeObject(canvas)}
      >
        Remove Selected
      </Button>
      <Button className='btn btn-secondary' onClick={() => save()}>
        Save Image
      </Button>
      <Button className='btn btn-secondary' onClick={() => sendFront(canvas)}>
        Front
      </Button>
      <Button className='btn btn-secondary' onClick={() => sendBack(canvas)}>
        Back
      </Button>
      {/* <Button className='btn btn-secondary' onClick={() => fourPanel1(canvas)}>
        Template
      </Button> */}
      <DropdownButton title='Templates' variant='secondary'>
        <Dropdown.Item onSelect={() => threePanel(canvas)}>
          3 Panel
        </Dropdown.Item>
        <Dropdown.Item onSelect={() => fourPanel(canvas)}>
          4 Panel
        </Dropdown.Item>
        <Dropdown.Item onSelect={() => sixPanel(canvas)}>6 Panel</Dropdown.Item>
      </DropdownButton>
      <ButtonToolbar>
        <ButtonGroup>
          <Button
            style={{ backgroundColor: 'green' }}
            onClick={() => colorChange('green')}
          ></Button>
          <Button
            style={{ backgroundColor: 'red' }}
            onClick={() => colorChange('red')}
          ></Button>
          <Button
            style={{ backgroundColor: 'blue' }}
            onClick={() => colorChange('blue')}
          ></Button>
          <Button
            style={{ backgroundColor: 'yellow' }}
            onClick={() => colorChange('yellow')}
          ></Button>
          <Button
            style={{ backgroundColor: 'purple' }}
            onClick={() => colorChange('purple')}
          ></Button>
          <Button
            style={{ backgroundColor: 'black' }}
            onClick={() => colorChange('black')}
          ></Button>
        </ButtonGroup>
      </ButtonToolbar>
      {/* <GithubPicker onChange={() => colorChange()}/> */}
      <canvas id='canvas' width='600' height='600' />
    </div>
  );
};

export default Canvas;

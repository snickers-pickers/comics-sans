import React from "react";
import { connect } from "react-redux";
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import {
  Button,
  Dropdown,
  DropdownButton,
  Container,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "../../styles/canvas.css";
import { fourPanel, threePanel, sixPanel } from "./Templates";
import { AddTextBox } from "./AddTextBox";
import { Circle } from "../Shapes/Circle";
import { Square } from "../Shapes/Square";
import Bubbles from "../TextBubbles/Bubbles";
import Characters from "../Characters/characters";
import { fetchCanvasElements, saveCanvasElements } from "../../store/index";
import ColorPicker from "../Editor/ColorPicker";
import { canvasControlsCopy } from "./Copy";

let windowHeightRatio = Math.floor(0.7 * window.innerHeight);
let windowWidthRatio = Math.floor(0.85 * window.innerWidth);

class Canvas extends React.Component {
  constructor() {
    super();
    this.state = {
      canvas: {},
      selectedCanvasId: "canvas",
    };

    this.initCanvas = this.initCanvas.bind(this);
    this.removeObject = this.removeObject.bind(this);
    this.save = this.save.bind(this);
    this.sendFront = this.sendFront.bind(this);
    this.sendBack = this.sendBack.bind(this);
    this.saveToStore = this.saveToStore.bind(this);
  }

  componentDidMount() {
    this.setState({
      canvas: this.initCanvas(),
    });

    this.props.loadCanvas(this.state.selectedCanvasId);
  }

  updateCanvasWithFreshProps(canvas, canvasComingFromBE) {
    // this is made to ensure that all canvas elements stay on the screen
    // once the page refresh happens
    canvas.loadFromJSON(
      `{ "objects": ${JSON.stringify(canvasComingFromBE.elements)}}`
    );
  }

  componentDidUpdate(previousProps, previousState) {
    // here we're comparing what's coming from the backend vs what is cuerrently
    // displayed on the screen and saved in local component state
    if (previousProps.canvas.elements !== previousState.canvas._objects) {
      this.updateCanvasWithFreshProps(this.state.canvas, this.props.canvas);
    }
  }

  saveToStore = (canvas, selectedCanvasId) => {
    this.props.saveCanvas(canvas.getObjects(), selectedCanvasId);
  };

  initCanvas = () =>
    new fabric.Canvas("canvas", {
      //1:1 ratio
      height: windowHeightRatio,
      width: windowWidthRatio,
      backgroundColor: "white",
    });

  // crossOrigin = anonymous before save needed
  save = () => {
    var canvas = document.getElementById("canvas");
    canvas.toBlob(function (blob) {
      // let downloadedImg = new Image(blob);
      // downloadedImg.crossOrigin = "Anonymous";
      // blob.crossOrigin = "Anonymous";
      saveAs(blob, "comic.png");
      // saveAs(downloadedImg, 'comic.png');
    });
  };

  removeObject = (canvas) => {
    let activeObject = canvas.getActiveObjects();
    if (activeObject) {
      canvas.discardActiveObject();
      activeObject.forEach(function (object) {
        canvas.remove(object);
      });
    }
  };

  sendFront = (canvas) => {
    const activeObject = canvas.getActiveObjects();
    activeObject.forEach((object) => {
      object.bringToFront();
      canvas.renderAll();
    });
  };

  sendBack = (canvas) => {
    const activeObject = canvas.getActiveObjects();
    activeObject.forEach((object) => {
      object.sendToBack();
      canvas.renderAll();
    });
  };

  render() {
    const canvasInstance = this.state.canvas;

    return (
      <div className="text-center">
        {/* color picker component buttons  */}
        <ColorPicker canvas={canvasInstance} />

        {/* Canvas controls */}

        {/* these buttons will be moved into their respective components */}
        <Container>
          <Button
            className="button add-to-canvas"
            onClick={() => Square(canvasInstance)}
          >
            <i className="fas fa-square-full"></i> Squares
          </Button>
          <Button
            className="button add-to-canvas"
            onClick={() => Circle(canvasInstance)}
          >
            <i className="fas fa-circle"></i> Circles
          </Button>
          <Button
            className="button add-to-canvas"
            onClick={() => AddTextBox(canvasInstance)}
          >
            <i className="fas fa-font"></i> Text
          </Button>

          {/* dropdown menus */}
          <DropdownButton
            title="Templates"
            className="dropdown-button add-to-canvas"
          >
            <Dropdown.Item onSelect={() => threePanel(canvasInstance)}>
              3 Panel
            </Dropdown.Item>
            <Dropdown.Item onSelect={() => fourPanel(canvasInstance)}>
              4 Panel
            </Dropdown.Item>
            <Dropdown.Item onSelect={() => sixPanel(canvasInstance)}>
              6 Panel
            </Dropdown.Item>
          </DropdownButton>

          <Characters canvasInstance={canvasInstance} />
          <Bubbles canvasInstance={canvasInstance} />
        </Container>

        <Container className="d-flex justify-content-center m-2 pr-5" fluid>
          {/* send all the way to top layer */}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{canvasControlsCopy.bringUp}</Tooltip>}
          >
            <Button
              variant="light"
              onClick={() => this.sendFront(canvasInstance)}
            >
              <i className="fas fa-angle-double-up"></i>
            </Button>
          </OverlayTrigger>

          {/* send all the way to bottom layer */}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{canvasControlsCopy.bringDown}</Tooltip>}
          >
            <Button
              variant="light"
              onClick={() => this.sendBack(canvasInstance)}
            >
              <i className="fas fa-angle-double-down"></i>
            </Button>
          </OverlayTrigger>

          {/* save to store button */}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{canvasControlsCopy.save}</Tooltip>}
          >
            <Button
              variant="light"
              onClick={() =>
                this.saveToStore(canvasInstance, this.state.selectedCanvasId)
              }
            >
              <i className="far fa-save"></i>
            </Button>
          </OverlayTrigger>

          {/* download as image button */}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{canvasControlsCopy.download}</Tooltip>}
          >
            <Button variant="light" onClick={() => this.save()}>
              <i className="fas fa-file-download"></i>
            </Button>
          </OverlayTrigger>

          {/* delete selected element(s) button */}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{canvasControlsCopy.delete}</Tooltip>}
          >
            <Button
              variant="light"
              onClick={() => this.removeObject(canvasInstance)}
            >
              <i className="far fa-trash-alt"></i>
            </Button>
          </OverlayTrigger>
        </Container>

        <canvas id={`canvas`} width="600" height="600" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { canvas: state.canvas };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadCanvas: (canvas, id) => dispatch(fetchCanvasElements(canvas, id)),
    saveCanvas: (canvas, id) => dispatch(saveCanvasElements(canvas, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

import React from "react";
import { connect } from "react-redux";
import { fabric } from "fabric";
import { Button, Dropdown, DropdownButton, Container } from "react-bootstrap";
import "../../styles/canvas.css";
import { fourPanel, threePanel, sixPanel, removePanel } from "./Templates";
import { AddTextBox } from "./AddTextBox";
import { Circle } from "../Shapes/Circle";
import { Square } from "../Shapes/Square";
import Bubbles from "../TextBubbles/Bubbles";
import Characters from "../Characters/characters";
import { fetchCanvasElements, saveCanvasElements } from "../../store/index";
import ColorPicker from "../Editor/ColorPicker";
import CanvasControls from "./CanvasControls";

let windowHeightRatio = Math.floor(0.7 * window.innerHeight);
let windowWidthRatio = Math.floor(0.7 * window.innerWidth);

class Canvas extends React.Component {
  constructor() {
    super();
    this.state = {
      canvas: {},
      selectedCanvasId: "canvas",
    };
    this.initCanvas = this.initCanvas.bind(this);
    this.createEventListener = this.createEventListener.bind(this);
    this.deleteWithKeyboard = this.deleteWithKeyboard.bind(this);
  }

  componentDidMount() {
    this.setState({
      canvas: this.initCanvas(),
    });

    this.props.loadCanvas(this.state.selectedCanvasId);
    // will always load a fresh blank canvas, because this component mounts PRIOR to any user logging in or signing up

    this.createEventListener();
  }

  updateCanvasWithFreshProps(canvas, jsonString) {
    canvas.loadFromJSON(jsonString);
  }

  componentDidUpdate() {
    if (
      this.props.user.userName &&
      this.state.selectedCanvasId !== this.props.user.userName
    ) {
      // if we have loaded something onto the user prop AND we have not yet set the selectedCanvasId on state to be that userName
      this.props.loadCanvas(this.props.user.userName);
      this.setState({
        selectedCanvasId: this.props.user.userName,
      });
    }

    if (this.props.canvas.elements) {
      const canvasElementsFromDatabase = this.props.canvas.elements;
      let jsonString = JSON.stringify(canvasElementsFromDatabase);
      jsonString = `{ "objects": ` + jsonString + `}`;
      this.updateCanvasWithFreshProps(this.state.canvas, jsonString);
    }
  }

  initCanvas = () =>
    new fabric.Canvas("canvas", {
      //1:1 ratio
      height: windowHeightRatio,
      width: windowWidthRatio,
      backgroundColor: "white",
    });

  createEventListener() {
    document.addEventListener("keydown", this.deleteWithKeyboard);
  }

  deleteWithKeyboard(event) {
    if (event.key === "Backspace" || event.key === "Delete") {
      this.removeObject(this.state.canvas);
    }
  }

  render() {
    const canvasInstance = this.state.canvas;
    return (
      <div className="text-center">
        {/* 'sidebar panel' */}
        <div className="row">
          <div className="col-2">
            {/* Canvas controls */}

            <Button
              className="button add-to-canvas"
              onClick={() => Square(canvasInstance)}
            >
              Add <i className="fas fa-square-full"></i>
            </Button>
            <Button
              className="button add-to-canvas"
              onClick={() => Circle(canvasInstance)}
            >
              Add <i className="fas fa-circle"></i>
            </Button>
            <Button
              className="button add-to-canvas"
              onClick={() => AddTextBox(canvasInstance)}
            >
              <i className="fas fa-font"></i> Text
            </Button>

            {/* color picker component buttons  */}
            <ColorPicker canvas={canvasInstance} />
          </div>

          {/* canvas column only */}
          <div className="col-10">
            <Container className="overlay">
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
                <Dropdown.Item onSelect={() => removePanel(canvasInstance)}>
                  Remove All
                </Dropdown.Item>
              </DropdownButton>

              <Characters canvasInstance={canvasInstance} />
              <Bubbles canvasInstance={canvasInstance} />

              <CanvasControls
                canvasInstance={canvasInstance}
                selectedCanvasId={this.state.selectedCanvasId}
              />
            </Container>
            <canvas id={`canvas`} width="300" height="300" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { canvas: state.canvas, user: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadCanvas: (id) => dispatch(fetchCanvasElements(id)),
    saveCanvas: (canvas, id) => dispatch(saveCanvasElements(canvas, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

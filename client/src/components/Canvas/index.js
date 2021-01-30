import { Canvas } from './Canvas';
import { Button } from 'react-bootstrap';

const CanvasView = (props) => {
  return (
    <div>
      <Canvas />
      <Button variant="primary" size="sm">
        Clear page
      </Button>{' '}
      <Button variant="primary" size="sm">
        Add new page
      </Button>
    </div>
  );
};

export default CanvasView;
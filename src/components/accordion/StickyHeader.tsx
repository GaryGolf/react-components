import * as React from 'react';
import Waypoint from 'react-waypoint';

interface Props {
  element: StickyElement;
  onChange: (p:StickyPosition) => void;
  innerRef?: (el:HTMLDivElement) => HTMLDivElement;
}

const StickyHeader:React.SFC<Props> = props => {

  const { element, innerRef } = props;

  const handleWaypointPositionChange = ({ currentPosition }) => {
    const { element, onChange } = this.props;
    const idx = element.idx;
    const position = currentPosition;
    onChange && onChange({ idx, position });
  }

  if (!element) return null;

  return (
    <Waypoint onPositionChange={handleWaypointPositionChange}>
      <div {...element.component.props} data-idx={element.idx} ref={innerRef} />
    </Waypoint>
  );
}

export default StickyHeader 

import * as React from 'react';
import Waypoint from 'react-waypoint';

interface Props {
  element: StickyElement;
  container?: HTMLDivElement;
  onChange: (p:StickyPosition) => void;
  innerRef?: (el:HTMLDivElement) => HTMLDivElement;
}

const StickyHeader:React.SFC<Props> = props => {

  const { element, container, innerRef, onChange } = props;

  const handleWaypointPositionChange = ({ currentPosition }) => {
    const idx = element.idx;
    const position = currentPosition;
    onChange && onChange({ idx, position });
  }

  if (!element) return null;

  return (
    <Waypoint scrollableAncestor={container} 
      onPositionChange={handleWaypointPositionChange}>
      <div {...element.component.props} data-idx={element.idx} ref={innerRef} />
    </Waypoint>
  );
}

export default StickyHeader 

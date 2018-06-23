import * as React from 'react';
import Waypoint from 'react-waypoint';

interface Props {
  element: StickyElement;
  onChange: (p:StickyPosition) => void;
  innerRef?: (el:HTMLDivElement) => HTMLDivElement;
}

export default class StickyHeader extends React.PureComponent<Props, null> {

  private handleWaypointPositionChange = ({ currentPosition }) => {
    const { element, onChange } = this.props;
    const uuid = element.uuid;
    const position = currentPosition;
    onChange && onChange({ uuid, position });
  }

  public render() {
    const { element, innerRef } = this.props;
    if (!element) return null;

    return (
      <Waypoint onPositionChange={this.handleWaypointPositionChange}>
        <div {...element.element.props} 
          data-idx={element.idx}
          data-uuid={element.uuid}
          ref={innerRef}
        />
      </Waypoint>
    );
  }
}

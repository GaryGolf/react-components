import * as React from 'react';
import Waypoint from 'react-waypoint';

interface Props {
  idx?: number;
  children: string | JSX.Element | React.ReactElement<HTMLElement>;
  innerRef?: (el:HTMLDivElement) => HTMLDivElement;
  onChange?: ({idx: number, position: string}) => void;
}

export default class StickyHeader extends React.PureComponent<Props, null> {

  private handleWaypointPositionChange = ({ currentPosition }) => {
    const { idx, onChange } = this.props;
    const position = currentPosition;
    onChange && onChange({ idx, position });
  }

  public render() {
    const { innerRef } = this.props;
    const children = React.Children.only(this.props.children);
    return (
      <Waypoint onPositionChange={this.handleWaypointPositionChange}>
        <div {...children.props} ref={innerRef}/>
      </Waypoint>
    )
  }
}
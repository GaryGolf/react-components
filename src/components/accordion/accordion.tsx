import * as React from 'react';
import * as moment from 'moment';
import Waypoint from 'react-waypoint';
import * as s from './accordion.css'


interface Header {
  index: number;
  title: string;
  position: string;
}

interface Props {
  children?: JSX.Element | JSX.Element[];
}

interface State {
  elements: Header[];
}

export default class Accordion extends React.Component<Props, State> {
  private container: HTMLDivElement;

  public constructor(props:Props) {
    super(props);
    this.state = { elements: this.sort(props.children) };
  }
  

  private handleWaypointLeave = (event: any) => {
    console.log(event)
    //previousPosition: 'inside'
    //currentPosition: 'above'
  }

  private handleWaypointPositionChange = (event:any, idx:number) => {
    // console.log(idx, event)
    const position = event.currentPosition;
    console.log(idx, position)
    this.setState((state:State) => {
      const elements = state.elements.map(item => item.index == idx ? { ...item, position } : item)
      return { elements };
    })
  }

  private sort = (children):Header[] => React.Children.map(children, (item, idx) => {
      const el = item as React.ReactElement<HTMLHeadingElement>;
      if (el.type == 'h4') {
        return ({
          index: idx,
          title: item['props'].children as string,
          position: null
        })
      }
      return null;
    }).filter(item => !!item)

  
  render() {

    const { children } = this.props;

    const above = this.state.elements
      .filter(e => !['inside', 'below'].includes(e.position))
      .map(e => <div key={e.title}>{e.title}</div>);

    const below = this.state.elements
      .filter(e => !['inside', 'above'].includes(e.position))
      .map(e => <div key={e.title}>{e.title}</div>);

    const chu = React.Children.map(children, (item, idx) => {
      const el = item as React.ReactElement<HTMLHeadingElement>;
      if (el.type == 'h4') {
        return (
          <Waypoint data-idx="12"
            onPositionChange={e => this.handleWaypointPositionChange(e, idx)}
            //onLeave={this.handleWaypointLeave}
            >
            {React.createElement('div', {...el.props, id: idx})}
          </Waypoint>
        )
      }
      return item;
    })

    return (
      <div>
        {above}
        <div className={s.accordion}
          ref={el => this.container = el}>
          {chu}
        </div>
        {below}
      </div>
    )
  }
}
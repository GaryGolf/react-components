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

  private handleHeaderClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const { idx } = event.currentTarget.dataset;
    // if (!this.container) return;
    document.getElementById(idx).scrollIntoView({ block: 'start',  behavior: 'smooth' });
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
      .filter(e => ![Waypoint.inside, Waypoint.below].includes(e.position))
      .map(e => <div key={e.title}>{e.title}</div>);

    const below = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.above].includes(e.position))
      .map(e => (
        <div key={e.title} data-idx={e.index} onClick={this.handleHeaderClick}>
          {e.title}
        </div>
      ));

    const inside = React.Children.map(children, (item, idx) => {
      const el = item as React.ReactElement<HTMLHeadingElement>;
      if (el.type == 'h4') {
        return (
          <Waypoint topOffset="12px" bottomOffset="12px"
            onPositionChange={e => this.handleWaypointPositionChange(e, idx)}>
            {React.createElement('div', {...el.props, id: idx})}
          </Waypoint>
        )
      }
      return item;
    })

    return (
      <div className={s.accordion}>
        <div>{above}</div>
        <div className={s.container} ref={el => this.container = el}>
          {inside}
        </div>
        <div>{below}</div>
      </div>
    )
  }
}
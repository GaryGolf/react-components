import * as React from 'react';
import StickyItem from './StickyItem';
import StickyHeader , { HeadElement } from './StickyHeader';
import Waypoint from 'react-waypoint';
import { uuid } from 'short-uuid';
import * as s from './accordion.css'

interface Props {
  children?: JSX.Element | JSX.Element[];
}

interface State {
  elements: HeadElement[];
}

export default class StickyAccordion extends React.Component<Props, State> {
  private container: HTMLDivElement;

  public constructor(props:Props) {
    super(props);
    this.state = { elements: this.sort(props.children) };
  }

  public componentWillReceiveProps (nextProps:Props) {
    if (this.props.children != nextProps.children) {
      const elements = this.sort(nextProps.children);
      this.setState({ elements });
    }
  }
  
  private handleWaypointPositionChange = ({ uuid, position }) => {
    this.setState((state:State) => {
      const elements = state.elements.map(item => item.uuid == uuid ? { ...item, position } : item);
      return { elements };
    })
  }

  private handleHeaderClick = (uuid:string) => {
    if (!this.container) return;
    const target = this.container.querySelector(`[data-uuid="${uuid}"]`) as HTMLDivElement;
    if (!target) return;
    this.container.scroll({
      behavior: 'smooth',
      top: target.offsetTop,
      left: 0
    });
  }

  private isHeading = (element:JSX.Element):boolean => 
    ['h1','h2','h3','h4','h5','h6'].includes(element.type as string);

  private sort = (children):HeadElement[] => 
    React.Children.map(children, (item, idx) => {
      const element = item as JSX.Element;

      if (!this.isHeading(element)) return null;

      return ({
        uuid: uuid(),
        title: element.props.children as string,
        position: null,
        idx, element
      })
    }).filter(item => !!item)

  
  render() {

    const { children } = this.props;

    const above = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.below].includes(e.position))
      .map(e => (
        <StickyItem 
          key={e.uuid} 
          element={e}
          onClick={this.handleHeaderClick}
        />
      ));

    const below = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.above].includes(e.position))
      .map(e => (
        <StickyItem 
          key={e.uuid} 
          element={e}
          onClick={this.handleHeaderClick}
        />
      ));

    const inside = React.Children.map(children, (item, idx) => {
      const element = item as JSX.Element;

      if (!this.isHeading(element)) return (
        <element.type {...element.props} 
          key={idx}
          data-idx={idx}
        />
      );

      return (
        <StickyHeader 
          key={idx}
          element={this.state.elements.find(e => e.idx == idx)}
          onChange={this.handleWaypointPositionChange}
        />
      );
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

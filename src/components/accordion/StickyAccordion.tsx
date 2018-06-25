import * as React from 'react';
import StickyItem from './StickyItem';
import StickyHeader from './StickyHeader';
import Waypoint from 'react-waypoint';
import { uuid } from 'short-uuid';
import * as s from './accordion.css'

interface Props {
  className?: string;
  children: JSX.Element[];
}

interface State {
  elements: StickyElement[];
}

export default class StickyAccordion extends React.Component<Props, State> {
  static defaultProps = { className: '' };
  private container: HTMLDivElement;


  public constructor(props:Props) {
    super(props);
    this.state = { elements: this.sortElements(props.children) };
  }

  public componentWillReceiveProps(nextProps:Props) {
    if(this.props.children != nextProps.children) {
      this.updateElements(nextProps.children);
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

  private sortElements = (children):StickyElement[] => 
    React.Children.map(children, (item, idx) => {
      const element = item as JSX.Element;

      if (!this.isHeading(element)) return null;

      return ({
        idx,
        uuid: uuid(),
        position: null,
        component: element
      })
    }).filter(item => !!item);

  private updateElements = (children) => this.setState(state => {

      const elements:StickyElement[] = [];

      React.Children.forEach(children, (item, idx) => {
        const component = item as JSX.Element;
        if (!this.isHeading(component)) return;

        const element = state.elements.find(e => e.component.key == component.key);

        if (!element) { 
          elements.push({ uuid: uuid(), position: null, idx, component })
        } else {
          elements.push({ ...element, idx, component });
        }
      })

      return { elements: elements.sort((a, b) => a.idx - b.idx) }
    })
    
  
  render() {

    const { children, className } = this.props;

    const above = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.below, null].includes(e.position))
      .map(e => (
        <StickyItem 
          key={e.uuid} 
          element={e}
          onClick={this.handleHeaderClick}
        />
      ));

    const below = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.above, null].includes(e.position))
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
      const header = this.state.elements.find(e => e.idx == idx)
      return (
        <StickyHeader 
          key={idx}
          element={header}
          onChange={this.handleWaypointPositionChange}
        />
      );
    })

    return (
      <div className={`${s.accordion} ${className}`}>
        <div>{above}</div>
        <div className={s.container} ref={el => this.container = el}>
          {inside}
        </div>
        <div>{below}</div>
      </div>
    )
  }
}

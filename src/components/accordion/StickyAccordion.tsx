import * as React from 'react';
import StickyItem from './StickyItem';
import StickyHeader from './StickyHeader';
import Waypoint from 'react-waypoint';
import * as s from './accordion.css'

interface Props {
  className?: string;
  children: JSX.Element[];
  getScrollContainerRef?: (div:HTMLDivElement) => void;
}

interface State {
  elements: StickyElement[];
  upBtnDisabled: boolean;
  downBtnDisabled: boolean;
}

export default class StickyAccordion extends React.Component<Props, State> {
  static defaultProps = { className: '' };
  private container: HTMLDivElement;


  public constructor(props:Props) {
    super(props);
    this.state = { 
      elements: this.sortElements(props.children),
      upBtnDisabled: true,
      downBtnDisabled: false
    };
  }

  public componentWillReceiveProps(nextProps:Props) {
    if(this.props.children != nextProps.children) {
      this.updateElements(nextProps.children);
    }
  }
  
  private handleWaypointPositionChange = ({ idx, position }) => {
    this.setState((state:State) => {
      const elements = state.elements.map(item => item.idx == idx ? { ...item, position } : item);
      return { elements };
    })
  }

  private handleHeaderClick = (idx:number) => {
    if (!this.container) return;
    const target = this.container.querySelector(`[data-idx="${idx}"]`) as HTMLDivElement;
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
          elements.push({ idx, position: null, component })
        } else {
          elements.push({ ...element, idx, component });
        }
      })

      return { elements: elements.sort((a, b) => a.idx - b.idx) }
    })
    
  private handleButtonClick = (direction:string) => {

    switch(direction) {
      case 'UP' :
        this.container.scrollTo({
          behavior: 'smooth', left: 0, top: this.container.scrollTop - this.container.clientHeight
        });
        break;
      case 'DOWN' :
        this.container.scrollTo({
          behavior: 'smooth', left: 0, top: this.container.scrollTop + this.container.clientHeight
        });
    }

  }

  private handleContainerScroll = (event:React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const upBtnDisabled = target.scrollTop == 0;
    const downBtnDisabled = target.scrollHeight - target.scrollTop == target.clientHeight;
    this.setState({ upBtnDisabled, downBtnDisabled });
  }
  
  render() {

    const { children, className, getScrollContainerRef } = this.props;

    const above = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.below, null].includes(e.position))
      .map(e => (
        <StickyItem 
          key={e.idx} 
          element={e}
          onClick={this.handleHeaderClick}
        />
      ));

    const below = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.above, null].includes(e.position))
      .map(e => (
        <StickyItem 
          key={e.idx} 
          element={e}
          onClick={this.handleHeaderClick}
        />
      ));

    const inside = React.Children.map(children, (item, idx) => {
      const element = item as JSX.Element;

      if (!this.isHeading(element)) return (
        <element.type {...element.props} 
          key={element.key}
          data-idx={idx}
        />
      );
      const header = this.state.elements.find(e => e.idx == idx)
      return (
        <StickyHeader 
          key={element.key}
          element={header}
          container={this.container}
          onChange={this.handleWaypointPositionChange}
        />
      );
    })

    return (
      <div className={`${s.accordion} ${className}`}>
        <button className=""
          onClick={this.handleButtonClick.bind(this, 'UP')}
          disabled={this.state.upBtnDisabled}>
          up
        </button>
        <div>{above}</div>
        <div className={s.container} 
          ref={el => {
            this.container = el;
            getScrollContainerRef && getScrollContainerRef(el);
          }} 
          onScroll={this.handleContainerScroll}>
          {inside}
        </div>
        <div>{below}</div>
        <button className="" 
          onClick={this.handleButtonClick.bind(this, 'DOWN')}
          disabled={this.state.downBtnDisabled}>
          down
        </button>
      </div>
    )
  }
}

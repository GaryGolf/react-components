import * as React from 'react';
import StickyHeader from './StickyHeader';
import Waypoint from 'react-waypoint';
import { uuid } from 'short-uuid';
import * as s from './accordion.css'


interface HeadElement {
  idx: number;
  uuid: string;
  title: string;
  position: string;
  element: JSX.Element
}

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
  
  private handleWaypointPositionChange = ({uuid, position}) => {
    this.setState((state:State) => {
      const elements = state.elements.map(item => item.uuid == uuid ? { ...item, position } : item)
      return { elements };
    })
  }

  private handleHeaderClick = (event:React.MouseEvent<HTMLDivElement>) => {
    // const { idx } = event.currentTarget.dataset;
    // if (!this.container) return;
    // document.getElementById(idx).scrollIntoView({ block: 'start',  behavior: 'smooth' });
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
      .map(e => <div key={e.uuid}>{e.title}</div>);

    const below = this.state.elements
      .filter(e => ![Waypoint.inside, Waypoint.above].includes(e.position))
      .map(e => (
        <div key={e.uuid} onClick={this.handleHeaderClick}>
          {e.title}
        </div>
      ));

    // const inside = React.Children.map(children, (item, idx) => {
    //   const el = item as React.ReactElement<HTMLHeadingElement>;
    //   if (el.type == 'h4') {
    //     return (
    //       <Waypoint topOffset="12px" bottomOffset="12px"
    //         onPositionChange={e => this.handleWaypointPositionChange(e, idx)}>
    //         {React.createElement('div', {...el.props, id: idx})}
    //       </Waypoint>
    //     )
    //   }
    //   return item;
    // })

    const inside = React.Children.map(children, (item, idx) => {
      const element = item as JSX.Element;

      if (!this.isHeading(element)) return (
        <element.type {...element.props} 
          key={idx}
          data-idx={idx}
        />
      );

      const header = this.state.elements.find(e => e.idx == idx);
      
      if (!header) return null;

      return (
        <StickyHeader 
          key={idx}
          element={header}
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
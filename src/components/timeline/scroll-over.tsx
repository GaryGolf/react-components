import * as React from 'react';
import * as styles from './scroll-over.css';

interface Props {
  children?: JSX.Element | JSX.Element[] | any;
  maxWidth?: string;
  maxHeight?: string;
};

const TIMEOUT = 20;

export default class ScrollOver extends React.PureComponent<Props, null> {
  private scrollContainer: HTMLDivElement;
  private scrollInterval;

  private scrollTo = (direction, offset = 2) => {
    const top = this.scrollContainer.scrollTop;
    const height = direction == 'up' ? top + offset : top - offset;
    this.scrollContainer.scroll(0, height);
  }

  private handleMouseOver = (event:React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const direction = element.dataset.dir;
    this.scrollInterval = setInterval(() => this.scrollTo(direction), TIMEOUT);
  }

  private handleMouseOut = (event:React.MouseEvent<HTMLDivElement>) => {
    clearInterval(this.scrollInterval);
  }

  private handleMouseClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const direction = element.dataset.dir;
    const height = direction == 'up' ? this.scrollContainer.scrollHeight : 0;
    this.scrollContainer.scroll(0, height);
  }

  render() {
    const { maxWidth, maxHeight, children } = this.props;
    return (
      <div className={styles.scrollover} style={{maxWidth}}>
        <div className={styles.scrollcontainer} 
          ref={el => this.scrollContainer = el}
          style={{maxHeight, width: `calc(${maxWidth} + 20px)`}}>
          {children}
        </div>
        <div className={styles.topbutton} 
          data-dir="down"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleMouseClick}
        />
        <div className={styles.bottombutton} 
          data-dir="up"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleMouseClick}
        />
      </div>
    )
  }
}
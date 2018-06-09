import * as React from 'react';
import * as styles from './scroll-over.css';

interface Props {
  children: (string | JSX.Element[])[];
  maxWidth: string;
  maxHeight: string;
};

export default class ScrollOver extends React.PureComponent<Props, null> {
  private scrollContainer: HTMLDivElement;
  private scrollInterval;
  private timeout = 25;

  private scrollTo = (direction, offset = 2) => {
    const top = this.scrollContainer.scrollTop;
    const height = direction == 'up' ? top + offset : top - offset;
    this.scrollContainer.scroll(0, height);
  }

  private handleMouseOver = (event:React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const direction = element.dataset.dir;
    this.scrollInterval = setInterval(() => this.scrollTo(direction), 20);
  }

  private handleMouseOut = (event:React.MouseEvent<HTMLDivElement>) => {
    clearInterval(this.scrollInterval);
  }

  private handleMouseClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const direction = element.dataset.dir;
    this.scrollTo(direction, 40);
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
        <div className={styles.top} 
          data-dir="down"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleMouseClick}
        />
        <div className={styles.bottom} 
          data-dir="up"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleMouseClick}
        />
      </div>
    )
  }
}
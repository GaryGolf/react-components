import * as React from 'react';
import * as styles from './timeline.css';

interface Props {};

export default class TimeLine extends React.Component<Props, null> {
  private handleScroll = (event:React.UIEvent<HTMLDivElement>) => {
    const height = event.currentTarget.scrollHeight;
    const top = event.currentTarget.scrollTop;
    const client = event.currentTarget.clientHeight;
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget; 
    const scrollBottom = scrollHeight - clientHeight == scrollTop;
    if (!scrollTop) console.log('top');
    if (scrollBottom) console.log('bottom');
  }
  render() {
    const rows = new Array(30)
      .fill('')
      .map((x, idx) => <div key={idx}>{idx+ ' june'}</div>)
    return (
      <div>
        <div>today</div>
        <div>tomorrow</div>
        <div>weekend</div>
        <div>june</div>
        <div className={styles.frame}>
          <div className={styles.container}
            onScroll={this.handleScroll}>
            {rows}
          </div>
        </div>
      </div>
    )
  }
}
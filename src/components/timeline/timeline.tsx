import * as React from 'react';
import * as styles from './timeline.css';

interface Props {};

export default class TimeLine extends React.Component<Props, null> {
  render() {
    const rows = new Array(30)
      .fill('')
      .map((x, idx) => <div key={idx}>{idx+ 'june'}</div>)
    return (
      <div>
        today
        tomorrow
        weekend
        june
        <div className={styles.container}>
          {rows}
        </div>
      </div>
    )
  }
}
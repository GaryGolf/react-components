import * as React from 'react';
import * as styles from './scroll-over.css';

interface Props {
  children: (string | JSX.Element[])[];
};

export default class ScrollOver extends React.PureComponent<Props, null> {
  render() {
    
    return (
      <div className={styles.scrollover}>
        <div className={styles.scrollcontainer}>
          {this.props.children}
          <div className={styles.middle} />
        </div>
        <div className={styles.top} />
        <div className={styles.bottom} />
      </div>
    )
  }
}
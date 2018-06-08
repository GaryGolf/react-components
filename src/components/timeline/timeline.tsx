import * as React from 'react';
import * as styles from './timeline.css';
import { currentId } from 'async_hooks';

interface Props {};
interface State {
  month: number;
};

export default class TimeLine extends React.Component<Props, State> {
  private container: HTMLDivElement;
  private top = false;
  private bot = false;
  private months = ['june', 'july', 'august', 'september'];

  public constructor(props:Props) {
    super(props);
    this.state = {
      month: 0
    }
  }

  private handleScroll = (event:React.UIEvent<HTMLDivElement>) => {
    const height = event.currentTarget.scrollHeight;
    const top = event.currentTarget.scrollTop;
    const client = event.currentTarget.clientHeight;
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget; 
    const scrollBottom = scrollHeight - clientHeight == scrollTop;
    if (!scrollTop) {
      console.log('top');
      this.top = true;
      return;
    } else if (scrollBottom) {
      console.log('bottom');
      this.bot = true;
      return;
    } else {
      this.bot = false;
      this.top = false;
    }
  }

  private handleWheel = (event:React.WheelEvent<HTMLDivElement>) => {
    const delta = event.deltaY;
    if(this.bot && delta > 8) {
      this.setState(prevState => { 
        let month = prevState.month + 1;
        if (month == this.months.length) month = prevState.month;
        return { month }
      })
      this.bot = false;
      this.container.scroll(0,0)
      console.log('bottom', delta)
    } else if (this.top && delta < -8) {
      this.setState(prevState => { 
        let month = prevState.month - 1;
        if (month < 0) month = prevState.month;
        return { month }
      })
      this.container.scroll(0,0)
      this.top = false;
      console.log('top', delta)
    }
  }

  private handleMonthClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const month = parseInt(event.currentTarget.dataset.idx);
    this.setState({ month })
  }

  render() {
    const month = this.months[this.state.month];
    const rows = new Array(30)
      .fill('')
      .map((x, idx) => <div key={idx+month}>{`${idx + 1} ${month}`}</div>)

    const mmm = this.months.map((m, idx) => (
      <div key={m}
        data-idx={idx}
       onClick={this.handleMonthClick}>
       {m}
      </div>
  ))
    const past = mmm.filter((m,i) => i <= this.state.month)
    const futr = mmm.filter((m,i) => i > this.state.month)
    return (
      <div>
        <div>today</div>
        <div>tomorrow</div>
        <div>weekend</div>
        {past}
        <div className={styles.frame}>
          <div className={styles.container}
            ref={el => this.container = el}
            onWheel={this.handleWheel}
            onScroll={this.handleScroll}>
            {rows}
          </div>
        </div>
        {futr}
      </div>
    )
  }
}
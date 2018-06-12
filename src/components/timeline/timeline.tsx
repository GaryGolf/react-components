import * as React from 'react';
import * as styles from './timeline.css';
import { currentId } from 'async_hooks';
import ScrollOver from './scroll-over';

import * as moment from 'moment'


type DateType = string | number //| Date;

interface Props {
  today?: boolean;
  tomorow?: boolean;
  weekend?: boolean;
  dates: Set<DateType> | Array<DateType>;
};
interface State {
  month: number;
};

export default class TimeLine extends React.Component<Props, State> {
  private container: HTMLDivElement;
  private timeline: HTMLDivElement;
  private top = false;
  private bot = false;
  private months = ['june', 'july', 'august', 'september', 'october', 'november', 'december' ];

  public constructor(props:Props) {
    super(props);
    this.state = {
      month: 0
    }

  }

  sort(dates:(Array<Date | number>)):Array<moment.Moment> {
    return [...dates].map(d =>  moment(d)).sort();
  }
 

  // private prepareCalendar = () => {

  //   const qq = [...this.props.dates].map((q:DateType) => new Date(q))
  //   // const dates: Date[] = Array.from(this.props.dates, d => new Date(d)) 
  //   //   .sort()
  //   // return dates;
  // }


  private handleMonthClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const month = parseInt(event.currentTarget.dataset.idx);
    this.setState({ month })
  }

  private handleUpClick = () => {
    const height = this.timeline.scrollHeight;
    const top = this.timeline.scrollTop;
    const client = this.timeline.clientHeight;
    console.log(height, top, client)
    this.timeline.scroll(0, top + 8);
  }

  private handleDownClick = () => {
    const top = this.timeline.scrollTop;
    this.timeline.scroll(0, top - 8);
  }

  render() {
    const month = this.months[this.state.month];
    const rows = new Array(70)
      .fill('')
      .map((x, idx) => <div key={idx+month}>{`${idx + 1} ${month}`}</div>)

    const mmm = this.months.map((m, idx) => (
      <div key={m+idx}
        data-idx={idx}
       onClick={this.handleMonthClick}>
       {m}
      </div>
  ))
    const past = mmm.filter((m,i) => i <= this.state.month)
    const futr = mmm.filter((m,i) => i > this.state.month)

    return (
      <div>
        <button onClick={this.handleUpClick}>up</button>
        <ScrollOver maxWidth="100px" maxHeight="160px">
          {past}
          <ScrollOver maxWidth="100px" maxHeight="72px">
            {rows}
          </ScrollOver>
          {futr}
        </ScrollOver>
        <button onClick={this.handleDownClick}>down</button>
      </div>
    )
  }
}
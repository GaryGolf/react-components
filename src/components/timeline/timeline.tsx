import * as React from 'react';
import * as styles from './timeline.css';
import { currentId } from 'async_hooks';
import ScrollOver from './scroll-over';

import * as moment from 'moment'


type DateType = string | number | Date;

type DayType = {
  date: number;
  value: DateType;
}

type MonthType = {
  month: string;
  days: DayType[];
}

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

    const dates = this.prepareCalendar([...props.dates])
      .map(d => d.month + ' ' + d.days.map(q => q.date))
    console.log(dates)

  }

  private prepareCalendar = (dates:Array<DateType>):MonthType[] => {
    const now = moment().unix();
    let curMonth:number = null;
    let curYear:number = null;
    return dates
      .map(d => ({ m: moment(d).minutes(0).seconds(0).milliseconds(0), value: d}))
      .filter(d => d.m.isValid() && d.m.unix() > now)
      .sort((a, b) => a.m.unix() - b.m.unix())
      .reduce((acc, d) => {
        const month = d.m.month();
        const year = d.m.year();
        const date = d.m.date();
        const value = d.value;

        if (curMonth != month || curYear != year) {
          acc.push({ month: d.m.format('MMM'), days: [{ date, value }] })
        } else {
          acc.slice(-1).pop().days.push({ date, value })
        }
        curMonth = month;
        curYear = year;
        return acc;
      },[])
  }

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
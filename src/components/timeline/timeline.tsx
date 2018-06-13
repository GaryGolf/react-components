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
  date: number;
};

export default class TimeLine extends React.Component<Props, State> {
  private container: HTMLDivElement;
  private timeline: HTMLDivElement;

  private dates:MonthType[] 

  public constructor(props:Props) {
    super(props);
    this.state = {
      month: 0,
      date: 0
    }

    this.dates = this.prepareCalendar();
  }

  private prepareCalendar = ():MonthType[] => {
    const now = moment().unix();
    let curMonth:number = null;
    let curYear:number = null;
    const dates = [...this.props.dates]
      .map(d => ({ m: moment(d).minutes(0).seconds(0).milliseconds(0), value: d}))
      .filter(d => d.m.isValid() && d.m.unix() > now)
      .sort((a, b) => a.m.unix() - b.m.unix())
      .reduce((acc, d) => {
        const month = d.m.month();
        const year = d.m.year();
        const date = d.m.date();
        const value = d.value;

        if (curMonth != month || curYear != year) {
          acc.push({ month: d.m.format('MMMM'), days: [{ date, value }] })
        } else {
          acc.slice(-1).pop().days.push({ date, value })
        }
        curMonth = month;
        curYear = year;
        return acc;
      },[])

      return dates;
  }

  private handleMonthClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const month = parseInt(event.currentTarget.dataset.idx);
    this.setState({ month, date: 0 })
  }

  private handleUpClick = () => {
    this.setState(prevState => {
      if (prevState.date == 0) {
        if(prevState.month == 0) return prevState;
        return { month: prevState.month - 1, date: 0 };
      }
      return { date: prevState.date - 1 }  
    })
  }

  private handleDownClick = () => {
    this.setState(prevState => {
      if (prevState.date + 1 >= this.dates[prevState.month].days.length) {
        if(prevState.month + 1 >= this.dates.length) return prevState;
        return { month: prevState.month + 1, date: 0 };
      }
      return { date: prevState.date + 1 }  
    })
  }

  render() {
    const dates = this.prepareCalendar();

    const month = dates[this.state.month].month;
    const rows = dates[this.state.month].days
      .map((d, idx) => {
        const style = [
          styles.dayitem,
          this.state.date == idx ? styles.__active : ''
        ].join(' ');
        return (
          <div key={d.date+month} className={style}>
            &nbsp;{`${d.date} ${month}`}
          </div>
        )
      })

    const mmm = dates.map((m, idx) => (
      <div key={m.month+idx}
        data-idx={idx}
        onClick={this.handleMonthClick}>
       {m.month}
      </div>
  ))
    const past = mmm.filter((m,i) => i <= this.state.month)
    const futr = mmm.filter((m,i) => i > this.state.month)

    return (
      <div>
        <button onClick={this.handleUpClick}>up</button>
        <ScrollOver maxWidth="100px" maxHeight="160px">
          {past}
          <ScrollOver getContainerRef={el => this.container = el} maxWidth="100px" maxHeight="72px">
            {rows}
          </ScrollOver>
          {futr}
        </ScrollOver>
        <button onClick={this.handleDownClick}>down</button>
      </div>
    )
  }
}
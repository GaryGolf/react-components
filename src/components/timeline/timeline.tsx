import * as React from 'react';
import * as styles from './timeline.css';
import ScrollOver from './scroll-over';
import * as moment from 'moment'

type DateType = string | number | Date;

type DayType = {
  date: number;
  value: DateType;
}

type MonthType = {
  month: string;
  days?: DayType[];
  value?: DateType;
}

interface Props {
  today?: boolean;
  tomorow?: boolean;
  weekend?: boolean;
  dates: Set<DateType> | Array<DateType>;
  onChange:(value:DateType) => void;
};

interface State {
  month: number;
  date: number;
};

export default class TimeLine extends React.Component<Props, State> {
  private container: HTMLDivElement;
  private dates:MonthType[] 

  public constructor(props:Props) {
    super(props);
    this.state = {
      month: 0,
      date: 0
    }
    this.dates = this.prepareCalendar(props.dates);
  }

  public componentWillReceiveProps(nextProps) {
    this.dates = this.prepareCalendar(nextProps.dates);
  }

  private prepareCalendar = (props:Set<DateType> | Array<DateType>):MonthType[] => {
    const now = moment().unix();
    let curMonth:number = null;
    let curYear:number = null;
    const dates = [...props]
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

      dates.unshift({ month: 'today', value: new Date() })
      return dates;
  }

  private handleMonthClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const month = parseInt(event.currentTarget.dataset.idx);
    this.setState({ month, date: 0 }, this.handleChange);
  }

  private handleUpClick = () => {
    this.setState(({ date, month }) => (date == 0) ? 
      { month: month - 1, date: 0 } : { date: date - 1},
      this.handleChange
    )
  }

  private handleDownClick = () => {
    this.setState(({ date, month }) =>  date + 1 >= (!this.dates[month].days ? 0 : this.dates[month].days.length) ?
        { month: month + 1, date: 0 } : { date: date +1 },
      this.handleChange
    );
  }

  private handleDateClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const idx = parseInt(event.currentTarget.dataset.idx);
    this.setState({ date: idx }, this.handleChange)
  }

  private handleChange = () => {
    const { month, date } = this.state;
    const { value } = !this.dates[month].days ? this.dates[month] : this.dates[month].days[date];
    this.props.onChange(value)
  }

  render() {
    const { month, date } = this.state;
    const monthTitle = this.dates[month].month;
    const rows = !this.dates[month].days ? null : this.dates[month].days
      .map((d, idx) => {
        const style = [
          styles.dayitem,
          date == idx ? styles.__active : ''
        ].join(' ');
        return (
          <div key={d.date+monthTitle} 
            className={style} 
            data-idx={idx}
            onClick={this.handleDateClick}>
            &nbsp;{`${d.date} ${monthTitle}`}
          </div>
        )
      })

    const mmm = this.dates.map((m, idx) => {

      const style = [
        !!m.value && month == idx ? styles.__active : ''
      ].join(' ');

      return (
        <div key={m.month+idx}
          className={style}
          data-idx={idx}
          onClick={this.handleMonthClick}>
         {m.month}
        </div>
      )
    })

    const past = mmm.filter((m,i) => i <= month)
    const futr = mmm.filter((m,i) => i > month)

    const isBottom = this.dates.length - 1 ==  month &&
      this.dates[month].days.length - 1 == date

    return (
      <div>
        <button onClick={this.handleUpClick} disabled={!month && !date}>
          up
        </button>
        <ScrollOver maxWidth="100px" maxHeight="160px">
          {past}
          <ScrollOver getContainerRef={el => this.container = el} maxWidth="100px" maxHeight="72px">
            {rows}
          </ScrollOver>
          {futr}
        </ScrollOver>
        <button onClick={this.handleDownClick} disabled={isBottom}>
          down
        </button>
      </div>
    )
  }
}

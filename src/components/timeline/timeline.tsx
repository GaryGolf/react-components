import * as React from 'react';
import * as styles from './timeline.css';
import ScrollOver from './scroll-over';
import * as moment from 'moment';

type Moment = moment.Moment;
type DateType = string | number | Date | moment.Moment;

type DayType = {
  date: number;
  value: DateType;
}

type MonthType = {
  month: string;
  days?: DayType[];
  value?: DateType;
}

interface Option {
  label: string;
  value: Moment | Moment[];
}

type Dates = Set<DateType> | Array<DateType>

interface Props {
  today?: boolean;
  tomorrow?: boolean;
  weekend?: boolean;
  type?: 'string' | 'number' | 'Date' | 'Moment';
  dates: Set<DateType> | Array<DateType>;
  onChange:(value:DateType) => void;
};

interface State {
  month: number;
  date: number;
};

export default class TimeLine extends React.Component<Props, State> {
  private scroll: HTMLDivElement;
  private dates:Option[];
  private type:string;
  private dir: boolean;

  public constructor(props:Props) {
    super(props);
    this.state = {
      month: 0,
      date: 0
    }
    // this.dates = this.prepareCalendar(props);
    this.dir = true;
    this.dates = this.prepareTimeLine([...props.dates]);

  }

  public componentWillReceiveProps(nextProps) {
    this.dates = this.prepareTimeLine([...nextProps.dates]);
  }


  private prepareCalendar = (props:Props):MonthType[] => {
    if (!props.dates) return null;
    const now = moment().unix();
    let curMonth:number = null;
    let curYear:number = null;
    
    const dates = [...new Set(props.dates)]
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

  private prepareTimeLine = (dates:Array<DateType>):Option[] => {
    if (!dates || !dates.length) return null;

    const now = moment().unix();
    let curMonth:number = null;
    let curYear:number = null;

    return [... new Set(dates)]
      .map(d => moment(d).minutes(0).seconds(0).milliseconds(0))
      .filter(d => d.isValid() && d.unix() > now)
      .sort((a, b) => a.unix() - b.unix())
      .reduce((acc, d) => acc.some(m => m.unix() == d.unix()) ? acc : [...acc, d],[])
      .reduce((acc:Option[], d) => {
        const month = d.month();
        const year = d.year();
        const label = d.format('MMMM');

        if (curMonth != month || curYear != year) {
          acc.push({ label, value: [d] })
        } else {
          const { value } = acc.slice(-1).pop();
          if(Array.isArray(value)) value.push(d)
        }
        curMonth = month;
        curYear = year;
        return acc;
      },[])
  }

  private getInputType = (sample:DateType):string => {
    switch(typeof sample) {
      case 'string' :
      case 'number' :
        return typeof sample;
      default :
        if (!!sample['isValid']) return 'Moment';
        return 'Date';
    }
  }

  private format = (value:DateType):DateType => {
    const m = moment(value);
    switch(this.type) {
      case 'string' : return m.format();
      case 'number' : return m.unix();
      case 'Date' : return m.toDate();
      default : return m;
    }
  }

  private setUpWeekend(props:Props):MonthType[] {
      
    const dates:MonthType[] = [];
    this.type = props.type || this.getInputType([...props.dates].shift());

    if (props.today) dates.push({ 
      month: moment().format('D MMMM'), 
      value: this.format(new Date()) 
    });

    if (props.tomorrow) dates.push({ 
      month: 'Tomorrow', 
      value: this.format(moment(new Date()).add(1, 'days').hours(6).minutes(0).seconds(0))
    });

    if (props.weekend) dates.push({ 
      month: 'Weekend', 
      value: this.format(moment().day('Saturday').hours(6).minutes(0).seconds(0)) 
    });

    return dates;
  } 

  private handleMonthClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const month = parseInt(event.currentTarget.dataset.idx);
    this.setState({ month, date: 0 }, this.handleChange);
  }

  private handleUpClick = () => {
    this.dir = true;
    this.setState(({ date, month }) => {
      if (this.isWeekend(month) || date == 0) return { 
        month: month - 1, 
        date: this.isWeekend(month - 1) ? 0 : this.countDays(month - 1) - 1 
      };
      return { date: date - 1 }
    });
  }

  private handleDownClick = () => {
    this.dir = false;
    this.setState(({ date, month }) => {
      if (this.isWeekend(month) || date == this.countDays(month) - 1) return { month: month + 1, date : 0 };
      return { date: date + 1 };
    })
  }

  private handleDateClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const idx = parseInt(event.currentTarget.dataset.idx);
    this.setState({ date: idx }, this.handleChange)
  }

  private handleChange = () => {
    const { month, date } = this.state;
    const weekend = this.isWeekend(month)
    const value = weekend ? this.dates[month].value : this.dates[month].value[date];
    this.props.onChange(this.format(value));
  }

  private isWeekend = (month):boolean => !Array.isArray(this.dates[month].value);
  private countDays = (month:number):number => {
    const currOption = this.dates[month].value;
    return Array.isArray(currOption) ? currOption.length : 0;
  }
  private isUp = ():boolean => {
    const { date, month } = this.state;
    return !date && !month;
  }
  private isBottom = ():boolean => {
    const { date, month } = this.state;
    if (month < this.dates.length - 1) return false;
    else if (this.isWeekend(month)) return true;
    else if (date == this.countDays(month) - 1) return true;
    return false;
  }

  render() {
    if (!this.dates || !this.dates.length) return null;
    const { month, date } = this.state;
    const currOption = this.dates[month].value;

    const datesList = !Array.isArray(currOption) || !currOption.length ? null : currOption
      .map((d, idx) => {
        const active = date == idx;
        const style = [styles.dayitem, active ? styles.__active : ''].join(' ');
        return (
          <div key={d.unix()} 
            className={style} 
            data-idx={idx}
            ref={active && (el => el && el.scrollIntoView())}
            onClick={this.handleDateClick}>
            &nbsp;{d.format('D MMMM')}
          </div>
        ) 
      });

    const monthList = this.dates.map((m, idx) => {

      const active = !Array.isArray(m.value) && month == idx;
      const style = [styles.monthitem, active ? styles.__active : ''].join(' ');

      return (
        <div key={m.label+idx}
          className={style}
          data-idx={idx}
          ref={active && (el => el && el.scrollIntoView(this.dir))}
          onClick={this.handleMonthClick}>
         {m.label}
        </div>
      ) 
    })

    const past = monthList.filter((m,i) => i <= month)
    const future = monthList.filter((m,i) => i > month)

    return (
      <div>
        <button onClick={this.handleUpClick} disabled={this.isUp()}>
          up
        </button>
        <ScrollOver maxWidth="100px" maxHeight="160px">
          {past}
          <ScrollOver maxWidth="100px" maxHeight="72px">
            {datesList}
          </ScrollOver>
          {future}
        </ScrollOver>
        <button onClick={this.handleDownClick} disabled={this.isBottom()}>
          down
        </button>
      </div>
    )
  }
}

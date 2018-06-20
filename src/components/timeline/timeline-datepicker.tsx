import * as React from 'react';
import * as moment from 'moment';
import * as style from './timeline.css';


type Moment = moment.Moment;
type DateType = string | number | Date | Moment;

interface Props {
  type?: 'string' | 'number' | 'Date' | 'Moment';
  after?: DateType;
  before?: DateType;
  value: DateType
  onChange:(value:DateType) => void;
}

export default class TimelineDatepicker extends React.Component<Props, null> {
  static defaultProps = {
    after: moment(),
    before: moment().add(9,'months'),
    type: 'Date'
  }

  private handleDateClick = (date: string) => {
  
    const value = this.format(date)
    this.props.onChange(value);
  }

  private format = (isoDateString:string):DateType => {
    switch(this.props.type) {
      case 'string':
        return isoDateString;
      case 'number':
        return moment(isoDateString).unix()
      case 'Moment':
        return moment(isoDateString);
      case 'Date':
      default :
       return new Date(isoDateString);
    }
  }

  public render() {
    // const value = !this.props.value || !moment(this.props.value).isValid() ? moment() : moment(this.props.value);
    const value = moment(this.props.value);
    const before = moment(this.props.before);
    const after = moment(this.props.after);
    const saturday = moment().isoWeekday('Saturday');
    const sunday = moment().isoWeekday('Sunday');
    const weekend = moment().isSameOrBefore(saturday, 'day') ? saturday : sunday;

    const todayMoment = moment().hours(5).endOf('hour');
    const tomorrowMoment = moment().add(1, 'day').hours(5).endOf('hour');
    const weekendMoment = weekend.hours(5).endOf('hour');

    return (
      <div>
        <div>
          <SpecialDate // Today
            date={todayMoment}
            label={moment().format('DD MMMM')}
            active={todayMoment.isSame(value)}
            onClick={this.handleDateClick}
          />
          <SpecialDate 
            date={tomorrowMoment}
            label={'Tomorrow'}
            active={tomorrowMoment.isSame(value)}
            onClick={this.handleDateClick}
          />
          <SpecialDate 
            date={weekend}
            label={'Weekend'}
            active={weekendMoment.isSame(value)}
            onClick={this.handleDateClick}
          />
          <MonthList
            value={value}
            after={after}
            before={before}
            past={true}
            onClick={this.handleDateClick}
          />
          <DaysList 
            value={value}
            onClick={this.handleDateClick}
          />
          <MonthList
            value={value}
            after={after}
            before={before}
            past={false}
            onClick={this.handleDateClick}
          />
        </div>
      </div>
    )
  }
}


interface SpecialDateProps {
  label: string;
  date: Moment;
  active: boolean;
  onClick: (date:string) => void;
}

const SpecialDate:React.SFC<SpecialDateProps> = props => {

  const style = props.active ? { color:'red'} : {};
  const handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const { date } = event.currentTarget.dataset;
    props.onClick(date)
  }
  
  return (
    <div style={style} 
      data-date={props.date.toISOString()} 
      onClick={handleClick}>
      {props.label}
    </div>
  )
}


// interface MonthItemProps {
//   date: Moment;
//   onClick: (date:string) => void;
//   active: boolean;
// }

// const MonthItem:React.SFC<MonthItemProps> = props => {


//   const handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
//     const { date } = event.currentTarget.dataset;
//     props.onClick(date);
//   }

//   const style = props.active ? { color:'red'} : {};

//   return (
//     <div style={style}
//       data-date={props.date.toISOString()}
//       onClick={handleClick}>
//       {props.date.format('MMMM')}
//     </div>
//   ) 
// }



interface DayItemProps {
  date: Moment;
  onClick: (date:string) => void;
  active: boolean;
}

const DayItem:React.SFC<DayItemProps> = props => {

  const handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const { date } = event.currentTarget.dataset;
    props.onClick(date);
  }
  const style = props.active ? { color:'red'} : {};

  return (
    <div style={style}
      data-date={props.date.toISOString()}
      onClick={handleClick}>
      &nbsp;{props.date.format('DD MMMM')}
    </div>
  ) 
}



interface DaysListProps {
  value: DateType;
  onClick: (date:string) => void;
}

const DaysList:React.SFC<DaysListProps> = props => {
  const { value } = props;
  if (!value || !moment(value).isValid()) return null;
  const days = new Array(moment(value).daysInMonth())
    .fill(null)
    .map((x, i) => moment(value).startOf('month').add(i, 'days'))
    // .map(m => { console.log(m.format('DD MMMM')); return m})

    .filter(m => m.isAfter(moment()), 'day')
    .map(m => (
      <DayItem
        key={m.format('DD MMMM')}
        date={m}
        onClick={props.onClick}
        active={moment(value).isSame(m)}
      />
    ));
  return <div>{days}</div>
}



interface MonthListProps {
  value: DateType;
  after: DateType;
  before: DateType;
  onClick: (date:string) => void;
  past?: boolean;
}

const MonthList:React.SFC<MonthListProps> = props => {
  const { after, before, value, past} = props;

  const x = moment(value);
  const months = new Array(moment(before).diff(moment(after), 'months'))
    .fill(null)
    .map((x, i) => moment(after).add(i, 'month'))
    .map(m => m.isSame(moment(), 'month') ? moment().add(1, 'day').startOf('d') : m.startOf('month'))
    // .map(m => { console.log(m.format('MMMM')); return m})
    .filter(m => past ? m.isSameOrBefore(x, 'month') : m.isAfter(x, 'month') )
    .map(m => (
      <SpecialDate
        key={m.format('MMMM YYYY')}
        date={m} 
        label={m.format('MMMM')}
        onClick={props.onClick}
        active={x.isSame(m, 'month') && x.milliseconds() != 999}
      />
  ))

  return <div>{months}</div>
}

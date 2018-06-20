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

  private handleMonthClick = (date: string) => {
    this.props.onChange(date);
  }

  private renderMonth = () => {
    const { after, before, value } = this.props;

    const months = new Array(moment(before).diff(moment(after), 'months'))
      .fill(null)
      .map((x, i) => moment(after).add(i, 'month'))
      .map(m => { console.log(m.format('MMMM')); return m})

    const past = months
      .filter(m => m.isSameOrBefore(moment(value), 'month'))
      .map(m => (
        <MonthItem 
          key={m.format('MMMM YYYY')}
          date={m} 
          data-date={m.toISOString()}
          onClick={this.handleMonthClick}
          active={moment(value).isSame(m, 'month')}
        />
      ))
    
    const futr = months
      .filter(m => m.isAfter(moment(value), 'month'))
      .map(m => (
        <MonthItem 
          key={m.format('MMMM YYYY')}
          date={m} 
          onClick={this.handleMonthClick}
          active={moment(value).isSame(m, 'month')}
        />
      ))

    const specialDays = [
      <li key="today">{moment().format('DD MMMM')}</li>,
      <li key="tomorrow">{'Tomorrow'}</li>,
      <li key="weekend">{'Weekend'}</li>
    ];
    return [ specialDays.concat(past), futr];
  }

  public render() {
    const { after, before } = this.props;
    const value = !this.props.value || !moment(this.props.value).isValid() ? moment() : this.props.value;

    return (
      <div>
        <div>
          <MonthList
            value={moment(value)}
            after={moment(after)}
            before={moment(before)}
            past={true}
            onClick={this.handleMonthClick}
          />
          <DaysList 
            value={moment(value)}
            onClick={this.handleMonthClick}
          />
          <MonthList
            value={moment(value)}
            after={moment(after)}
            before={moment(before)}
            past={false}
            onClick={this.handleMonthClick}
          />
        </div>
      </div>
    )
  }
}

interface MonthItemProps {
  date: Moment;
  onClick: (date:string) => void;
  active: boolean;
}

const MonthItem:React.SFC<MonthItemProps> = props => {


  const handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const { date } = event.currentTarget.dataset;
    props.onClick(date);
  }

  const style = props.active ? { color:'red'} : {};
  const date = moment(props.date).isSame(moment(), 'month') 
    ? moment().add(1, 'day').startOf('d') 
    : moment(props.date).startOf('month');

  return (
    <div style={style}
      data-date={date.toISOString()}
      onClick={handleClick}>
      {props.date.format('MMMM')}
    </div>
  ) 
}



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
        active={moment(value).isSame(m, 'day')}
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
    // .map(m => { console.log(m.format('MMMM')); return m})
    .filter(m => past ? m.isSameOrBefore(x, 'month') : m.isAfter(x, 'month') )
    .map(m => (
      <MonthItem 
        key={m.format('MMMM YYYY')}
        date={m} 
        onClick={props.onClick}
        active={x.isSame(m, 'month')}
      />
  ))

  return <div>{months}</div>
}

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
    const months =  new Array(moment(before).diff(moment(after), 'months'))
      .fill(null)
      .map((x, i) => moment().hours(0).minutes(0).seconds(0).milliseconds(0).add(i, 'month'))

    const past = months
      .filter(m => m.isSameOrBefore(moment(value).startOf('month')))
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
      .filter(m => m.isAfter(moment(value).startOf('month')))
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


  private renderDays = () => {
    const { value } = this.props;
    if (!value || !moment(value).isValid()) return null;
    const now = moment();
    const days = new Array(moment(value).daysInMonth())
      .fill(null)
      .map((x, i) => moment(value).startOf('month').add(i, 'days'))
      .filter(m => m.isAfter(now))
      .map(m => (
        <DayItem
          key={m.format('DD MMMM')}
          date={m}
          onClick={this.handleMonthClick}
          active={moment(value).isSame(m, 'day')}
        />
      ));
    return <ul>{days}</ul>
  }
  render() {

    const days = this.renderDays();
    const [past, futr] = this.renderMonth();
    return (
      <div>
        <ul>
          {past}
          {days}
          {futr}
        </ul>
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

  const handleClick = (event:React.MouseEvent<HTMLLIElement>) => {
    const { date } = event.currentTarget.dataset;
    props.onClick(date);
  }
  const style = props.active ? { color:'red'} : {};

  return (
    <li style={style}
      data-date={props.date.toISOString()}
      onClick={handleClick}>
      {props.date.format('MMMM')}
    </li>
  ) 
}

interface DayItemProps {
  date: Moment;
  onClick: (date:string) => void;
  active: boolean;
}

const DayItem:React.SFC<DayItemProps> = props => {

  const handleClick = (event:React.MouseEvent<HTMLLIElement>) => {
    const { date } = event.currentTarget.dataset;
    props.onClick(date);
  }
  const style = props.active ? { color:'red'} : {};

  return (
    <li style={style}
      data-date={props.date.toISOString()}
      onClick={handleClick}>
      {props.date.format('DD MMMM')}
    </li>
  ) 
}
import * as React from 'react';
import * as moment from 'moment';
import ScrollOver from './scroll-over';
import * as style from './timeline.css';


type Moment = moment.Moment;
type DateType = string | number | Date | Moment;

interface Props {
  type?: 'string' | 'number' | 'Date' | 'Moment';
  monthCount?: number;
  value: DateType
  onChange:(value:DateType) => void;
}

export default class TimelineDatepicker extends React.Component<Props, null> {
  static defaultProps = {
    monthCount: 4,
    type: 'Date'
  }
  private dir = 'down';
  private container: HTMLDivElement;

  public componentDidUpdate() {
    !!this.dir  && this.scrollActiveElementIntoView()
  }

  private handleDateClick = (date: string) => {
    this.dir = null;
    const value = this.format(date)
    this.props.onChange(value);
  }

  private handleMonthClick = (date: string) => {
    this.dir = 'down';
    const value = this.format(date);
    this.props.onChange(value);
  }

  private handleButtonClick = (event:React.MouseEvent<HTMLButtonElement>) => {
    this.dir = event.currentTarget.dataset.dir;
    const UP = this.dir == 'up';
    const value = moment(this.props.value);
    let date:Moment = moment();
    switch(true) {
      case UP && this.tomorrow().isSame(value) :
        date = this.today();
        break;
      case UP && this.weekend().isSame(value) :
       date = this.tomorrow();
       break;
      case UP && moment().add(1, 'day').startOf('day').isSame(value) :
        date = this.weekend();
        break;
      case UP :
        date = moment(value).subtract(1, 'day');
        break;

      case !UP && this.today().isSame(value) :
        date = this.tomorrow();
        break;
      case !UP && this.tomorrow().isSame(value) :
        date = this.weekend();
        break;
      case !UP && this.weekend().isSame(value) :
        date = moment().add(1, 'day').startOf('day');
        break;
      case !UP :
        date = moment(value).add(1, 'day');
        break;
    }

    const val = this.format(date.toISOString())
    this.props.onChange(val);
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

  private renderMonthList = (past = true) => {
    const { value, monthCount } = this.props;
    const x = moment(value);
    const specialDay = x.milliseconds() != 999 || x.seconds() != 59;

    return new Array(monthCount)
      .fill(null)
      .map((x, i) => moment().add(i, 'month'))
      .map(m => m.isSame(moment(), 'month') ? moment().add(1, 'day').startOf('d') : m.startOf('month'))
      .filter(m => past ? m.isSameOrBefore(x, 'month') : m.isAfter(x, 'month') )
      .map(m => (
        <SpecialDate
          key={m.format('MMMM YYYY')}
          date={m} 
          label={m.format('MMMM')}
          onClick={this.handleMonthClick}
          active={x.isSame(m, 'month') && specialDay}
        />
    ));
  }

  private renderDayList = () => {
    const { value } = this.props;
    if (!value || !moment(value).isValid() || moment(value).milliseconds() == 999) return null;
    return new Array(moment(value).daysInMonth())
      .fill(null)
      .map((x, i) => moment(value).startOf('month').add(i, 'days'))
      .filter(m => m.isAfter(moment()))
      .map(m => (
        <SpecialDate
          key={m.format('DD MMMM')}
          date={m}
          label={` - ${m.format('DD MMMM')}`}
          onClick={this.handleDateClick}
          active={moment(value).isSame(m)}
        />
      ));
  }

  private scrollActiveElementIntoView = () => {
    if (!this.container) return;
    const element = this.container.querySelector('[data-active=true]') as HTMLDivElement;
    if(!element) return;
    if (this.dir == 'down') {
      element.parentElement.scrollTo(0, element.offsetTop)
      this.container.parentElement.scrollTo(0, this.container.offsetTop - element.offsetHeight);
    } else {
      element.parentElement.scrollTo(0, element.offsetTop + element.offsetHeight - 
        element.parentElement.offsetHeight);
      this.container.parentElement.scrollTo(0, this.container.offsetTop + 
        this.container.offsetHeight - this.container.parentElement.offsetHeight);
    }
  }

  private today = () => moment().hours(5).endOf('hour');
  private tomorrow = () => moment().add(1, 'day').hours(5).endOf('hour');
  private weekend = () => {
    const saturday = moment().isoWeekday('Saturday');
    const sunday = moment().isoWeekday('Sunday');
    const weekend = moment().isSameOrBefore(saturday, 'day') ? saturday : sunday;
    return weekend.hours(5).endOf('hour');
  }
  private lastDate = () => moment().add(this.props.monthCount - 1, 'month').endOf('month').startOf('day')

  public render() {
    // const value = !this.props.value || !moment(this.props.value).isValid() ? moment() : moment(this.props.value);
    const value = moment(this.props.value);
    const past = this.renderMonthList(true);
    const future = this.renderMonthList(false);
    const days = this.renderDayList()

    return (
      <div>
        <button 
          data-dir="up"
          disabled={this.today().isSame(value)}
          onClick={this.handleButtonClick}>
          up
        </button>
        <ScrollOver maxWidth="100px" maxHeight="360px">
          <SpecialDate // Today
            date={this.today()}
            label={moment().format('DD MMMM')}
            active={this.today().isSame(value)}
            onClick={this.handleDateClick}
          />
          <SpecialDate 
            date={this.tomorrow()}
            label={'Tomorrow'}
            active={this.tomorrow().isSame(value)}
            onClick={this.handleDateClick}
          />
          <SpecialDate 
            date={this.weekend()}
            label={'Weekend'}
            active={this.weekend().isSame(value)}
            onClick={this.handleDateClick}
          />
          {past}
          <ScrollOver maxWidth="100px" 
            maxHeight="120px" 
            getContainerRef={el => this.container = el}>
            {days}
          </ScrollOver>
          {future}
        </ScrollOver>
        <button 
          data-dir="down"
          disabled={this.lastDate().isSame(value)}
          onClick={this.handleButtonClick}>
          down
        </button>
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
      data-active={props.active}
      data-date={props.date.toISOString()} 
      onClick={handleClick}>
      {props.label}
    </div>
  )
}


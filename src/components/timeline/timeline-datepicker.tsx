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

  private renderMonth = () => {
    const { after, before, value } = this.props;
    const months =  new Array(moment(before).diff(moment(after), 'months'))
      .fill(null)
      .map((x, i) => moment().hours(0).minutes(0).seconds(0).milliseconds(0).add(i, 'month'))

    const past = months
      .filter(m => m.isSameOrBefore(moment(value)))
      .map(m => <li key={m.format('MMMM YYYY')}>{m.format('MMMM')}</li>)
    
    const futr = months
      .filter(m => m.isAfter(moment(value)))
      .map(m => <li key={m.format('MMMM YYYY')}>{m.format('MMMM')}</li>)

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
      .map(m => <li key={m.format('DD-MM')}>{m.format('DD MMMM')}</li>);
    return <ul>{days}</ul>
  }
  render() {

    const days = this.renderDays();
    const [past, futr] = this.renderMonth();
    console.log(this.renderDays())
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
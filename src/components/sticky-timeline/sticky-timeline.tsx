import * as React from 'react';
import * as moment from 'moment';
// import StickyAccordion from '../accordion';
import StickyList from 'react-sticky-list';

const styles = `
.timeline {
  background: lightblue;
  height: 300px;
  width: 300px;
  position: relative;
  margin: 0 auto;
  overflow: scroll;
}

.sticky-month {
  color: navy;
}


.sticky-date {
  margin-left: .5rem;
  cursor: pointer;
}

.sticky-date:hover {
  color: red;
}

.__active {
  color: yellow;
}

`;

type Moment = moment.Moment;
type DateType = string | number | Date | Moment;
interface Props {
  monthCount?: number;
  type?: string;
  value: DateType;
  onChange: (date:DateType) => void;
}

export default class StyckyTimeLine extends React.Component<Props, null> {

  private container: HTMLDivElement;
  static defaultProps = { type: 'Date', monthCount: 7 }

  private handleDateClick = (date:Moment) => {
    this.props.onChange(date.toDate())
  }

  private renderCalendar = (value: DateType, monthCount: number) => new Array(monthCount)
    .fill(null)
    .map((x,i) => moment().add(i, 'month').startOf('month'))
    .reduce((acc, m) => {

      const activeMonth = moment(value).isSame(m, 'month');
      const month = (
        <h4 key={m.format('MMM YYYY')}  
          className={['sticky-month', activeMonth ? '__active' : ''].join(' ')} >
          {m.format('MMMM')}
        </h4>
      )

      acc.push(month);
      
      const dayList = new Array(m.daysInMonth())
        .fill(null)
        .map((x, i) => moment(m).add(i, 'days'))
        .filter(d => moment().isBefore(d,'days'))
        .map(d => (
          <StickyDate
            key={d.format('DD MMMM YYYY')}
            className={[
              'sticky-date', 
              moment(value).isSame(d, 'day') ? '__active' : ''
            ].join(' ')}
            date={d}
            onClick={this.handleDateClick}
          />
        ))

      return acc.concat(dayList);
    },[]);

  render() {
    const { value, monthCount } = this.props;
    const calendar = this.renderCalendar(value, monthCount);

    return (
      <div className="timeline" ref={el => this.container = el}>
        <StickyList>
          {calendar}
        </StickyList>
        <style>{styles}</style>
      </div>
    )
  }
}

interface StickyDateProps {
  className?: string;
  date:Moment;
  onClick:(date:Moment) => void;
}
const StickyDate:React.SFC<StickyDateProps> = props => {

  const handleClick = () => props.onClick(props.date)

  return (
    <div className={props.className || ''} onClick={handleClick}>
     {props.date.format('DD MMMM')}
    </div>
  )
}

import * as React from 'react';
import * as moment from 'moment';
import StickyAccordion from '../accordion';

type Moment = moment.Moment;
type DateType = string | number | Date | Moment;
interface Props {
  monthCount?: number;
  type?: string;
  value: DateType;
  onChange: (date:DateType) => void;
}

const styles = `
.timeline {
  background: lightblue;
  height: 300px;
  width: 300px;
  position: relative;
  margin: 0 auto;
  overflow: scroll;
}
.header {
  position: sticky;
  top: 0;
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


export default class StyckyTimeLine extends React.Component<Props, null> {

  private container: HTMLDivElement;
  static defaultProps = { type: 'Date', monthCount: 7 }

  private handleDateClick = (date:Moment) => {
    this.props.onChange(date.toDate())
  }


  render() {
    const { value, monthCount } = this.props;

    const monthList = new Array(monthCount)
      .fill(null)
      .map((x,i) => moment().add(i, 'month').startOf('month'))
      .reduce((acc, m) => {
        acc.push(<h5 key={m.format('MMMM YY')}>{m.format('MMMM')}</h5>)
        
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
      },[])

    return (
      <div className="timeline" ref={el => this.container = el}>
        <StickyAccordion>
          {monthList}
        </StickyAccordion>
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

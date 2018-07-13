import * as React from 'react';
import * as moment from 'moment';

type Moment = moment.Moment;

interface StickyDateProps {
  className?: string;
  date:Moment;
  onClick:(date:Moment) => void;
}
const StickyDate:React.SFC<StickyDateProps> = props => {

  const handleClick = () => props.onClick(props.date)

  // console.log(props)

  return (
    <div className={props.className || ''} onClick={handleClick}>
     {moment(props.date).format('DD MMMM')}
    </div>
  )
}

export default StickyDate;

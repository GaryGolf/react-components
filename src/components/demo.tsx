import * as React from 'react'

// import Paragraph from './paragraph/paragraph'
// import Input from './input'
// import Timeline from './timeline/timeline-datepicker';
// import StickyTimeLine from './sticky-timeline';
// import Accordion from './test';
// import * as moment from 'moment'
import StickyTimeline from './sticky-timeline';


// type Moment = moment.Moment;
type DateType = number | string | Date;

interface Props {}
interface State {
  date: DateType;
}

export default class Demo extends React.Component<Props, State> {

    constructor(props:Props){
      super(props)
      this.state = { date: new Date(2018, 5, 22) };
    }

    private handleDateChange = (date: DateType): void => {
      console.log(date);
      this.setState({ date });
    }
 
    render(){

        return (
            <div style={{margin:'20px'}}>
              {/* <Input.Phone/>
              <Paragraph deadLine={1000}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia dolorum cumque accusantium perspiciatis, minima sequi deleniti qui vel minus magni, vitae officiis, aspernatur. Accusantium blanditiis adipisci provident, vitae minus voluptatem id eaque quam error assumenda molestiae deleniti, placeat. Sit temporibus labore delectus blanditiis ullam, consectetur sint nam vitae at eos!
              </Paragraph> */}
              {/* <Timeline 
                onChange={this.handleDateChange}      
                type="Date"
                value = {this.state.date}
              />         */}
              {/* <StickyTimeLine /> */}
              {/* <Accordion/> */}
              <StickyTimeline
                value={this.state.date}
                monthCount={3}
                onChange={this.handleDateChange}
              />
            </div>
        )
    }
}

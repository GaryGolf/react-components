import * as React from 'react'

// import Paragraph from './paragraph/paragraph'
// import Input from './input'
import Timeline from './timeline';

interface Props {}
interface State {}

export default class Demo extends React.Component<Props, State> {

    constructor(props:Props){
        super(props)

    }
 
    render(){
        return (
            <div style={{margin:'20px'}}>
              {/* <Input.Phone/>
              <Paragraph deadLine={1000}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia dolorum cumque accusantium perspiciatis, minima sequi deleniti qui vel minus magni, vitae officiis, aspernatur. Accusantium blanditiis adipisci provident, vitae minus voluptatem id eaque quam error assumenda molestiae deleniti, placeat. Sit temporibus labore delectus blanditiis ullam, consectetur sint nam vitae at eos!
              </Paragraph> */}
              <Timeline/>
            </div>
        )
    }
}
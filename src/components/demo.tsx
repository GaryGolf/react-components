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
        const dates = new Set()
        dates.add(new Date(2018, 11, 6))
        dates.add(new Date(2018, 11, 12))
        dates.add(new Date(2018, 10, 19))
        dates.add(new Date(2018, 9, 16))
        dates.add(new Date(2018, 9, 26))
        dates.add(new Date(2018, 9, 17))
        dates.add(new Date(2018, 9, 15))
        dates.add(new Date(2018, 9, 31))
        dates.add(new Date(2018, 8, 11))
        dates.add(new Date(2018, 8, 22))
        dates.add(new Date(2018, 7, 12))
        dates.add(new Date(2018, 6, 12))
        dates.add(new Date(2018, 5, 21))
        dates.add(new Date(2018, 4, 18))
        dates.add(new Date(2018, 4, 11))
        dates.add(new Date(2019, 0, 1))
        dates.add('2020-12-25')
        dates.add(null)

        return (
            <div style={{margin:'20px'}}>
              {/* <Input.Phone/>
              <Paragraph deadLine={1000}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia dolorum cumque accusantium perspiciatis, minima sequi deleniti qui vel minus magni, vitae officiis, aspernatur. Accusantium blanditiis adipisci provident, vitae minus voluptatem id eaque quam error assumenda molestiae deleniti, placeat. Sit temporibus labore delectus blanditiis ullam, consectetur sint nam vitae at eos!
              </Paragraph> */}
              <Timeline 
                dates={dates}
              />
            </div>
        )
    }
}
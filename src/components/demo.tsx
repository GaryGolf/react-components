import * as React from 'react'

interface Props {}
interface State {}

export default class Demo extends React.Component<Props, State> {

    constructor(props:Props){
        super(props)

    }

    render(){
        return (
            <div style={{margin:'20px'}}>
              <span>Hello World</span>
            </div>
        )
    }
}
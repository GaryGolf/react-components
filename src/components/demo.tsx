import * as React from 'react'

import Paragraph from './paragraph/paragpaph'

interface Props {}
interface State {}

export default class Demo extends React.Component<Props, State> {

    constructor(props:Props){
        super(props)

    }

    render(){
        return (
            <div style={{margin:'20px'}}>
              <Paragraph deadLine={1000}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit recusandae doloremque magni sequi illum voluptatibus rem rerum non in odio?
              </Paragraph>
            </div>
        )
    }
}
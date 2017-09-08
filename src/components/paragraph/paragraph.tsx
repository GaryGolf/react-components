import * as React from 'react'

import Character from './character'
interface Props {
    className?: string
    children?: string
    deadLine?: number
}
interface State {}

export default class Paragraph extends React.Component <Props, State> {
    constructor(props:Props){
        super(props)
    }
    componentDidMount(){

    }
    render(){
        const {className, deadLine, children} = this.props
        const time = new Date().getTime() + deadLine
        const chars = children.split('').map((char,idx)=>(
            <Character key={idx}
                deadLine={time}>
                {char}
            </Character>
        ))
        return (
            <p className={className}>
                {chars}
            </p>
        )
    }
}
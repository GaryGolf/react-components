import * as React from 'react'

interface Props {
    children: string
    deadLine: number
}
interface State {
    char: string
    done: boolean
}

export default class Character extends React.Component <Props, State> {
    private counter: number
    static palette = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm1234567890qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm'.split('')
    private length: number
    private startTime: number
    constructor(props:Props){
        super(props)
        this.counter = 3
        this.length = Character.palette.length
        this.startTime = new Date().getTime()
        this.state = {
            char: this.getChar(),
            done: false
        }
    }
    componentDidMount(){
        this.decode()
    }
    componentDidUpdate(){
        const delay = 100 + Math.ceil(Math.random()*100)
        if(new Date().getTime()>this.props.deadLine && !this.state.done) this.setState({done: true})
        else window.setTimeout(()=>this.decode(),delay)
    }
    getChar(){
        const {children} = this.props
        const done = this.state && this.state.done
        const idx = Math.ceil(Math.random()*this.length)
        const char = children == ' ' ? children:Character.palette[idx]
        return !done ? char:children
    }
    decode(){
        const char = this.getChar()
        this.setState({char})
    }
    render(){
        const {children, deadLine} = this.props
       
        return (
            <i>{this.state.char}</i>
        )
    }
}
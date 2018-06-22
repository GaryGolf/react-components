import * as React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';

interface Props {}

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
`;


export default class StyckyTimeLine extends React.Component<Props, null> {

  private container: HTMLDivElement;

  private renderSticky = () => {
    return new Array(30).fill(null).map((x,i) => (
        <div key={i}>qq</div>
    ))
  }

  private renderContainer = () => {
    return new Array(5).fill(null)
      .map((x,i) => (
        <div key={i}>
          <h2 className="header">title + i</h2>
          { this.renderSticky() }
        </div>
      ))
  }
  render() {
    return (
      <div className="timeline" ref={el => this.container = el}>
        {this.renderContainer()}
        <style>{styles}</style>
      </div>
    )
  }
}

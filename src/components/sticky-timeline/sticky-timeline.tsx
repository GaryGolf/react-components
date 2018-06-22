import * as React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';

interface Props {}

const styles = `
.timeline {
  background: lightblue;
  height: 100px;
  overflow: scroll;
}
`;


export default class StyckyTimeLine extends React.Component<Props, null> {

  private renderSticky = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <StickyContainer
        key={i}
        className="container"
        style={{ background: 'lightblue' }}
      >
        <Sticky>
          {({ style }) => (
            <div style={{ ...style, background: 'white', height:'80px', overflow:'auto' }}>{'header '+ i}</div>
          )}
        </Sticky>

        <h2 className="text-center">{`<StickyContainer #${i} />`}</h2>
      </StickyContainer>
    ))
  }
  render() {
    return (
      <div className="timeline">
        {this.renderSticky()}
        <style>{styles}</style>
      </div>
    )
  }
}

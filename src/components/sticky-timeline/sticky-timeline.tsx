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
    return new Array(30).fill(null).map((x,i) => (
        <div key={i}>qq</div>
    ))
  }
  render() {
    return (
      <div className="timeline">
        <StickyContainer className="events-day" id={'qq'}>
					<Sticky className="sticky-header" stickyClassName="sticky-header-active" topOffset={-65}>
						<h3 className="events-day_title">dayTitle</h3>
					</Sticky>
					<div className="sticky-spacer"></div>
					{ this.renderSticky() }
				</StickyContainer>
        <style>{styles}</style>
      </div>
    )
  }
}

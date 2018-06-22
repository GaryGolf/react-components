import * as React from 'react';
import Accordion from './accordion';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default class AccordionItem extends React.Component<Props, null> {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
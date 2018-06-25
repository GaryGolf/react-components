import * as React from 'react';

interface Props { 
  element: StickyElement;
  onClick: (idx:number) => void;
};

export default class StickyItem extends React.PureComponent<Props, null> {

  private handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const { idx } = this.props.element;
    this.props.onClick(idx);
  }

  render() {
    const { idx, component } = this.props.element;
    return (
      <div 
        {...component.props} 
        data-idx={idx} 
        onClick={this.handleClick}
      />
    )
  }
}

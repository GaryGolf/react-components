import * as React from 'react';

interface Props { 
  element: StickyElement;
  onClick: (uuid:string) => void;
};

export default class StickyItem extends React.PureComponent<Props, null> {

  private handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
    const { uuid } = this.props.element;
    this.props.onClick(uuid);
  }

  render() {
    const { uuid, component } = this.props.element;
    return (
      <div 
        {...component.props} 
        data-uuid={uuid} 
        onClick={this.handleClick}
      />
    )
  }
}

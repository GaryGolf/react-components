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
    const { uuid, element } = this.props.element;
    return (
      <div 
        {...element.props} 
        data-uuid={uuid} 
        onClick={this.handleClick}
      />
    )
  }
}

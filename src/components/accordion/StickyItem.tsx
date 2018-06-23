import * as React from 'react';

interface Props { 
  idx: number;
  uuid: string;
  children: string | JSX.Element | React.ReactElement<HTMLHeadingElement>;
  onClick?: (idx:number) => void;
};

export default class StickyItem extends React.PureComponent<Props, null> {
  render() {
    const children = React.Children.only(this.props.children);

    return (
      <div
        {...children.props}
      />
    )
  }
}
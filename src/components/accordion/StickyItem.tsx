import * as React from 'react';

interface Props { 
  element: StickyElement;
  onClick: (idx:number) => void;
};

const StickyItem:React.SFC<Props> = props =>{

  const { idx, component } = props.element;

  const handleClick = (event:React.MouseEvent<HTMLDivElement>) => {
    component.props.onClick && component.props.onClick(event)
    props.onClick(idx);
  }

  return <div  {...component.props} onClick={handleClick} />;
}

export default StickyItem;

import * as React from 'react';

import { storiesOf, module } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
// import  Paragraph  from '../src/components/paragraph/paragraph'

const stores = storiesOf('Components', module)
// stores.add('Paragraph', () => (<Paragraph deadLine={1000}>fgsdfgsdfgsdfg</Paragraph>))
stores.add('Paragraph qq', () => <Button title={'qq'}/>)
stores.add('Paragraph hello', () => <Button title={'Hello'}/>)

interface Props {
  title: string
}
const Button = (props) => {
  return (
    <h1>{props.title}</h1>
  )
}
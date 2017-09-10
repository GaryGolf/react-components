import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import Input from '../src/components/input'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('Input', module)
  .add('custom input', () => <Input.Phone />)
  .add('disabled', () => <Input.Phone disabled={true}/>)
  .add('placeholder', () => <Input.Phone placeholder="Enter phone number"/>)
  .add('hint', () => <Input.Phone hint="например: +7 495 234 56 78"/>)
  .add('error', () => <Input.Phone error="эх ... деревня"/>)


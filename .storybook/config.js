import { configure } from '@storybook/react';

function loadStories() {
  require('../stories');
  // require('../stories/paragraph.tsx');
}

configure(loadStories, module);

import Moment from 'vendor/moment/moment.min';
import importantDate from 'modules/important-date';

document.querySelector('#birthday').textContent =
  Moment(importantDate).fromNow();

import cssLoader from 'modules/defer-css';
cssLoader();

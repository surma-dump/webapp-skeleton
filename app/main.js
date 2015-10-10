import {default as Moment} from 'bower_components/moment/min/moment.min';
import {default as importantDate} from 'modules/important-date';

document.querySelector('#birthday').textContent =
  Moment(importantDate).fromNow();

import {default as cssLoader} from 'modules/defer-css';
cssLoader();

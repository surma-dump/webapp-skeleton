import Moment from 'bower_components/moment/min/moment.min';
import importantDate from 'modules/important-date';

document.querySelector('#birthday').textContent =
  Moment(importantDate).fromNow();

import cssLoader from 'modules/defer-css';
cssLoader();

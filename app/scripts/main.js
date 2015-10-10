import {default as Moment} from '../bower_components/moment/moment';
import {birthday} from 'birthday';

document.querySelector('#birthday').textContent = Moment(birthday).fromNow();

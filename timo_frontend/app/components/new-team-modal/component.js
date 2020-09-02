import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class NewTeamModalComponent extends Component {
  @tracked teamName = '';
  emptyInputValidation = emptyInput;
}
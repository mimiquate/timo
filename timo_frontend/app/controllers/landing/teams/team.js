import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { compareMemberTimeZones } from 'timo-frontend/utils/table-functions';
import { createNewRows } from 'timo-frontend/utils/timezone-rows';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import moment from 'moment';
import { isPresent } from '@ember/utils';

export default class LandingTeamsTeamController extends Controller {
  queryParams = [{ isCollapsed: 'collapsed' }];

  @tracked memberToEdit = null;
  @tracked newMemberModal = false;
  @tracked editMemberModal = false;
  @tracked showShareModal = false;
  @tracked showMemberListModal = false;
  @tracked showAboutTeamModal = false;
  @tracked selectedBoxIndex = this.currentIndex;
  @tracked selectedTime = moment();

  isCollapsed = false;

  @computed('model.members.{[],@each.id}')
  get savedMembers() {
    return this.model.members.filterBy('id');
  }

  @computed('savedMembers.{[],@each.name,@each.timezone}')
  get sortedMembers() {
    const membersToArray = this.savedMembers.toArray();
    membersToArray.sort(compareMemberTimeZones);

    const timezoneNow = guessTimezoneNow();
    membersToArray.unshiftObject({
      name: 'You',
      isCurrentUser: true,
      timezone: timezoneNow,
      id: 'current'
    });

    return membersToArray;
  }

  @computed('sortedMembers.[]')
  get timezones() {
    return createNewRows(this.sortedMembers);
  }

  @computed('timezones')
  get currentIndex() {
    return this.timezones[0].times.findIndex((t) => t.isCurrentTime);
  }

  @action
  selectBox(index, time) {
    this.selectedBoxIndex = index;
    this.selectedTime = time;
  }

  @action
  closeAboutTeamModal() {
    this.showAboutTeamModal = false;
  }

  @action
  openAboutTeamModal() {
    this.showAboutTeamModal  = true;
  }

  @action
  closeMemberListModal() {
    this.showMemberListModal = false;
  }

  @action
  openMemberListModal() {
    this.showMemberListModal  = true;
  }

  @action
  closeShareModal() {
    this.showShareModal = false;
  }

  @action
  openShareModal() {
    this.showShareModal = true;
  }

  @action
  closeEditMemberModal() {
    this.editMemberModal = false;
  }

  @action
  closeNewMemberModal() {
    this.newMemberModal = false;
  }

  @action
  newMember() {
    this.newMemberModal = true;
  }

  @action
  async saveMember(memberName, memberTimeZone) {
    await this.store.createRecord('member', {
      name: memberName,
      timezone: memberTimeZone,
      team: this.model
    }).save().then(() => this.newMemberModal = false);
  }

  @action
  scheduleEvent(time) {
    let rowTime = moment(time);

    rowTime.seconds(0)
    const googleFormatTimeStart = rowTime.format('YYYYMMDDTHHmmss');

    rowTime.add(1, 'hour');
    const googleFormatTimeEnd = rowTime.format('YYYYMMDDTHHmmss');

    const url = `${googleFormatTimeStart}/${googleFormatTimeEnd}`;
    openGoogleCalendarEvent(url, this.model.name);
  }

  @action
  async deleteTeam(team) {
    await team.destroyRecord();

    this.store.findAll('team').then(teams => {
      this.closeAboutTeamModal();
      const teamsArray = teams.toArray();

      if (isPresent(teamsArray)) {
        const teamToTransition = teamsArray.map(t => parseInt(t.id));
        const id = Math.min(...teamToTransition);
        this.transitionToRoute('landing.teams.team', id);
      } else {
        this.transitionToRoute('landing');
      }
    });
  }
}

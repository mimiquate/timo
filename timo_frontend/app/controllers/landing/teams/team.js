import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { compareMemberTimeZones, createRows } from 'timo-frontend/utils/timezone-functions';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import moment from 'moment';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
import { alias } from '@ember/object/computed';

export default class LandingTeamsTeamController extends Controller {
  @service media;
  @service session;

  @tracked newMemberModal = false;
  @tracked showShareModal = false;
  @tracked showMemberListModal = false;
  @tracked showAboutTeamModal = false;
  @tracked selectedBoxIndex = this.currentIndex;
  @tracked selectedTime = moment();
  @tracked isGrouped = false;
  @tracked isShowingCalendarPopover = false;
  @tracked sideNavBarIsOpen = false;
  @tracked showNewTeamModal = false;
  @tracked showToggleablePopover = false;
  @tracked showTeamOptions = false;

  @alias('model.teams') teams;

  rules({ oldItems }) {
    if (oldItems[0]) {
      return toLeft;
    } else {
      return toRight;
    }
  }

  @computed('model.team.members.{[],@each.id}')
  get savedMembers() {
    return this.model.team.members.filterBy('id');
  }

  @computed('savedMembers.{[],@each.name,@each.timezone}')
  get sortedMembers() {
    const members = this.savedMembers.toArray();
    members.sort(compareMemberTimeZones);

    const timezoneNow = guessTimezoneNow();
    members.unshiftObject({
      name: 'You',
      isCurrentUser: true,
      timezone: timezoneNow,
      id: 'current'
    });

    return members;
  }

  @computed('sortedMembers.[]', 'isGrouped', 'media')
  get timezones() {
    return createRows(this.sortedMembers, this.isGrouped, this.media.isMobile);
  }

  @computed('timezones')
  get currentIndex() {
    return this.timezones[0].times.findIndex((t) => t.isCurrentTime);
  }

  get showSideNavBar() {
    return this.media.isMobile && this.sideNavBarIsOpen;
  }

  @action
  openSideNavBar() {
    this.sideNavBarIsOpen = true;
  }

  @action
  closeSideNavBar() {
    if (this.media.isMobile) {
      this.isShowingCalendarPopover = false;
      this.sideNavBarIsOpen = false;
    }
  }

  @action
  openTeamModal() {
    this.closeSideNavBar();
    this.showNewTeamModal = true;
  }

  @action
  closeNewTeamModal() {
    this.showNewTeamModal = false;
  }

  @action
  groupTimezones() {
    this.toggleProperty('isGrouped');
    this.selectBox(this.currentIndex, moment());
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
    this.showTeamOptions = false;
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
  openTeamOptions() {
    this.showTeamOptions = true;
  }

  @action
  openShareModal() {
    this.showTeamOptions = false;
    this.showShareModal = true;
  }

  @action
  closeNewMemberModal() {
    this.newMemberModal = false;
  }

  @action
  newMember() {
    this.showTeamOptions = false;
    this.newMemberModal = true;
  }

  @action
  async saveMember(memberName, memberTimeZone) {
    await this.store.createRecord('member', {
      name: memberName,
      timezone: memberTimeZone,
      team: this.model.team
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
    openGoogleCalendarEvent(url, this.model.team.name);
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

  @action
  toggleCalendarPopoverBackground(value) {
    this.isShowingCalendarPopover = value;
  }

  @action
  async goToTeam(team) {
    await this.transitionToRoute('landing.teams.team', team.id);
    this.closeSideNavBar();
  }

  @action
  togglePopover() {
    this.showToggleablePopover = !this.showToggleablePopover;
  }

  @action
  async logOut() {
    this.session.invalidate();
    await this.currentUser.logOut();
    this.store.unloadAll();
    this.togglePopover();
    this.transitionToRoute('/login');
  }

  @action
  async saveTeam(newTeamName) {
    let team = this.store.createRecord('team', {
      name: newTeamName.trim(),
      user: this.currentUser.user
    });

    await team.save();
    await this.transitionToRoute('landing.teams.team', team.id);

    if (!this.media.isMobile) {
      const teamList = document.getElementsByClassName('sidenavbar__content').item(0);
      teamList.scrollTop = teamList.scrollHeight;
    }
  }
}

import Route from '@ember/routing/route';
import moment from 'moment';
import { hash } from 'rsvp';

export default class LandingTeamsTeamRoute extends Route {
  model(params) {
    const teams = this.modelFor('landing');
    const team = this.store.findRecord(
      'team',
      params.id,
      { include: 'members', reload: true }
    );

    return hash({
      teams,
      team
    })
  }

  resetController(controller) {
    const indexReset = controller.currentIndex;
    const timeNow = moment();

    controller.setProperties({
      isGrouped: false,
      selectedBoxIndex: indexReset,
      selectedTime: timeNow,
      isShowingCalendarPopover: false,
      newMemberModal: false,
      showShareModal: false,
      showMemberListModal: false,
      showAboutTeamModal: false,
      sideNavBarIsOpen: false,
      showNewTeamModal: false,
      showToggleablePopover: false
    });
  }
}

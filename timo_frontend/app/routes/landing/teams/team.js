import Route from '@ember/routing/route';
import moment from 'moment';
import { hash } from 'rsvp';

export default class LandingTeamsTeamRoute extends Route {
  model(params) {
    const teams = this.modelFor('landing');
    const team = this.store.findRecord(
      'team',
      params.id,
      { include: 'members.city', reload: true }
    );

    return hash({
      teams,
      team
    })
  }

  resetController(controller) {
    const selectedBoxIndex = controller.currentIndex;
    const selectedTime = moment();

    controller.setProperties({
      isGrouped: false,
      selectedBoxIndex,
      selectedTime,
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

import Route from '@ember/routing/route';
import moment from 'moment';

export default class LandingTeamsTeamRoute extends Route {
  model(params) {
    return this.store.findRecord(
      'team',
      params.id,
      { include: 'members', reload: true }
    );
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
      showAboutTeamModal: false
    });
  }
}

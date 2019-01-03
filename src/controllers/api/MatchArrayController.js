const Matching = require('matching');
class MatchArrayController {
  constructor() {

  }
  getMatch(data) {
    let m = new Matching(data.people);
    return m.match();
  }
}
module.exports = MatchArrayController;
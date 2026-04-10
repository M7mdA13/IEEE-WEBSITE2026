const router = require('express').Router();

router.use('/excom', require('./excom.routes'));
router.use('/committees', require('./committees.routes'));
router.use('/members', require('./members.routes'));
router.use('/events', require('./events.routes'));
router.use('/pages', require('./pages.routes'));
router.use('/recruitment', require('./recruitment.routes'));
router.use('/partners', require('./partners.routes'));
router.use('/mailing-list', require('./mailingList.routes'));
router.use('/website-team', require('./websiteTeam.routes'));

module.exports = router;

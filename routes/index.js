var express = require('express');
var router = express.Router();
var levels = require('../levels');

function getLevel(req) {
	return parseInt(req.signedCookies.level) || 0;
}

function renderLevel(res, level, error) {
	res.cookie('level', level, {httpOnly: true, signed: true});
	if (level < levels.length) {
		res.render('index', {question: levels[level].question, error: error});
	} else {
		res.render('finish');
	}
}

router.get('/', function(req, res) {
	renderLevel(res, getLevel(req), false);
});

router.post('/', function(req, res) {
  var level = getLevel(req);
  var error = level < levels.length && req.body.answer != levels[level].answer;
  level += error ? 0 : 1;
  renderLevel(res, level, error);
});

router.get('/new', function(req, res) {
	res.clearCookie('level');
	res.redirect('/');
});

module.exports = router;

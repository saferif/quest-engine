var express = require('express');
var router = express.Router();
var levels = require('../levels');

function getLevel(req) {
	var level = 0;
	if (req.signedCookies.level) {
		level = req.signedCookies.level;
	}
	return level;
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

  if (level >= levels.length) {
  	res.render('finish');
  } else {
  	if (req.body.answer == levels[level].answer) {
  		++level;
  		renderLevel(res, level, false);
  	} else {
  		renderLevel(res, level, true);
  	}
  }
});

router.get('/new', function(req, res) {
	res.clearCookie('level');
	res.redirect('/');
});

module.exports = router;

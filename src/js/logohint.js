"use strict";

var logohint = execMain(function() {

	var msgList = [];
	var curMsg;
	var logo;
	var logocc;
	var curPosition = 0;

	var isMouseIn = false;
	var startTime;
	var targetIdent = 0;
	var enabled = false;

	function msgFinished() {
		curMsg = undefined;
		render();
	}

	function render() {
		if (isMouseIn) {
			logocc.removeClass('hint');
			logocc.html('ABOUT');
			curMsg = undefined;
			return;
		}
		if (curMsg != undefined) {
			return;
		}
		curMsg = msgList.shift();
		if (curMsg == undefined) {
			logocc.removeClass('hint');
			logocc.html('csTimer');
			return;
		}
		logocc.html('<div class="pad" style="width: ' + logo.width() + 'px; ">csTimer</div><span style="font-family: sans-serif; margin: 0 1em 0 1em;">' + curMsg + '</span><div class="pad" style="width: ' + logo.width() + 'px; position: absolute;">csTimer</div>');
		logocc.removeClass('hint');
		var duration = (curMsg.length + 15) * 0.1 + 's';
		logocc.css({
			'-webkit-animation-duration': duration,
			'-moz-animation-duration': duration,
			'animation-duration': duration
		});
		setTimeout(function() {
			logocc.addClass('hint');
		});
	}

	function checkAnimation() {
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
			pfx = '',
			elem = document.createElement('div');
		if (elem.style.animationName !== undefined) {
			return true;
		}
		if (animation === false) {
			for (var i = 0; i < domPrefixes.length; i++) {
				if (elem.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
					pfx = domPrefixes[i];
					animationstring = pfx + 'Animation';
					keyframeprefix = '-' + pfx.toLowerCase() + '-';
					return true;
				}
			}
		}
		return false;
	}

	$(function() {
		logo = $('#logo');
		logocc = logo.children().children();
		logocc.bind('oanimationend animationend webkitAnimationEnd', msgFinished);
		var about = $('#about');
		var title = about.children('h1').appendTo(kernel.temp).html();
		logo.mouseenter(function() {
			isMouseIn = true;
			render();
		});
		logo.mouseleave(function() {
			isMouseIn = false;
			render();
		});
		logo.click(function() {
			if (location.protocol != 'https:' && confirm('Your access to csTimer is unsafe. Press OK for safe access.')) {
				location.protocol = 'https:';
			}
			about.show();
			kernel.showDialog([about, 0, undefined, 0], 'logo', title);
		});
		about.hide();
		kernel.regProp('kernel', 'useLogo', 0, USE_LOGOHINT, [true]);


		enabled = checkAnimation();
	});

	return {
		push: function(msg) {
			if (!enabled || !kernel.getProp('useLogo', true)) {
				return;
			}
			msgList.push(msg);
			render();
		}
	}
});
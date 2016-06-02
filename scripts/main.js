// ======================= DOM Utility Functions from PastryKit =============================== //

// Sure, we could use jQuery or XUI for these,
// but these are concise and will work with plain vanilla JS

Element.prototype.hasClassName = function (a) {
	return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function (a) {
	if (!this.hasClassName(a)) {
		this.className = [this.className, a].join(" ");
	}
};

Element.prototype.removeClassName = function (b) {
	if (this.hasClassName(b)) {
		let a = this.className;
		this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
	}
};

Element.prototype.toggleClassName = function (a) {
	this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a);
};

// YOUTUBE API (disabled! before enabling this be sure to disable 'VIDEO PLAYER')//
// let tag = document.createElement('script');
// tag.src = 'https://www.youtube.com/player_api';
// let firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// let tv, playerDefaults = {
// 	autoplay: 0,
// 	autohide: 1,
// 	modestbranding: 0,
// 	rel: 0,
// 	showinfo: 0,
// 	controls: 0,
// 	disablekb: 1,
// 	enablejsapi: 0,
// 	iv_load_policy: 3
// };
// let vid = [
// 	{
// 	'videoId': 'YQKgBmb2WoU',
// 	'startSeconds': 515,
// 	'endSeconds': 690,
// 	'suggestedQuality': 'hd720'
// 	},
// 	{
// 	'videoId': '9ge5PzHSS0Y',
// 	'startSeconds': 465,
// 	'endSeconds': 657,
// 	'suggestedQuality': 'hd720'
// 	},
// 	{
// 	'videoId': 'OWsCt7B-KWs',
// 	'startSeconds': 0,
// 	'endSeconds': 240,
// 	'suggestedQuality': 'hd720'
// 	},
// 	{
// 	'videoId': 'qMR-mPlyduE',
// 	'startSeconds': 19,
// 	'endSeconds': 241,
// 	'suggestedQuality': 'hd720'
// 	}
// ]
//
// function onYouTubePlayerAPIReady() {
// 	tv = new YT.Player('tv', {
// 		events: {
// 			'onReady': onPlayerReady,
// 			'onStateChange': onPlayerStateChange
// 		},
// 		playerVars: playerDefaults
// 	});
// }
//
// function onPlayerReady() {
// 	tv.loadVideoById(vid[randomvid]);
// 	tv.mute();
// }
// function onPlayerStateChange(e) {
// 	if (e.data === 1) {
// 		$('#tv').addClass('active');
// 	} else if (e.data === 0) {
// 		tv.seekTo(vid[randomvid].startSeconds);
// 	}
// }
// function vidRescale() {
// 	var w = $(window).width() + 200, h = $(window).height() + 200;
// 	if (w / h > 16 / 9) {
// 		tv.setSize(w, w / 16 * 9);
// 		$('.tv .screen').css({ 'left': '0px' });
// 	} else {
// 		tv.setSize(h / 9 * 16, h);
// 		$('.tv .screen').css({ 'left': -($('.tv .screen').outerWidth() - w) / 2 });
// 	}
// }
//
// $(window).on('load resize', function () {
// 	vidRescale();
// });
//
// $('.hi span').on('click', function () {
// 	$('#tv').toggleClass('mute');
// 	if ($('#tv').hasClass('mute')) {
// 		tv.mute();
// 	} else {
// 		tv.unMute();
// 	}
// });

// VIDEO PLAYER

$(document).ready(function(){

	let duration, bypass = true;
	let vid1 = document.getElementsByClassName('fade-in-video')[0];

	vid1.addEventListener("durationchange", function(e){
		duration = this.duration;
	});
	vid1.addEventListener("timeupdate", function(e){
		if(vid1.currentTime > duration - 0.6 && bypass) {
			bypass = false;
			this.classList.remove('is-playing');
			setTimeout(function(){
				vid1.currentTime = 0;
				bypass = true;
			}, 600);
		};

	});

})

$(window).on('load', function(){

	let vid1 = document.getElementsByClassName('fade-in-video')[0];
	vid1.load();
	vid1.addEventListener("canplay", function(e){
		if(vid1.currentTime === 0) {
			vid1.play();
		};
	});

	vid1.addEventListener("playing", function(e){
		vid1.classList.add('is-playing');
	});

// FLIP PLAY PAUSE ICONS

	let card = document.getElementsByClassName('card')[0];
	card.addEventListener('click', function() {
		switchState(vid1);
		card.toggleClassName('flipped');
	});

	$('.container').show(function(){
		$('.center-wrapper').fadeOut(0).delay(800).fadeIn(1200, 'swing', function(){
			$('.tile').fadeTo(0, 0.5, 'linear')
			.delay(150).fadeTo(0, 1, 'linear')
			.delay(150).fadeTo(0, 0.5, 'linear')
			.delay(150).fadeTo(0, 1, 'linear')
			.delay(150).fadeTo(0, 0.7, 'linear', function(){
				$('#startBtn').css('background-color', 'hsl(0, 41%, 43%)');
				$('#strictBtn').css('background-color', 'hsl(48, 46%, 41%)');
				$('.center-wrapper').css('background-color', 'rgba(171, 171, 171, 0.8)');
				$('#infoIc, .vidPPWrapper').fadeIn(600);
				$('.hi').addClass('flipIn');
			});
		});
	});
});

function switchState(v) {
	if (v.paused == true) v.play();
	else v.pause();
}

/* SIMON GAME */

let sequence = [];
let copy = [];
let turn = 0;
let timeouts = [];
let delay;
let boardTimeoutId;
let simon = {};

simon.masterSw = false;
simon.strict = false;

simon.start = function() {
	simon.reset();
	delay = setTimeout(function() {
		advanceTurn();
		playSeq();
	}, 1500);
}

simon.reset = function() {
	clearTimeout(delay);
	stopTimeouts();
	disableBoard();
	sequence = sequence.slice(0, 0);
	copy = copy.slice(0, 0);
	turn = 0;
}

function finalAnimation() {

	$('.board, .center img').addClass('active');
	$('.center-wrapper').fadeOut(500).parent('.center').find('img').addClass('active');
	$('#displayTurn').children('h2').text('!!');
	simon.reset;

	setTimeout(function(){
		$('.final').fadeIn(500).addClass('active').delay(10800).fadeOut(500);
	}, 500);

	$('.board').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
		$('.board, .center img').removeClass('active');

		setTimeout(function(){
			$('.center-wrapper').fadeIn(1000);
		}, 100);
	});
}

let playSound = function(_note) {
	$('audio')[_note].currentTime=0;
	$('audio')[_note].play();
}

let animate = function(_note) {
	let tiles = $('.tile');
	let trgTile = $(tiles[_note]);

	tiles.removeClass('active');
	trgTile.addClass('active');

	setTimeout(function() {
		trgTile.removeClass('active');
	}, 300);
}

let advanceTurn = function () {
	let random = Math.floor(Math.random() * 4);
	sequence.push(random);
	++turn;
	turn = turn < 10 ? '0' + turn : turn;
	$('#displayTurn').children('h2').text(turn);
}

let incrementalTimeout = function(i, _note, _playRate) {

	let timeoutId = setTimeout(function() {
		playSound(_note);
		animate(_note);

		if (timeouts[0] === timeoutId) {
			timeouts.shift();
		}
		if(!timeouts.length) {

			setTimeout(function() {
				copy = sequence.slice(0);
				enableBoard();
			}, 200);
		}

	}, i * _playRate);

	timeouts.push(timeoutId);
};


let stopTimeouts = function() {
	for(let i = 0; i < timeouts.length; ++i) {
		clearTimeout(timeouts[i]);
	}
	timeouts = timeouts.slice(0, 0);
}


let playSeq = function() {
	clearTimeout(boardTimeoutId);

	for (let i = 0; i < sequence.length; ++i) {
		let note = sequence[i];
		let playRate;
		if (turn <= 15) playRate = 1035 - (35 * turn);
		else playRate = 450;
		incrementalTimeout(i, note, playRate);
	}

};

let inputCheck = function(note) {

	if(copy[0] == note) {
		playSound(note);
		copy.shift();

		if (!copy.length && sequence.length >= 1) {
			disableBoard();
			setTimeout(function() {
				finalAnimation()
				sequence = sequence.slice(0, 0);
			},500);
		}
		else if (!copy.length) {
			disableBoard();
			delay = setTimeout(function() {
				advanceTurn();
				playSeq();
			},1500);
		}
	}
	else {
		if (simon.strict) {
			playSound(4);
			simon.start();
		}
		else {
			playSound(4);
			disableBoard();
			delay = setTimeout(function() {
				playSeq();
			},1500);
		}
	}
}

/* GAME BUTTONS, CONTROLS, EVENT LISTENERS */

function enableControls() {
	$('#displayTurn').children('h2').text('--').css('color', 'rgba(255, 56, 56, 1)');

	$('#startBtn').on('click', function(e){
		e.preventDefault();
		simon.start();
		$('#displayTurn').children('h2').text('--').css('color', 'rgba(255, 56, 56, 1)');
	})

	$('#strictBtn').on('click', function(e){
		e.preventDefault();
		let led = $('.led');
		led.toggleClass('strictModeOn');

		if (led.hasClass('strictModeOn')) {
			simon.strict = true;
		} else {
			simon.strict = false;
		}
	});
}

function disableControls() {
	$('#startBtn, #strictBtn').off('click');
	$('#displayTurn').children('h2').text('--').css('color', '#100');
}

$('.center').on('click', '.masterSwWrapper', function(){
	if (!simon.masterSw) {
		enableControls();
		simon.masterSw = true;
		simon.strict = false;
		$('.masterSwWrapper').children('.masterSw').addClass('active');
		$('.tile').fadeTo(0, 1);
		$('#startBtn').css('background-color', 'hsl(0, 100%, 63%)');
		$('#strictBtn').css('background-color', 'hsl(48, 99%, 62%)');
		$('.center-wrapper').css('background-color', 'rgba(196, 196, 196, .9)');
	}
	else {
		simon.masterSw = false;
		simon.reset();
		disableControls();
		$('.led').removeClass('strictModeOn');
		$('.masterSwWrapper').children('.masterSw').removeClass('active');
		$('.tile').fadeTo(0, 0.7, 'swing');
		$('#startBtn').css('background-color', 'hsl(0, 41%, 43%)');
		$('#strictBtn').css('background-color', 'hsl(48, 46%, 41%)');
		$('.center-wrapper').css('background-color', 'rgba(171, 171, 171, .8)');
	}
});

let boardActiveTime = function() {
	clearTimeout(boardTimeoutId);
	boardTimeoutId = setTimeout(function(){
		disableBoard();
		playSeq();

	}, 6000);
}

function enableBoard(){

	boardActiveTime();
	$('.board')
		.on('click', '[data-tile]', function(e){
			let btnSelectd = $(e.target).data('tile');
			inputCheck(btnSelectd);
			boardActiveTime();
		})

		.on('mousedown touchstart', '[data-tile]', function(){
			$(this).addClass('active');

		})

		.on('mouseup mouseout touchend', '[data-tile]', function(){
			$(this).removeClass('active');
		})
}

function disableBoard(){
	$('.board')
		.off('click touchend mousedown touchstart mouseup mouseout');
}

$('.hi').on('click', function(){
	$(this).addClass('flipOut');
})

$('body').on('click', '#infoIc, .overlay, .modal-wrapper', function(){
	let overl = $('.overlay').hasClass('active');
	if(!overl) {
		$('body, .overlay, .modal-wrapper').removeClass('unactive');
		$('body, .overlay, .modal-wrapper').addClass('active');
	}
	else {
		$('body, .overlay, .modal-wrapper').removeClass('active');
		$('body, .overlay, .modal-wrapper').addClass('unactive');
	}
});

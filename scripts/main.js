<<<<<<< HEAD
$(document).ready(function(){
	let iOS = /iPad|iPhone|iPod/.test(navigator.platform);
	if( iOS ) {
	    var background_videos = document.querySelectorAll('.bgvid');
	    for( i=0; i<background_videos.length; i++ ) {
	        background_videos[i].parentNode.removeChild(background_videos[i]);
	    }
	}
=======

// let iOS = /iPad|iPhone|iPod/.test(navigator.platform);
// if( iOS ) {
//     var background_videos = document.querySelectorAll('.bgvid');
//     for( i=0; i<background_videos.length; i++ ) {
//         background_videos[i].parentNode.removeChild(background_videos[i]);
//     }
// }

$(document).ready(function(){

	if (localStorage.getItem("demo") === null) {
		var oReq = new XMLHttpRequest();
		var url = "http://encoding.com.result.s3.amazonaws.com/574960b7c4fea3206b98299299a004e9_386231_208279910.mp4";
		oReq.open('POST', url, true);
		oReq.responseType = "arraybuffer";console.log(oReq.response);
		oReq.onload = function(oEvent) {
			let blob = new Blob([oReq.response], {type: 'video/mp4'});
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = function(e) {
				var dataURL = reader.result;
				localStorage.setItem("demo", dataURL);
				location.reload();
			}
			oReq.send();
		}
	}

	var videlem = document.createElement("video");
	videlem.autoplay = true;
	videlem.loop = true;
	videlem.poster = "https://www.dropbox.com/s/gfsu9tdeaam9kas/Coffee-Shot.jpg?raw=1";
	videlem.id = "bgvid";
	var sourceMP4 = document.createElement("source");
	sourceMP4.type = "video/mp4";
	sourceMP4.src = localStorage.getItem("demo");
	sourceMP4.autoPlay = true;
	videlem.appendChild(sourceMP4);
	document.body.appendChild(videlem);

});


$(document).ready(function(){
>>>>>>> 7a8198bc029e2c4d226aa40105b134bce3e49655
	let fade_in_videos = document.querySelectorAll('.fade-in-video');
	for( i=0; i<fade_in_videos.length; i++ ) {
	    fade_in_videos[i].addEventListener("playing", function(){
	        this.className += ' is-playing';
	    });
	}
})

$(window).on('load', function(){
	$('body').addClass('active');
	$('.container').show(function(){
		$('.center-wrapper').fadeOut(0).delay(800).fadeIn(1200, 'swing', function(){
			$('.tile').fadeTo(0, 0.5, 'linear')
			.delay(150).fadeTo(0, 1, 'linear')
			.delay(150).fadeTo(0, 0.5, 'linear')
			.delay(150).fadeTo(0, 1, 'linear')
			.delay(150).fadeTo(0, 0.7, 'linear', function(){
				$('#startBtn').css('background-color', 'hsl(0, 41%, 43%)');
				$('#strictBtn').css('background-color', 'hsl(48, 46%, 41%)');
				$('.center').css('background-color', '#999');
				$('#cog_icon').fadeIn(900);
				$('body').removeClass('active');
			});
		});
	});
});


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
	},1500);
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
	$('body').css('overflow', 'hidden');
	$('body').find('.board').addClass('rollEnd');
	$('.center-wrapper').fadeOut(2000);
	$('#displayTurn').children('h2').text('--');
	simon.reset;

	setTimeout(function(){
		$('.final').fadeIn(1500).delay(2000).fadeOut(500);
	}, 2000);

	$('.board').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
		$('body').css('overflow', 'auto');
		$('.board').removeClass('rollEnd');

		setTimeout(function(){
			$('.center-wrapper').fadeIn(400);
		}, 400);
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

	timeouts.push(timeoutId); 	//console.log('timeouts arr: ' + timeouts);
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
		if (turn <= 15) playRate = 1250 - (50 * turn);
		else playRate = 450;
		incrementalTimeout(i, note, playRate);
	}

};

let inputCheck = function(note) {

	if(copy[0] == note) {
		playSound(note);
		copy.shift();

		if (!copy.length && sequence.length >= 20) {
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
		$('.tile').fadeTo(0, 1, 'swing');
		$('#startBtn').css('background-color', 'hsl(0, 100%, 63%)');
		$('#strictBtn').css('background-color', 'hsl(48, 99%, 62%)');
		$('.center').css('background-color', '#bbb');
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
		$('.center').css('background-color', '#999');
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

$('body').on('click', '#cog_icon', function(){
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

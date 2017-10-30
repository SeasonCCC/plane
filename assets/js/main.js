;(function(){
	var game = new Phaser.Game(240, 400, Phaser.AUTO, 'game');

	game.states = {};

	game.states.preload = {
		preload: function(){
			game.load.image('loading', './assets/images/preloader.gif');
			if (!game.device.desktop) {
				game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			}

		}, 
		create: function(){
			game.state.start('load');
		}
	}


	game.states.load = {
		preload: function(){
			var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
			game.load.setPreloadSprite(preloadSprite);
			game.load.image('background', './assets/images/bg.jpg');
			game.load.image('copyright', './assets/images/copyright.png');
			game.load.spritesheet('myplane', './assets/images/myplane.png', 40, 40, 4);
			game.load.spritesheet('startbutton', './assets/images/startbutton.png', 100, 40, 2);
			game.load.spritesheet('replaybutton', './assets/images/replaybutton.png', 80, 30, 2);
			game.load.spritesheet('sharebutton', './assets/images/sharebutton.png', 80, 30, 2);
			game.load.image('mybullet', './assets/images/mybullet.png');
			game.load.image('bullet', './assets/images/bullet.png');
			game.load.image('enemy1', './assets/images/enemy1.png');
			game.load.image('enemy2', './assets/images/enemy2.png');
			game.load.image('enemy3', './assets/images/enemy3.png');
			game.load.spritesheet('explode1', './assets/images/explode1.png', 20, 20, 3);
			game.load.spritesheet('explode2', './assets/images/explode2.png', 30, 30, 3);
			game.load.spritesheet('explode3', './assets/images/explode3.png', 50, 50, 3);
			game.load.spritesheet('myexplode', './assets/images/myexplode.png', 40, 40, 3);
			game.load.image('award', './assets/images/award.png');
			game.load.audio('normalback', './assets/images/normalback.mp3');
			game.load.audio('playback', './assets/images/playback.mp3');
			game.load.audio('fashe', './assets/images/fashe.mp3');
			game.load.audio('crash1', './assets/images/crash1.mp3');
			game.load.audio('crash2', './assets/images/crash2.mp3');
			game.load.audio('crash3', './assets/images/crash3.mp3');
			game.load.audio('ao', './assets/images/ao.mp3');
			game.load.audio('pi', './assets/images/pi.mp3');
			game.load.audio('deng', './assets/images/deng.mp3');	
			// game.load.onFileComplete.add(function(){
			// 	console.log(arguments);
			// });
		},
		create: function(){
			game.state.start('start');
		}

	}


	game.states.start = {
		create: function(){
			game.add.image(0, 0, 'background');
			var myplane = game.add.sprite(game.world.centerX - 20, 100, 'myplane');
			myplane.animations.add('fly');
			myplane.animations.play('fly', 10, true);

			game.add.button(game.world.centerX - 50, 200, 'startbutton', this.onStart, this, 1, 1, 0, 1);
		},
		onStart: function() {
			game.state.start('play');
		}
	}


	game.states.play = {
		create: function(){
			game.add.tileSprite(0, 0, game.width, game.height, 'background').autoScroll(0, 20);

			this.myplane = game.add.sprite(game.world.centerX - 20, 100, 'myplane');
			this.myplane.animations.add('fly');
			this.myplane.animations.play('fly', 10, true);
			var tween = game.add.tween(this.myplane).to({ y: game.height - 40}, 1000, null, true);
			tween.onComplete.add(this.onBegin, this);
		},
		onBegin: function(){
			this.myplane.inputEnabled = true;
			this.myplane.input.enableDrag();
			var style = { font: "16px Arial", fill: "#ff0044"};
			var text = game.add.text(0	, 0, "Score: 0", style);
		}
	}




	game.state.add('preload', game.states.preload);
	game.state.add('load', game.states.load);
	game.state.add('start', game.states.start);
	game.state.add('play', game.states.play);
	game.state.start('preload');

})();


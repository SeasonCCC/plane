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

	// 加载游戏资源
	game.states.load = {
		preload: function(){
			var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
			game.load.setPreloadSprite(preloadSprite);
			game.load.image('background', './assets/images/bg.jpg');
			game.load.image('copyright', './assets/images/copyright.png');
			game.load.spritesheet('myPlane', './assets/images/myPlane.png', 40, 40, 4);
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

	// 游戏开始页面
	game.states.start = {
		create: function(){
			game.add.image(0, 0, 'background');
			var myPlane = game.add.sprite(game.world.centerX - 20, 100, 'myPlane');
			myPlane.animations.add('fly');
			myPlane.animations.play('fly', 10, true);

			game.add.button(game.world.centerX - 50, 200, 'startbutton', this.onStart, this, 1, 1, 0, 1);
		},
		onStart: function() {
			game.state.start('play');
		}
	}

	// 战斗页面
	game.states.play = {
		create: function(){
			// 开启游戏物理引擎
			game.physics.startSystem(Phaser.Physics.ARCADE);

			// 背景滚动
			game.add.tileSprite(0, 0, game.width, game.height, 'background').autoScroll(0, 20);

			// 我方机体
			this.myPlane = game.add.sprite(game.world.centerX - 20, 100, 'myPlane');
			this.myPlane.animations.add('fly');
			this.myPlane.animations.play('fly', 10, true);
			game.physics.arcade.enable(this.myPlane);
			this.myPlane.body.collideWorldBounds = true;

			// 飞机飞到底部
			var tween = game.add.tween(this.myPlane).to({ y: game.height - 40}, 1000, null, true);
			tween.onComplete.add(this.onBegin, this);
		},
		update: function(){
			if (this.startPlay) {
				this.myPlaneFire();
				this.generateEnemy();
				this.enemyFire();
				game.physics.arcade.overlap(this.myBullets, this.enemys, this.hitEnemy, null, this);
				game.physics.arcade.overlap(this.enemysBullets, this.myPlane, this.hitPlane, null, this);
				console.log(this.enemysAnimation.length);
			}

			// 子弹和敌机发生碰撞
			
		},
		onBegin: function(){
			// 飞机拖动
			this.myPlane.inputEnabled = true;
			this.myPlane.input.enableDrag();

			// 子弹组合
			this.myBullets = game.add.group();

			// 敌机组合
			this.enemys = game.add.group();
			this.enemys.genTime = 0;

			// 敌机子弹组合
			this.enemysBullets = game.add.group();

			// 敌机破坏动画组合
			this.enemysAnimation = game.add.group();

			// 分数
			var style = { font: "16px Arial", fill: "#ff0044"};
			var text = game.add.text(0	, 0, "Score: 0", style);
			this.lastBulletTime = 0;

			// 开启游戏
			this.startPlay = true;
		},
		myPlaneFire: function(){
			var now = new Date().getTime();
			// 发射子弹
			if (now - this.lastBulletTime > 500) {
				var myBullet = this.myBullets.getFirstExists(false);
				if (myBullet) {
					myBullet.reset(this.myPlane.x, this.myPlane.y);	
				}else{
					myBullet = game.add.sprite(this.myPlane.x, this.myPlane.y, 'mybullet');
					myBullet.outOfBoundsKill = true;
					myBullet.checkWorldBounds = true;
					this.myBullets.addChild(myBullet);
					game.physics.enable(myBullet, Phaser.Physics.ARCADE);
				}
				myBullet.body.velocity.y = -200;
				this.lastBulletTime = now;
			}
		},
		generateEnemy: function(){
			var now = new Date().getTime();
			if (now - this.enemys.genTime > 1000) {
				var rand = game.rnd.integerInRange(1, 3);
				var key = 'enemy' + rand;
				var size = game.cache.getImage(key).width;

				var x = game.rnd.integerInRange(size/2, game.width - size/2);
				var y = size/2;

				var enemy = this.enemys.getFirstExists(false, true, x, y, key);
				enemy.outOfBoundsKill = true;
				enemy.checkWorldBounds = true;

				enemy.anchor.setTo(0.5, 0.5);
				game.physics.arcade.enable(enemy);
				enemy.body.velocity.y = 100;
				enemy.body.setSize(size, size);
				enemy.lastFireTime = 0;
				enemy.size = size;
				enemy.explode = 'explode' + rand;

				if (rand == 1) {
					enemy.life = 1;
				} else if(rand == 2) {
					enemy.life = 2;
				}else{
					enemy.life = 3;
				}

				this.enemys.genTime = now;
			}
			// 敌机
			// this.enemy = game.add.sprite(game.world.centerX, 0, 'enemy1');
			// game.physics.arcade.enable(this.enemy);
		},
		enemyFire: function(){
			var now = new Date().getTime();
			this.enemys.forEachAlive(function(enemy){
				if (now - enemy.lastFireTime > 1000) {
					var bullet = this.enemysBullets.getFirstExists(false, true, enemy.x, enemy.y + enemy.size/2, 'bullet');
					bullet.outOfBoundsKill = true;
					bullet.checkWorldBounds = true;		
					bullet.anchor.setTo(0.5, 0.5);
					game.physics.arcade.enable(bullet);
					bullet.body.velocity.y = 200;
					
					enemy.lastFireTime = now;
				}
			}, this);
		},
		hitEnemy: function(bullet, enemy){
			bullet.kill();
			if (enemy.life <= 0) {
				enemy.kill();
				var explode = this.enemysAnimation.getFirstExists(false, true, enemy.x, enemy.y, enemy.explode);
				// var explode = game.add.sprite(enemy.x, enemy.y, enemy.explode);
				explode.anchor.setTo(0.5, 0.5);
				var anim = explode.animations.add('animation');
				anim.play(20, false, false);

				anim.onComplete.addOnce(function(){
					explode.destroy();
				});
			} else {
				enemy.life--;
			}	
		},
		hitPlane: function(bullet, plane){
			bullet.kill();
			plane.kill();
		},
		// render: function(){
		// 	if (this.enemys) {
		// 		this.enemys.forEachAlive(function(enemy){
		// 			game.debug.body(enemy);
		// 		})
				
		// 	}
		// }

	}




	game.state.add('preload', game.states.preload);
	game.state.add('load', game.states.load);
	game.state.add('start', game.states.start);
	game.state.add('play', game.states.play);
	game.state.start('preload');

})();


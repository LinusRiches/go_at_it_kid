//INITIAL LOAD, CANVAS BACKGROUND CONSTS

window.addEventListener('load', function () {
	const gamespace = document.getElementById('gamespace');
	const brick_bg = this.document.getElementById('brick_bg');
	const context = gamespace.getContext('2d');

	//GAMETITLE (not sure if I need it so i replaced it with assets/null)

	const titleImage = new Image();
	titleImage.src = 'assets/null.png';
	const GameTitle = { x: 450, y: 0, width: 500, height: 80, };

	//CHICKEN OBJECT

	const chickenImage = new Image();
	chickenImage.src = 'assets/chicken.png';
	const Chicken = { x: 350, y: 636, width: 64, height: 64, };

	//CANVAS AND BACKGROUND DIMENSIONS

	gamespace.width = 1300
	gamespace.height = 700
	brick_bg.width = 1432
	brick_bg.height = 768

	//PLAYER OBJECT

	var playerImage = new Image();
	playerImage.src = 'assets/goat.png';
	var Player = { x: 350, y: 150, width: 64, height: 64, speed: 3, gravity: 0.3, velocityY: 0, };

	// KEY CONTROL EVENT LISTENERS

	const keys = {};
	window.addEventListener('keydown', function (e) { e.preventDefault(); keys[e.key] = true; });
	window.addEventListener('keyup', function (e) { e.preventDefault(); keys[e.key] = false; });

	// MUSIC & SOUND FUNCTION

	var SoundCollide = new Audio('assets/bingo.wav');
	SoundCollide.loop = false;
	var MusicChilderness = new Audio('assets/childerness.wav');
	MusicChilderness.loop = false;

	// COLLISION FUNCTION

	function collisionDetecting(Player, Chicken) {
		if (Player.x >= Chicken.x && Player.x <= Chicken.x + 48 && Player.y -2 > Chicken.y -2){ console.log("Player colliding with an object to the left"); SoundCollide.play(); Player.x = Chicken.x + 48};
		if (Player.x >= Chicken.x - 48 && Player.x <= Chicken.x && Player.y -2 > Chicken.y -2){ console.log("Player colliding with an object to the right"); SoundCollide.play(); Player.x = Chicken.x - 48;};
		if (Player.y >= Chicken.y - 48 && Player.y <= Chicken.y + 32 && Player.x <= Chicken.x + 32 && Player.x >= Chicken.x - 32){ console.log("Player colliding with an object below"), SoundCollide.play(), Player.y = Chicken.y - 48, Player.velocityY = 0};
	};

	// BOUNDING, ONGROUND AND JUMP FUNCTIONS

	const groundHeight = 636;
	const ceilingHeight = -5;

	function onGround() {
		return Player.y >= groundHeight;
	};

	function jump() {
		if (keys[' '] && onGround()) { Player.velocityY = -12;};
	};

	function boundingBox(Player) {
		if (Player.y < ceilingHeight) { Player.y = ceilingHeight, Player.velocityY = 0 }
		else if (Player.y > groundHeight) { Player.y = groundHeight, Player.velocityY = 0 }
		else if (Player.x < -5) { Player.x = -5 }
		else if (Player.x > 1250) { Player.x = 1250 }
	};

	// MUSIC

	MusicChilderness.play();

	// 🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨

	function gameloop() {
		context.clearRect(0, 0, gamespace.width, gamespace.height); context.imageSmoothingEnabled = false;

		// KEY CHECK AND BINDINGS

		jump();
		const speed = keys['c'] ? Player.speed + 1.75 : Player.speed;
		if (keys['a']) Player.x -= speed;
		if (keys['d']) Player.x += speed;

		Player.velocityY += Player.gravity; Player.y += Player.velocityY

		// DRAW OBJECTS (PLAYER AND ROCK)

		context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height);
		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);
		context.drawImage(chickenImage, Chicken.x, Chicken.y, Chicken.width, Chicken.height);

		// CALLING COLLISION AND BOUNDING FUNCTION

		collisionDetecting(Player, Chicken);
		boundingBox(Player);

		// NEXT FRAME

		requestAnimationFrame(gameloop);
	};

	playerImage.onload = gameloop
})
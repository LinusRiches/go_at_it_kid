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
	const Chicken = { x: 350, y: 350, width: 64, height: 64, };

	//CANVAS AND BACKGROUND DIMENSIONS

	gamespace.width = 1300
	gamespace.height = 700
	brick_bg.width = 1800
	brick_bg.height = 1200

	//PLAYER OBJECT

	var playerImage = new Image();
	playerImage.src = 'assets/goat.png';
	var Player = { x: 200, y: 150, width: 64, height: 64, speed: 3, gravity: 3,};

	// KEY CONTROL EVENT LISTENERS

	const keys = {};
	window.addEventListener('keydown', function (e) { e.preventDefault(); keys[e.key] = true; });
	window.addEventListener('keyup', function (e) { e.preventDefault(); keys[e.key] = false; });

	// MUSIC & SOUND FUNCTION

	var SoundCollide = new Audio('assets/bingo.wav');
	SoundCollide.loop = false;
	var MusicChilderness = new Audio('assets/childerness.wav');
	MusicChilderness.loop = true;

	// COLLISION FUNCTION

	function collisionDetecting(Player, Chicken) {
		if (Player.x + Player.width >= Chicken.x && Player.x <= Chicken.x + Chicken.width && Player.y + Player.height >= Chicken.y && Player.y <= Chicken.y + Chicken.height) { console.log("collision yaaaay"); SoundCollide.play(); }
	};

	// BOUNDING FUNCTION FOR CEILING, WALLS AND FLOOR

	function boundingBox(Player) {
		if (Player.y < 3) { Player.y = 3 }
		else if (Player.y > 893) { Player.y = 893 }
		else if (Player.x < -5) { Player.x = -5 }
		else if (Player.x > 1385) { Player.x = 1385 }
	};

	// 🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨
	function gameloop() {
		context.clearRect(0, 0, gamespace.width, gamespace.height); context.imageSmoothingEnabled = false;

		// KEY CHECK AND BINDINGS

		const speed = keys['c'] ? Player.speed + 1.5 : Player.speed;
		if (keys['w']) Player.y -= speed;
		if (keys['s']) Player.y += speed;
		if (keys['a']) Player.x -= speed;
		if (keys['d']) Player.x += speed;

		// DRAW OBJECTS (PLAYER AND ROCK)

		context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height);
		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);
		context.drawImage(chickenImage, Chicken.x, Chicken.y, Chicken.width, Chicken.height);

		// CALLING COLLISION AND BOUNDING FUNCTION

		collisionDetecting(Player, Chicken);
		boundingBox(Player);

		// NEXT FRAME

		requestAnimationFrame(gameloop);

		// MUSIC LOOP
		
		MusicChilderness.play();
	};

	playerImage.onload = gameloop
})
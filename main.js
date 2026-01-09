//INITIAL LOAD, CANVAS BACKGROUND CONSTS

window.addEventListener('load', function()
	{const canvas = document.getElementById('canvas1');
	const bgimg = this.document.getElementById('bgimg');
	const context = canvas.getContext('2d');

//GAMETITLE

	const titleImage = new Image();
	titleImage.src = 'assets/title.png';
	const GameTitle = {x: 450, y: 0, width: 500, height: 80,};

//CHICKEN OBJECT

	const chickenImage = new Image();
	chickenImage.src = 'assets/chicken.png';
	const Chicken = {x: 350, y: 350, width: 64, height: 64,};

//CANVAS AND BACKGROUND DIMENSIONS

	canvas.width = 1440
	canvas.height = 960
	bgimg.width =  1800
	bgimg.height = 1200

//PLAYER OBJECT

	var playerImage = new Image();
		playerImage.src = 'assets/goat.png';
	var Player = {x: 200, y: 150, width: 64, height: 64, speed: 3,};

// KEY CONTROL EVENT LISTENERS

	const keys = {};
		window.addEventListener('keydown', function(e) {e.preventDefault(); keys[e.key] = true;});
		window.addEventListener('keyup', function(e) {e.preventDefault(); keys[e.key] = false;});

// MUSIC & SOUND FUNCTION

	var SoundCollide = new Audio('assets/bingo.wav');
		SoundCollide.loop = false;
	var MusicChilderness = new Audio('assets/bingo.wav');
		MusicChilderness.loop = false;

// COLLISION FUNCTION

	function collisionDetecting(Player, Chicken)
		{if (Player.x + Player.width >= Chicken.x && Player.x <= Chicken.x + Chicken.width && Player.y + Player.height >= Chicken.y && Player.y <= Chicken.y + Chicken.height)
			{console.log("collision yaaaay"); SoundCollide.play();}};

// BOUNDING FUNCTION FOR CEILING, WALLS AND FLOOR

	function boundingBox(Player)
		{if (Player.y < 3) {Player.y = 3}
		else if (Player.y > 893) {Player.y = 893}
		else if (Player.x < -5) {Player.x = -5}
		else if (Player.x > 1385) {Player.x = 1385}};

// 🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨

	function gameloop()
		{context.clearRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = false;

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

		requestAnimationFrame(gameloop);};
		playerImage.onload = gameloop})



		// using css is not working well for the backgrounds so maybe switch to making them in js?????
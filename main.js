//INITIAL LOAD, CANVAS AND BACKGROUND CONSTS

window.addEventListener('load', function () {
	const gamespace = document.getElementById('gamespace');
	const brick_bg = this.document.getElementById('brick_bg');
	const context = gamespace.getContext('2d');

	//GAMETITLE (not sure if I need it so i replaced it with assets/null)

	const titleImage = new Image();
	titleImage.src = 'assets/null.png';
	const GameTitle = {x: 450, y: 0, width: 500, height: 80};

	//CANVAS AND BACKGROUND DIMENSIONS

	gamespace.width = 1280
	gamespace.height = 704
	brick_bg.width = 1432
	brick_bg.height = 768

	// GROUND DIMENSIONS AND DRAWING (function is looking through each row and mapping the tile texture to each corresponding integer)
	
	const groundHeight = 512;
	const ceilingHeight = -5;
	const wallLeft = -8;
	const wallRight = 1224;

	const ground = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];
					
	function drawGround() {
		for (let row = 0; row < ground.length; row++)
			{for(let col = 0; col < ground[row].length; col++){const tile = ground[row][col];
			if (tile === 1) {context.drawImage(snowtileImage, col * 64, groundHeight + (64) + row * 64, 64, 64);}
			if (tile === 2) {context.drawImage(dirttileImage, col * 64, groundHeight + (64) + row * 64, 64, 64);}}}};

	const snowtileImage = new Image();
	snowtileImage.src = 'assets/tiles/snowtile.png';
	const dirttileImage = new Image();
	dirttileImage.src = 'assets/tiles/dirttile.png';

	//CHICKEN OBJECT

	const chickenImage = new Image();
	chickenImage.src = 'assets/enemies/chicken.png';
	const Chicken = { x: 350, y: groundHeight, width: 64, height: 64, speed: 1};

	// PARACHUTE OBJECT

	var parachuteImage = new Image();
	parachuteImage.src = 'assets/tools/parachute.png';
	var Parachute = {width:64, height:64};

	//PLAYER OBJECT

	var playerImage = new Image();
	playerImage.src = 'assets/goat/goatright.png';
	var Player = { x: 184, y: 150, width: 64, height: 64, speed: 3, gravity: 0.4, velocityY: 0};
	var Health = 5;

	// KEY CONTROL EVENT LISTENERS

	const keys = {};

	window.addEventListener('keydown', function (e) {keys[e.key] = true;
	const runDirection = ["a", "d"];
	if (runDirection.includes(e.key) || e.ctrlKey) {e.preventDefault();}});
		//doesnt stop ctrl+W but does other combinations
	window.addEventListener('keyup', function (e) {keys[e.key] = false; });

	// MUSIC & SOUND FUNCTIONS (INCLUDING BUTTONS)

	var SoundCollide = new Audio('assets/sounds/hurt.wav');
	SoundCollide.loop = false;
	var MusicChilderness = new Audio('assets/sounds/childerness.wav');
	MusicChilderness.loop = true;
	MusicChilderness.autoplay = true;

	const musicToggle = document.getElementById('musicbtn');
	const soundToggle = document.getElementById('soundbtn');
	musicToggle.addEventListener("click", () => {MusicChilderness.muted = !MusicChilderness.muted});
	soundToggle.addEventListener("click", () => {SoundCollide.muted = !SoundCollide.muted});

	// COORDINATE TRACKER (Needs these characters: ` not sure why)

	function coordtrack() {
		const coordstext = document.getElementById('teststats'); coordstext.textContent = `${Math.round(Player.x)}, ${Math.round(Player.y)}`};

	// COLLISION FUNCTION

	let lastCollision = 0;
	const CollisionCooldown = 1000;

	function collsionSoundLog(direction) {const now = Date.now();
		if (now - lastCollision >= CollisionCooldown) {SoundCollide.play(); console.log("colliding with enemy", direction,), lastCollision = now, Health -= 1}
	};

	function collisionDetecting(Player, Chicken) {
		
		if (Player.x >= Chicken.x && Player.x <= Chicken.x + 48 && Player.y -2 > Chicken.y -2 && Health > 0) {collsionSoundLog("to your left"), Player.x = Chicken.x + 48};

		if (Player.x >= Chicken.x - 48 && Player.x <= Chicken.x && Player.y -2 > Chicken.y -2 && Health > 0) {collsionSoundLog("to your right"), Player.x = Chicken.x - 48;};

		if (Player.y >= Chicken.y - 52 && Player.y <= Chicken.y + 32 && Player.x <= Chicken.x + 32 && Player.x >= Chicken.x - 32 && Health) {collsionSoundLog("below"), Player.y = Chicken.y - 52, Player.velocityY = 0};
	};

	// BOUNDING, ONGROUND, JUMP AND PARACHUTE FUNCTIONS

	function onGround() {
		return Player.y >= groundHeight;};
	
	function jump() {
		{Player.velocityY = -14};};
	
	var parachuteDeployed = false;
	function parachute() {
		{Player.gravity=0.025, parachuteDeployed = true};};

	function boundingBox(Player) {
		if (Player.y > groundHeight && Player.x > wallRight) {Player.y = groundHeight, Player.velocityY = 0, Player.x = wallRight}
		else if (Player.y > groundHeight && Player.x < wallLeft) {Player.y = groundHeight, Player.velocityY = 0, Player.x = wallLeft}
		else if (Player.y > groundHeight) {Player.y = groundHeight, Player.velocityY = 0}
		else if (Player.x < wallLeft) {Player.x = wallLeft}
		else if (Player.x > wallRight) {Player.x = wallRight}
	};

	// MUSIC PLAYING

	MusicChilderness.play();

	// 🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨

	function gameloop() {
		context.clearRect(0, 0, gamespace.width, gamespace.height); context.imageSmoothingEnabled = false;

		// DRAW GROUND FUNCTION CALLED

		drawGround();

		// KEY CHECKS, SPEED, VELOCITY AND PARACHUTE REGULATION

		if (keys[' '] && onGround()) {jump();}
		if (Player.y == groundHeight) {Player.gravity = 0.4, parachuteDeployed = false};

		const speed = keys['Control'] ? Player.speed + 1.75 : Player.speed;
		Player.velocityY += Player.gravity; Player.y += Player.velocityY

		if (keys['a']) {Player.x -= speed}
		if (keys['d']) {Player.x += speed}
		if (keys[' '] && !onGround() && Player.velocityY > 0) {parachute();}

		if (Player.velocityY < -17) {Player.velocityY = -17};

		// DRAW OBJECTS (PARACHUTE, PLAYER (INCLUDING DEAD SPRITE), CHICKEN, TITLE)

		if (parachuteDeployed == true) {Parachute.x = Player.x
		Parachute.y = Player.y - 32, context.drawImage(parachuteImage, Parachute.x, Parachute.y, Parachute.width, Parachute.height);}

		if (Health > 0) {context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height);}
		else {playerImage.src = 'assets/goat/deadgoat.png', Player.speed = 0, Player.gravity = 0, Player.velocityY = 0, context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height)}

		{context.drawImage(chickenImage, Chicken.x, Chicken.y, Chicken.width, Chicken.height); Chicken.x};

		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);

		// CALLING COLLISION AND BOUNDING FUNCTION

		collisionDetecting(Player, Chicken);
		boundingBox(Player);
		coordtrack();

		// NEXT FRAME

		requestAnimationFrame(gameloop);};

	playerImage.onload = gameloop
})
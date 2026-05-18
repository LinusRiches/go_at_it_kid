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

	// PARACHUTE OBJECT

	var parachuteImage = new Image();
	parachuteImage.src = 'assets/parachute.png';
	var Parachute = {x: 0, y: 0, width:64, height:64,};

	//PLAYER OBJECT

	var playerImage = new Image();
	playerImage.src = 'assets/goat.png';
	var Player = { x: 350, y: 150, width: 64, height: 64, speed: 3, gravity: 0.4, velocityY: 0, };

	// KEY CONTROL EVENT LISTENERS

	const keys = {};

	window.addEventListener('keydown', function (e) {keys[e.key] = true;
	const runDirection = ["a", "d"];
	if (runDirection.includes(e.key) || e.ctrlKey) {e.preventDefault();}});
		//this doesnt stop ctrl+W sadly
	window.addEventListener('keyup', function (e) {keys[e.key] = false; });

	// MUSIC & SOUND FUNCTIONS

	var SoundCollide = new Audio('assets/bingo.wav');
	SoundCollide.loop = false;
	var MusicChilderness = new Audio('assets/childerness.wav');
	MusicChilderness.loop = false;
	MusicChilderness.autoplay = true;

	const musicToggle = document.getElementById('musicbtn');
	const soundToggle = document.getElementById('soundbtn');
	musicToggle.addEventListener("click", () => {MusicChilderness.muted = !MusicChilderness.muted});
	soundToggle.addEventListener("click", () => {SoundCollide.muted = !SoundCollide.muted});

	// COORDINATE TRACKER (Needs these characters: ` not sure why)

	function coordtrack(){
		const coordstext = document.getElementById('teststats');coordstext.textContent = `${Player.x}, ${Player.y}`};

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
		return Player.y >= groundHeight;};
	
	function jump() {
		if (keys[' '] && onGround()) {Player.velocityY = -14};};
	
	function parachute() {
		if (keys[' '] && !onGround() && Player.velocityY > 0) {Player.gravity=0.025};
		if (Player.velocityY < -17) Player.velocityY = -17;};

	function boundingBox(Player) {
		if (Player.y < ceilingHeight) { Player.y = ceilingHeight, Player.velocityY = 0 }
		else if (Player.y > groundHeight) { Player.y = groundHeight, Player.velocityY = 0 }
		else if (Player.x < -5) { Player.x = -5 }
		else if (Player.x > 1250) { Player.x = 1250 }};

	// MUSIC

	MusicChilderness.play();

	// 🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨GAMELOOP🟨

	function gameloop() {
		context.clearRect(0, 0, gamespace.width, gamespace.height); context.imageSmoothingEnabled = false;

		// KEY CHECK AND BINDINGS

		jump();
		parachute();

		const speed = keys['Control'] ? Player.speed + 1.75 : Player.speed;
		if (keys['a']) Player.x -= speed;
		if (keys['d']) Player.x += speed;

		if (Player.y == groundHeight) Player.gravity = 0.4;

		Player.velocityY += Player.gravity; Player.y += Player.velocityY

		// DRAW OBJECTS (PLAYER, CHICKEN, PARACHUTE)

		context.drawImage(parachuteImage, Parachute.x, Parachute.y, Parachute.width, Parachute.height);

		context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height);

		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);

		context.drawImage(chickenImage, Chicken.x, Chicken.y, Chicken.width, Chicken.height);

		Parachute.x = Player.x
		Parachute.y = Player.y - 32

		// CALLING COLLISION AND BOUNDING FUNCTION

		collisionDetecting(Player, Chicken);
		boundingBox(Player);
		coordtrack();

		// NEXT FRAME

		requestAnimationFrame(gameloop);};

	playerImage.onload = gameloop
})
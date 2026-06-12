//#region	🟥 MAIN VARIABLES AND CONSTANTS

	//#region 🟠 INITIAL LOAD, CANVAS, PAUSE AND BACKGROUND CONSTANTS AND DIMENSIONS

window.addEventListener('load', function () {

	const gamespace = document.getElementById('gamespace');
	gamespace.width = 5120
	gamespace.height = 704
	const brick_bg = this.document.getElementById('brick_bg');
	brick_bg.width = 5240
	brick_bg.height = 770
	const context = gamespace.getContext('2d');
	const pauseScreen = document.getElementById('pausescreen')
	window.scrollBy(-1000, 0)
	let pause = true;
	let pausecheck = false;
	let parachutecheck = false;
	let parachuteDeployed = false;

	//#endregion

	//#region 🟠 TITLESCREEN (not using yet so I have replaced it with assets/null) (nullimage is just there for testing)

	const nullImage = new Image();
	nullImage.src = 'assets/null.png';
	const titleImage = new Image();
	titleImage.src = 'assets/null.png';
	const GameTitle = { x: 450, y: 0, width: 500, height: 80 };

//#endregion

	//#region 🟠 GROUND DIMENSIONS AND DRAWING (function is looking through each row, mapping the tile texture to each corresponding integer)

	var scrollLocation = 1224
	const groundHeight = 512;
	const ceilingHeight = -5;
	const wallLeft = -8;
	var wallRight = scrollLocation + 5000;
		// wallRight will be like this until I figure out how it works
	const snowtileImage = new Image();
	snowtileImage.src = 'assets/tiles/snowtile.png';
	const dirttileImage = new Image();
	dirttileImage.src = 'assets/tiles/dirttile.png';

	const ground = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
	];	// needs cleaning up when I fill the whole gamespace with ground, decoration and semi-solid elements.

	function drawGround() {
		for (let row = 0; row < ground.length; row++) {
			for (let col = 0; col < ground[row].length; col++) {
				const tile = ground[row][col];
				if (tile === 1) { context.drawImage(snowtileImage, col * 64, groundHeight - 64 + row * 64, 64, 64); }
				if (tile === 2) { context.drawImage(dirttileImage, col * 64, groundHeight - 64 + row * 64, 64, 64); }
				if (tile === 3) { context.drawImage(nullImage, col * 64, groundHeight - 64 + row * 64, 64, 64); }
			}
		}
	};

//#endregion

	//#region 🟠 CHICKEN, PARACHUTE AND PLAYER OBJECTS

	const chickenImage = new Image();
	chickenImage.src = 'assets/enemies/chicken.png';
	const Chicken = { x: 350, y: groundHeight, width: 64, height: 64, speed: 1 };

	var parachuteImage = new Image();
	parachuteImage.src = 'assets/tools/parachute.png';
	var Parachute = { width: 64, height: 64 };

	var playerImage = new Image();
	playerImage.src = 'assets/goat/goatright.png';
	var Player = { x: 184, y: 150, width: 64, height: 64, speed: 3, gravity: 0.4, velocityY: 0 };

//#endregion

	//#region 🟠 HEALTH, HEALTH BAR AND DEATH SCREEN VARIABLES 

	const heartemptyImage = new Image();
	heartemptyImage.src = 'assets/ui/heart_empty.png';
	const heartfullImage = new Image();
	heartfullImage.src = 'assets/ui/heart_full.png';
	var health = 5;
	var dead = false;
	var deathTimer = 0;
	var healthBar = []

	function drawHealth() {
		for (let bar = 0; bar < healthBar.length; bar++)
			if (healthBar[bar] === 1) { context.drawImage(heartfullImage, [bar] * 48 + scrollLocation - 1208, 16, 32, 32); }
			else { if (healthBar[bar] === 0) { context.drawImage(heartemptyImage, [bar] * 48 + scrollLocation - 1208, 16, 32, 32); } }
	};	// changing heart mechanics to fit the scroll

//#endregion

	//#region 🟠 KEY CONTROL EVENT LISTENERS

	const keys = {};

	window.addEventListener('keydown', function (e) {
		keys[e.key] = true;
		const runDirection = ["a", "d"];
		if (runDirection.includes(e.key) || e.ctrlKey) { e.preventDefault(); }
	});
		//doesnt stop ctrl+W but does other combinations
	window.addEventListener('keyup', function (e) { keys[e.key] = false; });

//#endregion

	//#region 🟠 MUSIC & SOUND FUNCTIONS (INCLUDING BUTTONS)

	var SoundCollide = new Audio('assets/sounds/hurt.wav'); SoundCollide.loop = false;
	var SoundParachuteDeployed = new Audio('assets/sounds/parachutedeployed.wav'); SoundParachuteDeployed.loop = false;
	var MusicChilderness = new Audio('assets/sounds/childerness.wav'); MusicChilderness.loop = true; MusicChilderness.autoplay = true;
	var MusicDead = new Audio('assets/sounds/dead.wav'); MusicDead.loop = false;

	const musicToggle = document.getElementById('musicbtn');
	musicToggle.src = 'assets/ui/drum.png';
	musicToggle.width = 32; musicToggle.height = 32;
	const soundToggle = document.getElementById('soundbtn');
	soundToggle.src = 'assets/ui/horn.png';
	soundToggle.width = 32; musicToggle.height = 32;

	musicToggle.addEventListener("click", () => { MusicChilderness.muted = !MusicChilderness.muted, MusicDead.muted = !MusicDead.muted });
	soundToggle.addEventListener("click", () => { SoundCollide.muted = !SoundCollide.muted, SoundParachuteDeployed.muted = !SoundParachuteDeployed.muted });

//#endregion

	//#region 🟠 COORDINATE TRACKER (Needs these c haracters: `)

	function coordtrack() {
		const coordstext = document.getElementById('teststats'); coordstext.textContent = `${Math.round(Player.x)}, ${Math.round(Player.y)}`
	};
//#endregion

	//#region 🟠 COLLISION, BOUNDING, ONGROUND, JUMP PARACHUTE AND SCROLL FUNCTIONS

	let lastCollision = 0;
	const CollisionCooldown = 1000;

	function collisionDetecting(Player, Chicken){
	if (Player.x >= Chicken.x && Player.x <= Chicken.x + 48 && Player.y - 2 > Chicken.y - 2 && health > 0) { collsionSoundLog("to your left"), Player.x = Chicken.x + 48 };
	if (Player.x >= Chicken.x - 48 && Player.x <= Chicken.x && Player.y - 2 > Chicken.y - 2 && health > 0) { collsionSoundLog("to your right"), Player.x = Chicken.x - 48; };
	if (Player.y >= Chicken.y - 52 && Player.y <= Chicken.y + 32 && Player.x <= Chicken.x + 32 && Player.x >= Chicken.x - 32 && health) { collsionSoundLog("below"), Player.y = Chicken.y - 52, Player.velocityY = 0 };
	};

	function collsionSoundLog(direction)
	{ const now = Date.now(); if (now - lastCollision >= CollisionCooldown) { SoundCollide.play(); console.log("colliding with enemy", direction,), lastCollision = now, health -= 1 }
	};

	function boundingBox(Player) {
		if (Player.y > groundHeight && Player.x > wallRight) { Player.y = groundHeight, Player.velocityY = 0, Player.x = wallRight }
	else if (Player.y > groundHeight && Player.x < wallLeft) { Player.y = groundHeight, Player.velocityY = 0, Player.x = wallLeft }
	else if (Player.y > groundHeight) { Player.y = groundHeight, Player.velocityY = 0 } else if (Player.x < wallLeft) { Player.x = wallLeft }
	else if (Player.x > wallRight) { Player.x = wallRight }
	};

		// function boundingBox(Player) {
		// 	if (Player.y > snowtileImage.y) { Player.y = snowtileImage.y + 512, Player.velocityY = 0 };}

		// working on how to collide with the ground based on the tile below

	function onGround() {
		return Player.y >= groundHeight;
	};

	function jump() {
		{ Player.velocityY = -14 };
	};

	function parachute() {
		{
			Player.gravity = 0.025, parachuteDeployed = true;
			if (!parachutecheck && Player.gravity < 1) { SoundParachuteDeployed.play(); }
		}; parachutecheck = keys[' '];
	};

	function scrollWin() {
		if (Player.x > scrollLocation && pause != true) { window.scrollBy(1124, 0); scrollLocation += 1124 }
	}; 	// will change this to better and smoother scroll. it will also go both ways

//#endregion

	//#region 🟠 MUSIC PLAY ON LOAD (BUGGED)

	MusicChilderness.play();

//#endregion

//#endregion 🟥

	//#region 🟩 🟢 GAMELOOP 🟢 GAMELOOP 🟢 GAMELOOP 🟢 GAMELOOP 🟢 GAMELOOP 🟢 GAMELOOP 🟢 GAMELOOP 🟢 GAMELOOP 🟢

		//#region 🟢 GAMELOOP FUNCTION

	function gameloop() {
		context.clearRect(0, 0, gamespace.width, gamespace.height); context.imageSmoothingEnabled = false;

		//#endregion

		//#region 🟢 DRAW GROUND FUNCTION CALLED

		drawGround();
		drawHealth();
		scrollWin();

	//#endregion

		//#region 🟢 HEALTH CHECK

		if (health > 0) { dead = false } else if (health <= 0) { dead = true };
		if (health === 5) healthBar = [1, 1, 1, 1, 1];
		else {
			if (health === 4) healthBar = [1, 1, 1, 1, 0];
			if (health === 3) healthBar = [1, 1, 1, 0, 0];
			if (health === 2) healthBar = [1, 1, 0, 0, 0];
			if (health === 1) healthBar = [1, 0, 0, 0, 0];
			if (health === 0) healthBar = [0, 0, 0, 0, 0];
		}

	//#endregion

		//#region 🟢 DRAW OBJECTS (CHICKEN, PARACHUTE, PLAYER (INCLUDING DEAD SPRITE AND DEATH SCREEN), TITLE)

		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);

		{ context.drawImage(chickenImage, Chicken.x, Chicken.y, Chicken.width, Chicken.height); Chicken.x };

		if (parachuteDeployed == true && dead == false) { Parachute.x = Player.x; Parachute.y = Player.y - 32, context.drawImage(parachuteImage, Parachute.x, Parachute.y, Parachute.width, Parachute.height); }

		if (dead == false) { context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height); }
		else {
			playerImage.src = 'assets/goat/deadgoat.png'; context.drawImage(playerImage, Player.x, Player.y, Player.width, Player.height); Player.speed = 0; Player.gravity = 0; Player.velocityY = 0;
			if (deathTimer < 1) deathTimer += 0.001; const deathScreenGradient = context.createLinearGradient(0, 0, 0, gamespace.height); deathScreenGradient.addColorStop(0, 'rgba(255, 0, 0, 0'); deathScreenGradient.addColorStop(0.8, `rgba(255, 0, 0, ${0.1 * deathTimer}`); deathScreenGradient.addColorStop(1, `rgba(255, 0, 0, ${0.7 * deathTimer}`); context.fillStyle = deathScreenGradient; context.fillRect(0, 0, gamespace.width, gamespace.height); const deathScreen = document.getElementById('deathscreen'); deathScreen.textContent = "YOU DIED"; { MusicChilderness.muted = true }; MusicDead.play();
		};

	//#endregion

		//#region 🟢 PAUSE MECHANICS

		if (keys['p'] && !pausecheck && dead == false) { pause = !pause };
		pausecheck = keys['p'];
		if (pause == true && health > 0) { pauseScreen.textContent = "||"; }
		else if (dead == false) { pauseScreen.textContent = " " }
		else if (dead == true) { pauseScreen.textContent = "reloading..."; pauseScreen.textContent = " "; }

		if (!pause) { GameUpdates(); };
		function GameUpdates() {

	//#endregion

		//#region 🟢 KEY CHECKS, SPEED, VELOCITY AND PARACHUTE REGULATION

			if (keys[' '] && onGround()) { jump(); }
			if (Player.y == groundHeight) { Player.gravity = 0.4, parachuteDeployed = false };

			if (dead == false) { var speed = keys['Control'] ? Player.speed + 1.75 : Player.speed; Player.velocityY += Player.gravity; Player.y += Player.velocityY; }
			else { speed = Player.speed = 0; Player.velocityY = 0; Player.gravity = 0 };

			if (keys['a']) { Player.x -= speed };
			if (keys['d']) { Player.x += speed };
			if (keys[' '] && !onGround() && Player.velocityY > 0) { parachute(); };

			if (Player.velocityY < -17) { Player.velocityY = -17 };

	//#endregion

		//#region 🟢 CALLING COLLISION AND BOUNDING FUNCTIONS

			collisionDetecting(Player, Chicken);
			boundingBox(Player);
			coordtrack();
		};

	//#endregion

		//#region 🟢 NEXT FRAME

		requestAnimationFrame(gameloop);
	//#endregion
	};
	//#endregion 🟩

	//#region	🟨 🟠 GAMELOOP CALL

	playerImage.onload = gameloop
})

	//#endregion🟨
	
	//#region	🟦 NOTES

// THINGS TO WORK ON: Screen scrolling, enemy movement, animation, temperature bar, fixed object-based collision for ground features
// LESS IMPORTANT: Sound design, texturing, niche/minor features

	//#endregion🟦
//#region 	🟥 MAIN VARIABLES AND CONSTANTS

//#region INITIAL LOAD, CANVAS, PAUSE & BACKGROUND CONSTANTS & DIMENSIONS

window.addEventListener('load', function () {

	const gamespace = document.getElementById('gamespace');
	gamespace.width = 5120
	gamespace.height = 704
	const brick_bg = this.document.getElementById('brickborder');
	brick_bg.width = 1436
	brick_bg.height = 770
	const context = gamespace.getContext('2d');
	const pauseScreen = document.getElementById('pausescreen')
	let pause = true;
	let pausecheck = false;
	let parachutecheck = false;
	let parachuteDeployed = false;

//#endregion

//#region TITLESCREEN (not using yet so I have replaced it with assets/textures/null) (nullimage is just there for testing)

	const nullImage = new Image();
	nullImage.src = 'assets/textures/null.png';
	const titleImage = new Image();
	titleImage.src = 'assets/textures/null.png';
	const GameTitle = { x: 450, y: 0, width: 500, height: 80 };

//#endregion

//#region GROUND DIMENSIONS & DRAWING / CLASSES (function is looking through each row, mapping the tile texture to each corresponding integer)

	class SolidBlock{
		constructor(x, y, height, width, size, imageSource){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.size = size;
		this.image = new Image();
		this.image.src = imageSource;
		}
	};

	var snowtile = new SolidBlock(64, 256, 64, 64, 64, 'assets/textures/tiles/snowtile.png');
	var dirttile = new SolidBlock(64, 256, 64, 64, 64, 'assets/textures/tiles/dirttile.png');

	var groundMovement = 0;
	const groundHeight = 512;
	const ceilingHeight = -5;
	const wallLeft = -8;
	const wallRight = 1224;
	// wallRight will be like this until I figure out how it works

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
				if (tile === 1) {context.drawImage(snowtile.image, groundMovement + col * snowtile.size, groundHeight - snowtile.size + row * snowtile.size, snowtile.size, snowtile.size); }
				if (tile === 2) { context.drawImage(dirttile.image, groundMovement + col * dirttile.size, groundHeight - dirttile.size + row * dirttile.size, dirttile.size, dirttile.size); }
				if (tile === 3) { context.drawImage(nullImage, groundMovement + col * 64, groundHeight - 64 + row * 64, 64, 64); }
			}
		}
	};

//#endregion

//#region CHICKEN, WALLOB, PARACHUTE & PLAYER OBJECTS AND CLASSES

	class PlayerEntity{
		constructor(x, y, width, height, speed, gravity, velocityY, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.speed = speed;
			this.gravity = gravity;
			this.velocityY = velocityY;
			this.image = new Image();
			this.image.src = imageSource;
		}
	}

	class EnemyEntity{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource;
		}
	}

	class NeutralEntity{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource;
		}
	};

	const Chicken = new NeutralEntity(350, groundHeight, 64, 64, 'assets/textures/neutral/chicken.png');

	const Wallob = new EnemyEntity(400, groundHeight - 64, 64, 128,'assets/textures/enemies/wallob.png');

	var parachuteImage = new Image();
	parachuteImage.src = 'assets/textures/tools/parachute.png';
	var Parachute = { width: 64, height: 64 };

	const Player = new PlayerEntity(200, 150, 64, 64, 3, 0.4, 0, 'assets/textures/goat/goatright.png');

//#endregion

//#region HEALTH, HEALTH BAR & DEATH SCREEN VARIABLES 

	const heartemptyImage = new Image();
	heartemptyImage.src = 'assets/textures/ui/heart_empty.png';
	const heartfullImage = new Image();
	heartfullImage.src = 'assets/textures/ui/heart_full.png';
	var health = 5;
	var dead = false;
	var deathTimer = 0;
	var healthBar = [];

	function drawHealth() {
		for (let bar = 0; bar < healthBar.length; bar++)
			if (healthBar[bar] === 1) { context.drawImage(heartfullImage, [bar] * 48 + 16, 16, 32, 32); }
			else { if (healthBar[bar] === 0) { context.drawImage(heartemptyImage, [bar] * 48 + 16, 16, 32, 32); } }
	};

//#endregion

//#region RUN DIRECTION KEY EVENT LISTENERS

	const keys = {};

	window.addEventListener('keydown', function (e) {
		keys[e.key] = true;
		const runDirection = ["a", "d"];
		if (runDirection.includes(e.key) || e.ctrlKey) { e.preventDefault(); }
	});
		//doesnt stop ctrl+W but does other combinations
	window.addEventListener('keyup', function (e) { keys[e.key] = false; });

//#endregion

//#region MUSIC & SOUND FUNCTIONS (INCLUDING BUTTONS)

	var CollisionSounds = [('assets/sounds/hurt.wav'), ('assets/sounds/hurt2.wav')];
	var DeathSound = new Audio('assets/sounds/death.wav');
	var SoundParachuteDeployed = new Audio('assets/sounds/parachutedeployed.wav'); SoundParachuteDeployed.loop = false;
	var MusicChilderness = new Audio('assets/sounds/childerness.wav'); MusicChilderness.loop = true; MusicChilderness.autoplay = true;
	var MusicDead = new Audio('assets/sounds/dead.wav'); MusicDead.loop = false;

	const musicToggle = document.getElementById('musicbtn');
	musicToggle.src = 'assets/textures/ui/drum.png';
	musicToggle.width = 32; musicToggle.height = 32;
	const soundToggle = document.getElementById('soundbtn');
	soundToggle.src = 'assets/textures/ui/horn.png';
	soundToggle.width = 32; musicToggle.height = 32;

	musicToggle.addEventListener("click", () => { MusicChilderness.muted = !MusicChilderness.muted, MusicDead.muted = !MusicDead.muted });
	soundToggle.addEventListener("click", () => { ChosenCollisionSound.muted = !ChosenCollisionSound.muted, SoundParachuteDeployed.muted = !SoundParachuteDeployed.muted });

//#endregion

//#region COORDINATE TRACKER

	const coordstext = document.getElementById('teststats');

	function coordtrack(PlayerEntity) {
		coordstext.textContent = `${Math.round(groundMovement-128)}, ${Math.round(Player.y)}`
	};

//#endregion

//#region COLLISION, BOUNDING, ONGROUND, JUMP & PARACHUTE FUNCTIONS

	let lastCollision = 0;
	const CollisionCooldown = 1000;
	let hurt = false

	function collisionDetecting(PlayerEntity, Wallob){
	if (Player.x >= Wallob.x && Player.x <= Wallob.x + 48 && Player.y - 2 > Wallob.y - 2 && health > 0) { hurt = true, collsionSoundLog("to your left"), groundMovement -=  + Player.speed};
	if (Player.x >= Wallob.x - 48 && Player.x <= Wallob.x && Player.y - 2 > Wallob.y - 2 && health > 0) { hurt = true, collsionSoundLog("to your right"), groundMovement += Player.speed};
	if (Player.y >= Wallob.y - 52 && Player.x <= Wallob.x + 32 && Player.x >= Wallob.x - 32 && Player.y <= Wallob.y - 14) { hurt = true, collsionSoundLog("below"), Player.y = Wallob.y - 52, Player.velocityY = 0, jump(-4); };
	};

	// function collisionDetecting(Player, Chicken){
	// if (Player.x >= Chicken.x && Player.x <= Chicken.x + 48 && Player.y - 2 > Chicken.y - 2 && health > 0) {
	// collsionSoundLog("to your left"), groundMovement -=  + Player.speed};
	// if (Player.x >= Chicken.x - 48 && Player.x <= Chicken.x && Player.y - 2 > Chicken.y - 2 && health > 0) { collsionSoundLog("to your right"), groundMovement += Player.speed};
	// if (Player.y >= Chicken.y - 52 && Player.y <= Chicken.y + 32 && Player.x <= Chicken.x + 32 && Player.x >= Chicken.x - 32) { collsionSoundLog("below"), Player.y = Chicken.y - 52, Player.velocityY = 0 };
	// };

	// this isnt working at the moment alongside the other - it removes the ability for either to do damage.

	function collsionSoundLog(direction)
	{const now = Date.now(); if (now - lastCollision >= CollisionCooldown)
		{ console.log("colliding with enemy", direction), lastCollision = now; if (hurt == true) {health -= 1, hurt == false};
			if (health > 0) {var RandomCollisionSound = [Math.floor(Math.random() * 2)]; var ChosenCollisionSound = new Audio (CollisionSounds[RandomCollisionSound]); ChosenCollisionSound.play(); }
			else {DeathSound.play(); } }
	};

	function boundingBox(PlayerEntity) {
		if (Player.y > groundHeight && Player.x > wallRight) { Player.y = groundHeight, Player.velocityY = 0, Player.x = wallRight }
	else if (Player.y > groundHeight && Player.x < wallLeft) { Player.y = groundHeight, Player.velocityY = 0, Player.x = wallLeft }
	else if (Player.y > groundHeight) { Player.y = groundHeight, Player.velocityY = 0 }
	else if (Player.x < wallLeft) { Player.x = wallLeft }
	else if (Player.x > wallRight) { Player.x = wallRight }
	};

	function onGround(PlayerEntity) {
		return Player.y >= groundHeight;
	};

	function jump(jumpheight) {
		{ Player.velocityY = jumpheight };
	};

	function parachute(PlayerEntity) {
		Player.gravity = 0.025, parachuteDeployed = true;
			if (!parachutecheck && keys[' ']) { SoundParachuteDeployed.play(); }
		parachutecheck = keys[' '];
	};

//#endregion

//#region ENEMY MOVEMENT

let ChickenDirection = "right";
let WallobDirection = "right";

var randTimer = (Math.random() * 100)

function chickenMovement(){
	if(dead == false && pause == false){ if(ChickenDirection == "right"){Chicken.x += 1.8} if(ChickenDirection == "left"){Chicken.x -= 1.8}}};
function chickenRandomChange(){
	if (dead == false && pause == false){ChickenDirection = Math.random() < 0.5 ? "right" : "left"}};

function wallobMovement(){
	if(dead == false && pause == false){ if(WallobDirection == "right"){Wallob.x += 2.8} if(WallobDirection == "left"){Wallob.x -= 2.8}}};
function wallobRandomChange(){
	if (dead == false && pause == false){WallobDirection = Math.random() < 0.5 ? "right" : "left"}};

//#endregion ENEMY MOVEMENT

//#region MUSIC START FUNCTION (BUGGED)

function musicStart() {
	const now = Date.now();
	let lastMusic = 0;
	let musicCooldown = 1000;
	if (now - lastMusic >= musicCooldown) {MusicChilderness.play();};};

//#endregion

//#endregion🟥 MAIN VARIABLE AND CONSTANTS END

//🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰

//#region	🟧 GAMELOOP

//#region GAMELOOP FUNCTION (RESETTING CANVAS)

	function gameloop() {
		context.clearRect(0, 0, gamespace.width, gamespace.height); context.imageSmoothingEnabled = false;

//#endregion

//#region DRAW GROUND & MUSIC FUNCTION CALLED, DATE.NOW

		drawGround();
		musicStart();

//#endregion

//#region HEALTH DRAW AND CHECK
	
		drawHealth();

		if (health > 0) { dead = false } else if (health <= 0) { dead = true };
		if (health === 5) healthBar = [1, 1, 1, 1, 1];
		else {
			if (health === 4) healthBar = [1, 1, 1, 1, 0];
			if (health === 3) healthBar = [1, 1, 1, 0, 0];
			if (health === 2) healthBar = [1, 1, 0, 0, 0];
			if (health === 1) healthBar = [1, 0, 0, 0, 0];
			if (health === 0) healthBar = [0, 0, 0, 0, 0];
		};

//#endregion

//#region DRAW OBJECTS (CHICKEN, PARACHUTE, PLAYER (INCLUDING DEAD SPRITE AND DEATH SCREEN), TITLE)

		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);

		{ context.drawImage(Chicken.image, Chicken.x, Chicken.y, Chicken.width, Chicken.height) };

		{ context.drawImage(Wallob.image, Wallob.x, Wallob.y, Wallob.width, Wallob.height) };

		if (parachuteDeployed == true && dead == false) { Parachute.x = Player.x; Parachute.y = Player.y - 32, context.drawImage(parachuteImage, Parachute.x, Parachute.y, Parachute.width, Parachute.height); }

		if (dead == false) { context.drawImage(Player.image, Player.x, Player.y, Player.width, Player.height); }
		else {
			Player.image.src = 'assets/textures/goat/deadgoat.png'; context.drawImage(Player.image, Player.x, Player.y, Player.width, Player.height); Player.speed = 0; Player.gravity = 0; Player.velocityY = 0;
			if (deathTimer < 1) deathTimer += 0.001; const deathScreenGradient = context.createLinearGradient(0, 0, 0, gamespace.height); deathScreenGradient.addColorStop(0, 'rgba(255, 0, 0, 0'); deathScreenGradient.addColorStop(0.8, `rgba(255, 0, 0, ${0.1 * deathTimer}`); deathScreenGradient.addColorStop(1, `rgba(255, 0, 0, ${0.7 * deathTimer}`); context.fillStyle = deathScreenGradient; context.fillRect(0, 0, gamespace.width, gamespace.height); const deathScreen = document.getElementById('deathscreen'); deathScreen.textContent = "YOU DIED"; { MusicChilderness.muted = true }; MusicDead.play();
		};

//#endregion

//#region PAUSE MECHANICS

		if (keys['p'] && !pausecheck && dead == false) { pause = !pause };
		pausecheck = keys['p'];
		if (pause == true && health > 0) { pauseScreen.textContent = "||"; }
		else if (dead == false) { pauseScreen.textContent = " " }
		else if (dead == true) { pauseScreen.textContent = "reloading..."; pauseScreen.textContent = " "; }

		if (!pause) { GameUpdates(); };
		function GameUpdates() {

//#endregion

//#region KEY CHECKS, SPEED, VELOCITY, GROUND AND PARACHUTE REGULATIONS

			if (keys[' '] && onGround(Player)) { jump(-14); }
			if (Player.y == groundHeight) { Player.gravity = 0.4, parachuteDeployed = false };

			if (dead == false) { var speed = keys['Control'] ? Player.speed + 2 : Player.speed; Player.velocityY += Player.gravity; Player.y += Player.velocityY; }
			else { speed = Player.speed = 0; Player.velocityY = 0; Player.gravity = 0 };

			if (keys['a']) { Chicken.x += speed, Wallob.x += speed, snowtile.x += speed; groundMovement += speed };
			if (keys['d']) { Chicken.x -= speed, Wallob.x -= speed, snowtile.x -= speed, groundMovement -= speed; };
			if (keys[' '] && !onGround(Player) && Player.velocityY > 0) { parachute(Player); };

			if (Player.velocityY < -17) { Player.velocityY = -17 };

	//#endregion

//#region CALLING COLLISION AND BOUNDING FUNCTIONS

			// for (let i = 0; i < length(Enemy); i++) ???
				randTimer -= 1;
				if (randTimer > 0) {randTimer -= 1}
				else if (randTimer <= 0) {randTimer = Math.random() * 100, chickenRandomChange(), wallobRandomChange()};

			if (dead == false) {collisionDetecting(PlayerEntity, Wallob);
			chickenMovement();
			wallobMovement();
			boundingBox(PlayerEntity);
			coordtrack(PlayerEntity);}
		};

	//#endregion

//#region NEXT FRAME

		requestAnimationFrame(gameloop);
	};

//#endregion

//#endregion🟧 GAMELOOP END

//🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰

//#region 	🟨 GAMELOOP CALL

	Player.image.onload = gameloop
})

//#endregion🟨 GAMELOOP CALL END
	
//🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰

//#region 	🟩 NOTES

// THINGS TO WORK ON: Screen scrolling (MOVING SCREEN AROUND THE PLAYER RATHER THAN MOVING THE WHOLE HTML DOC), enemy movement, animation, temperature bar, fixed object-based collision for ground features
// LESS IMPORTANT: Sound design, texturing, niche/minor features
// CURRENT THING: SCREEN SCROLL MECHANIC - Ground objects and collision fixing and adding classes.

//#endregion🟩 NOTES END
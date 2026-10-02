//#region 	🟥 General

	//#region Initial load, gamespace creation

	window.addEventListener('load', function () {

	const gamespace = document.getElementById('gamespace'), brick_bg = this.document.getElementById('brickborder'), context = gamespace.getContext('2d'), pauseScreen = document.getElementById('pausescreen'), coordstext = document.getElementById('teststats');

	gamespace.width = 1304, gamespace.height = 704
	brick_bg.width = 1436, brick_bg.height = 770

	let pause = true;
	let onGround = true;
	let pausecheck, parachutecheck, parachuteDeployed = false;

	const nullImage = new Image(), titleImage = new Image();
	nullImage.src, titleImage.src = 'assets/textures/null.png';
	const GameTitle = { x: 450, y: 0, width: 500, height: 80 };

	const keys = {};

	//#endregion

	//#region Classes

	class Block{
		constructor(x, y, height, width, size, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.size = size;
			this.image = new Image();
			this.image.src = imageSource;} };

		class SolidBlock extends Block{
			drawRedOverlay() {context.fillStyle = "rgba(255, 93, 93, 0.4)"; context.fillRect(this.x, this.y, this.width, this.height, this.size,); context.fillStyle = "rgba(255, 8, 8, 0.4)"; context.fillRect(this.x+4, this.y+4, this.width-8, this.height - 8, this.size,); } };

		class SemiSolid extends Block{
			drawBlueOverlay() {context.fillStyle = "rgba(8, 28, 255, 0.5)"; context.fillRect(this.x+4, this.y+4, this.width-8, this.height - 8, this.size,) } };

		class BackgroundObject extends Block{
			drawCyanOverlay() {context.fillStyle = "rgba(147, 248, 255, 0.38)"; context.fillRect(this.x, this.y, this.width, this.height, this.size,); context.fillStyle = "rgba(8, 255, 255, 0.35)"; context.fillRect(this.x+4, this.y+4, this.width-8, this.height - 8, this.size,) } };

	class PlayerEntity{
		constructor(x, y, width, height, speed, gravity, velocityY, imageObject){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.speed = speed;
			this.gravity = gravity;
			this.velocityY = velocityY;
			this.image = imageObject; } };

	class EnemyEntity{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource; } };

	class NeutralEntity{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource; } };

	class Structure{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource; } };

	//#endregion

	//#region Variables

	let blocktypes = {}, snowtile = new SolidBlock(64, 256, 64, 64, 64, 'assets/textures/tiles/snowtile.png'), dirttile = new SolidBlock(64, 256, 64, 64, 64, 'assets/textures/tiles/dirttile.png'), rockpile = new BackgroundObject(64, 256, 64, 64, 64,'assets/textures/tiles/rockpile.png')
	let groundMovement = 0;
	const groundHeight = 512;
	const ceilingHeight = -5;

	const Shop = new Structure(896, groundHeight - 256, 320, 320, "assets/textures/structures/shop.png");
	const Chicken = new NeutralEntity(350, groundHeight, 64, 64, 'assets/textures/neutral/chicken.png');
	const Wallob = new EnemyEntity(400, groundHeight - 64, 64, 128,'assets/textures/enemies/wallob.png');

	let parachuteImage = new Image(); parachuteImage.src = 'assets/textures/tools/parachute.png';
	let Parachute = { width: 64, height: 64 };
	let goatSheet = new Image(); goatSheet.src = "assets/textures/goat/goatsheet.png";
	let spriteFrameX = 0;
	let spriteFrameY = 0;
	let Player = new PlayerEntity(200, 150, 64, 64, 3, 0.4, 0, goatSheet);

	const heartemptyImage = new Image(); heartemptyImage.src = 'assets/textures/ui/heart_empty.png';
	const heartfullImage = new Image(); heartfullImage.src = 'assets/textures/ui/heart_full.png';
	let health = 5, healthBar = [], dead = false, deathTimer = 0, snowTimer = 0, lastCollision = 0, hurt = false;
	const CollisionCooldown = 1000;

	const drumImage = new Image(); drumImage.src = "assets/textures/ui/drum.png";
	const hornImage = new Image(); hornImage.src = "assets/textures/ui/horn.png";
	const userInterface = [];

	let CollisionSounds = [('assets/sounds/hurt.wav'), ('assets/sounds/hurt2.wav')], DeathSound = new Audio('assets/sounds/death.wav'), SoundParachuteDeployed = new Audio('assets/sounds/parachutedeployed.wav'), MusicChilderness = new Audio('assets/sounds/childerness.wav'), MusicDead = new Audio('assets/sounds/dead.wav'); MusicDead.loop = false;
	MusicChilderness.loop = true; MusicChilderness.autoplay = true;
	SoundParachuteDeployed.loop = false;
	
	const musicToggle = document.getElementById('musicbtn'); musicToggle.width = 48; musicToggle.height = 48;
	const soundToggle = document.getElementById('soundbtn'); soundToggle.width = 48; soundToggle.height = 48;

	let ChickenDirection = "right", WallobDirection = "right", randTimer = (Math.random() * 100)

	//#endregion

//#region Functions (General, player, enemy, UI and controls)

	function pauseUpdates() {
		randTimer -= 1;
		if (randTimer > 0) {randTimer -= 1}
		else if (randTimer <= 0) {randTimer = Math.random() * 100, chickenRandomChange(), wallobRandomChange()};
		if (dead == false) {collisionDetecting(Player, Wallob); chickenMovement(); wallobMovement(); } };

	function drawGround() {
		for (let row = 0; row < ground.length; row++) {
			for (let col = 0; col < ground[row].length; col++) {
			
				const tile = ground[row][col];

				if (tile === 1) { blocktypes[`snowSolid${row},${col}`] = new SolidBlock(groundMovement + col * 64, groundHeight - 512 + row * 64, 64, 64, 64, 'assets/textures/null.png'); context.drawImage(snowtile.image, groundMovement + col * snowtile.size, groundHeight - 512 + row * snowtile.size, snowtile.size, snowtile.size); groundCollision(row,col,blocktypes); blocktypes[`snowSolid${row},${col}`].drawRedOverlay(); }

				if (tile === 2) { blocktypes[`dirtSolid${row},${col}`] = new SolidBlock(groundMovement + col * 64, groundHeight - 512 + row * 64, 64, 64, 64, 'assets/textures/null.png'); context.drawImage(dirttile.image, groundMovement + col * dirttile.size, groundHeight - 512 + row * dirttile.size, dirttile.size, dirttile.size); blocktypes[`dirtSolid${row},${col}`].drawRedOverlay(); }

				if (tile === 3) { blocktypes[`rockBackground${row},${col}`] = new BackgroundObject(groundMovement + col * 64, groundHeight - 512 + row * 64, 64, 64, 64, 'assets/textures/null.png'); context.drawImage(rockpile.image, groundMovement + col * rockpile.size, groundHeight - 512 + row * rockpile.size, rockpile.size, rockpile.size); blocktypes[`rockBackground${row},${col}`].drawCyanOverlay(); }; } } };
				//(function is looking through each row, mapping the tile texture to each corresponding integer)

	function groundCollision(row,col,blocktypes) {
		let blockRC = blocktypes[`snowSolid${row},${col}`];
		if (Player.x + 16 >= blockRC.x && Player.x + 16 <= blockRC.x + blockRC.width && Player.y >= blockRC.y && Player.y >= blockRC.height && pause == false) {groundMovement -= Player.speed, Wallob.x -= Player.speed, Chicken.x -= Player.speed, Shop.x -= Player.speed;}
		if (Player.x + 48 >= blockRC.x && Player.x <= blockRC.x && Player.y >= blockRC.y && Player.y >= blockRC.height && pause == false) {groundMovement += Player.speed, Wallob.x += Player.speed, Chicken.x += Player.speed, Shop.x += Player.speed;}
		if (Player.y >= blockRC.y - 64 && Player.x <= blockRC.x + 48 && Player.x >= blockRC.x - 48 && Player.y <= blockRC.y && !keys[" "]) {Player.y = blockRC.y - 64, Player.velocityY = 0; onGround = true} };
			// Currently is allowing the player to jump through and snap onto the block. Also blocks you from moving when solidground is above.

	function jump(jumpheight) {
		{ Player.velocityY = jumpheight }; };

	function parachute(Player) {
		Player.gravity = 0.025, parachuteDeployed = true;
		if (!parachutecheck && keys[' ']) {SoundParachuteDeployed.play();}
		parachutecheck = keys[' ']; };

		// Enemies (and interactions with the player)

		// I will condense these 4 into 2 or 1 when I figure out a better way of making movement.
	function chickenMovement(){
		if (dead == false && pause == false) {if(ChickenDirection == "right") {Chicken.x += 1.8} if(ChickenDirection == "left") {Chicken.x -= 1.8} } };
	function chickenRandomChange(){
		if (dead == false && pause == false) {ChickenDirection = Math.random() < 0.5 ? "right" : "left"} };

	function wallobMovement(){
		if(dead == false && pause == false) {if(WallobDirection == "right") {Wallob.x += 2.8} if(WallobDirection == "left") {Wallob.x -= 2.8} } };
	function wallobRandomChange(){
		if (dead == false && pause == false) {WallobDirection = Math.random() < 0.5 ? "right" : "left"} };

	function collsionSoundLog(direction) {
		const now = Date.now();
		if (now - lastCollision >= CollisionCooldown) {console.log("colliding with enemy", direction), lastCollision = now;
			if (hurt == true) {health -= 1, hurt == false};
			if (health > 0) {let RandomCollisionSound = [Math.floor(Math.random() * 2)];
				let ChosenCollisionSound = new Audio (CollisionSounds[RandomCollisionSound]); ChosenCollisionSound.play(); }
			else {DeathSound.play(); } } };

	function collisionDetecting(Player, Wallob) {
		if (Player.x >= Wallob.x && Player.x <= Wallob.x + 48 && Player.y - 2 > Wallob.y - 2 && health > 0) { hurt = true, collsionSoundLog("to your left")};
		if (Player.x >= Wallob.x - 48 && Player.x <= Wallob.x && Player.y - 2 > Wallob.y - 2 && health > 0) { hurt = true, collsionSoundLog("to your right")};
		if (Player.y >= Wallob.y - 52 && Player.x <= Wallob.x + 32 && Player.x >= Wallob.x - 32 && Player.y <= Wallob.y - 14) { hurt = true, collsionSoundLog("below"), Player.y = Wallob.y - 52, Player.velocityY = 0, jump(-4); };
		if (Player.y > 700) {health = 0}; };

			// UI and controls

	function setHealthBar() {
		if (health > 0) { dead = false } else if (health <= 0) { dead = true };
		if (health === 5) {healthBar = [1, 1, 1, 1, 1];}
		else {
			if (health === 4) healthBar = [1, 1, 1, 1, 0];
			if (health === 3) healthBar = [1, 1, 1, 0, 0];
			if (health === 2) healthBar = [1, 1, 0, 0, 0];
			if (health === 1) healthBar = [1, 0, 0, 0, 0];
			if (health === 0) healthBar = [0, 0, 0, 0, 0]; }; };
	
	function drawHealth() {
		for (let heart = 0; heart < healthBar.length; heart++)
			if (healthBar[heart] === 1) { context.drawImage(heartfullImage, [heart] * 64 + 16, 16, 48, 48); }
			else { if (healthBar[heart] === 0) { context.drawImage(heartemptyImage, [heart] * 64 + 16, 16, 48, 48); } } };

	function drawButtons() {
		context.drawImage(drumImage, 1234, 16, 48, 48);
		context.drawImage(hornImage, 1170, 16, 48, 48); };

	function coordTrack(Player) {coordstext.textContent = `GX: ${Math.round(groundMovement-128)}, PY: ${Math.round(Player.y)}` };

	musicToggle.addEventListener("click", () => { MusicChilderness.muted = !MusicChilderness.muted, MusicDead.muted = !MusicDead.muted });
	soundToggle.addEventListener("click", () => { SoundParachuteDeployed.muted = !SoundParachuteDeployed.muted, DeathSound.muted = !DeathSound.muted, CollisionSounds.muted = !CollisionSounds.muted} );

	function musicStart() {
		const now = Date.now();
		let lastMusic = 0, musicCooldown = 1000;
		if (now - lastMusic >= musicCooldown) {MusicChilderness.play(); }; };

	window.addEventListener('keydown', function (pressed) {
		keys[pressed.key] = true; const runDirection = ["a", "d"];
		if (runDirection.includes(pressed.key) || pressed.ctrlKey) {pressed.preventDefault(); } } );
		// doesnt stop ctrl+W but does other combinations
	window.addEventListener('keyup', function (pressed) {keys[pressed.key] = false;} );

//#endregion

//#endregion🟥 MAIN VARIABLES, CONSTANTS AND FUNCTIONS

//#region	🟧 Gameloop

	const frameTime = 1000 / 60;
	let deltaTime = 0, lastTime = 0;

	function gameloop(currentTime) {
		context.clearRect(0, 0, gamespace.width, gamespace.height);
		context.imageSmoothingEnabled = false;
		deltaTime = (currentTime - lastTime) / frameTime;
		lastTime = currentTime;

		coordTrack(Player);
		setHealthBar();

		context.drawImage(Shop.image, Shop.x, Shop.y, Shop.width, Shop.height);
		drawHealth();
		drawGround();
		drawButtons();

		context.drawImage(titleImage, GameTitle.x, GameTitle.y, GameTitle.width, GameTitle.height);

		{ context.drawImage(Chicken.image, Chicken.x, Chicken.y, Chicken.width, Chicken.height) };

		{ context.drawImage(Wallob.image, Wallob.x, Wallob.y, Wallob.width, Wallob.height) };

		if (parachuteDeployed == true && dead == false) { Parachute.x = Player.x; Parachute.y = Player.y - 32, context.drawImage(parachuteImage, Parachute.x, Parachute.y, Parachute.width, Parachute.height); }

		context.drawImage(Player.image, spriteFrameX, 0, Player.width / 4, Player.height, Player.x, Player.y, Player.width, Player.height * 4)

		//not sure why I haven't put this all in a function but okay

		if (pause == false) {
			var speed = keys['Control'] ? Player.speed + 2 : Player.speed; Player.velocityY += Player.gravity; Player.y += Player.velocityY;}
		let playerDirection = "", speedDelta = (speed * deltaTime);

		if (dead == false && pause == false) {
			musicStart();
			if (keys['s']) { playerDirection = "idle"; spriteFrameX = 32; };
			if (keys['a']) { Shop.x += speedDelta, Chicken.x += speedDelta, Wallob.x += speedDelta, groundMovement += speedDelta; playerDirection = "left"; spriteFrameX = 16 };
			if (keys['d']) { Shop.x -= speedDelta, Chicken.x -= speedDelta, Wallob.x -= speedDelta, snowtile.x -= speedDelta, groundMovement -= speedDelta, playerDirection = "right"; spriteFrameX = 0; };
			if (onGround == true) {Player.gravity = 0.4, parachuteDeployed = false;
				if (keys[' ']) { jump(-14); onGround = false}; }
			if (keys[' '] && onGround == false && Player.velocityY > 0) { parachute(Player); }
			if (Player.velocityY < -17) { Player.velocityY = -17 }; }
		else if (dead == true) {
			spriteFrameX = 48; Player.speed = 0; Player.gravity = 0; Player.velocityY = 0;
			if (deathTimer < 1) {deathTimer += 0.05; };
			const deathScreenGradient = context.createLinearGradient(0, 0, 0, gamespace.height);
			deathScreenGradient.addColorStop(0, 'rgba(255, 0, 0, 0');
			deathScreenGradient.addColorStop(0.8, `rgba(255, 0, 0, ${0.1 * deathTimer / 2}`);
			deathScreenGradient.addColorStop(1, `rgba(255, 0, 0, ${0.7 * deathTimer}`);
			context.fillStyle = deathScreenGradient;
			context.fillRect(0, 0, gamespace.width, gamespace.height); const deathScreen = document.getElementById('deathscreen'); deathScreen.textContent = "YOU DIED"; { MusicChilderness.muted = true };
			MusicDead.play(); };

	//#region After Effects (Snow)
												
		/* const snowScreenGradient = context.createLinearGradient(0, 0, 0, gamespace.height);
		 snowScreenGradient.addColorStop(0.5, `rgba(999, 999, 999, ${0.5 * snowTimer / 2}`);
		 snowScreenGradient.addColorStop(1, `rgba(999, 999, 999, ${0.8 * snowTimer / 2}`);
		 context.fillStyle = snowScreenGradient; context.fillRect(0, 0, gamespace.width, gamespace.height)
		 }
		 */

	//#endregion

	//#region Pause mechanics and gameloop condition

		if (keys['p'] && !pausecheck && dead == false) { pause = !pause };
		pausecheck = keys['p'];
		if (pause == true && health > 0) {
			pauseScreen.textContent = "⏸";
			const pauseScreenGradient = context.createLinearGradient(0, 0, 0, gamespace.height);
			pauseScreenGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1');
			pauseScreenGradient.addColorStop(0.8, `rgba(0, 0, 0, 0.2`);
			pauseScreenGradient.addColorStop(1, `rgba(0, 0, 0, 0.5`);
			context.fillStyle = pauseScreenGradient;
			context.fillRect(0, 0, gamespace.width, gamespace.height); }
		else if (dead == false) { pauseScreen.textContent = " " }
		else if (dead == true) { pauseScreen.textContent = "reload";}
		if (!pause) { pauseUpdates(); };

		requestAnimationFrame(gameloop); };

	console.log(blocktypes);

	Player.image.onload = gameloop; } )
	
	//#endregion Pause mechanics and gameloop condition end

//#endregion	🟧 Gameloop end

//#region 	🟩 Notes

/*
Things to work on: Screen scrolling (MOVING SCREEN AROUND THE PLAYER RATHER THAN MOVING THE WHOLE HTML DOC), enemy movement, animation, temperature bar, fixed object-based collision for ground features
Less important: Sound design, texturing, niche/minor features
Current thing: Solid ground, onground fix to blocks themselves not a level of ground. Fix screen scrolling and settle on the best one for the game. Stop doing unimportant things though they are much more fun <o_o>
*/

//#endregion🟩 Notes end
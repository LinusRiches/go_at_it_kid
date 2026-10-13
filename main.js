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
	const gameTitle = { x: 450, y: 0, width: 500, height: 80 };
	const keys = {};

	//#endregion

	//#region Classes

	class TileType{
		constructor(x, y, height, width, size, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.size = size;
			this.image = new Image();
			this.image.src = imageSource;}
	};
	
		class SolidBlock extends TileType{
			drawRedOverlay() {if (keys['1']) {context.fillStyle = "rgba(255, 93, 93, 0.4)"; context.fillRect(this.x, this.y, this.width, this.height, this.size,), context.fillStyle = "rgba(255, 8, 8, 0.4)"; context.fillRect(this.x+4, this.y+4, this.width-8, this.height - 8, this.size) } }
		};

		class SemiSolid extends TileType{
			drawBlueOverlay() {if (keys['2']) {context.fillStyle = "rgba(8, 28, 255, 0.5)"; context.fillRect(this.x+4, this.y+4, this.width-8, this.height - 8, this.size,)} }
		};

		class BackgroundObject extends TileType{
			drawCyanOverlay() {if (keys['3']) {context.fillStyle = "rgba(147, 248, 255, 0.38)"; context.fillRect(this.x, this.y, this.width, this.height, this.size,); context.fillStyle = "rgba(8, 255, 255, 0.35)"; context.fillRect(this.x+4, this.y+4, this.width-8, this.height - 8, this.size,)} }
		};

	class playerEntity{
		constructor(x, y, width, height, speed, gravity, velocityY, imageObject){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.speed = speed;
			this.gravity = gravity;
			this.velocityY = velocityY;
			this.image = imageObject; }
	};

	class EnemyEntity{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource; }
	};

	class NeutralEntity{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource; }
	};

	class Structure{
		constructor(x, y, width, height, imageSource){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = new Image();
			this.image.src = imageSource; }
	};

	//#endregion

	//#region Variables

	let blocktypes = {}, snowtile = new SolidBlock(64, 256, 64, 64, 64, 'assets/textures/tiles/snowtile.png'), dirttile = new SolidBlock(64, 256, 64, 64, 64, 'assets/textures/tiles/dirttile.png'), rockpile = new BackgroundObject(64, 256, 64, 64, 64,'assets/textures/tiles/rockpile.png'), rocktile = new SolidBlock(64, 256, 64, 64, 64,'assets/textures/tiles/rocktile.png');
	let groundMovement = 0;
	let parachuteImage = new Image(); parachuteImage.src = 'assets/textures/tools/parachute.png';
	let Parachute = { width: 64, height: 64 };
	let goatSheet = new Image(); goatSheet.src = "assets/textures/goat/goatsheet.png";
	let goatFrameX = 0;
	let goatFrameY = 0;
	let player = new playerEntity(136, 512, 64, 64, 4, 0.4, 0, goatSheet);
	let chickenDirection = "right", wallobDirection = "right", randTimer = (Math.random() * 100)
	let Collisionsounds = [('assets/sounds/hurt.wav'), ('assets/sounds/hurt2.wav')], deathSound = new Audio('assets/sounds/death.wav'), soundParachuteDeployed = new Audio('assets/sounds/parachutedeployed.wav'), musicChilderness = new Audio('assets/sounds/childerness.wav'), musicDead = new Audio('assets/sounds/dead.wav'); musicDead.loop = false;
	musicChilderness.loop = true; musicChilderness.autoplay = true;
	soundParachuteDeployed.loop = false;

	const shop = new Structure(896, 512 - 256, 320, 320, "assets/textures/structures/shop.png");
	const chicken = new NeutralEntity(350, 512, 64, 64, 'assets/textures/neutral/chicken.png');
	const wallob = new EnemyEntity(400, 512 - 64, 64, 128,'assets/textures/enemies/wallob.png');
	const userInterface = [];
	const heartemptyImage = new Image(); heartemptyImage.src = 'assets/textures/ui/heart_empty.png';
	const heartfullImage = new Image(); heartfullImage.src = 'assets/textures/ui/heart_full.png';
	let health = 5, healthBar = [], hurt = false, dead = false, deathTimer = 0, snowTimer = 0, lastCollision = 0;
	const CollisionCooldown = 1000;
	const drumImage = new Image(); drumImage.src = "assets/textures/ui/drum.png";
	const hornImage = new Image(); hornImage.src = "assets/textures/ui/horn.png";
	const musicToggle = document.getElementById('musicbtn'); musicToggle.width = 48; musicToggle.height = 48;
	const soundToggle = document.getElementById('soundbtn'); soundToggle.width = 48; soundToggle.height = 48;

	//#endregion

//#region Functions (General, player, enemy, UI and controls)

	function pauseUpdates() {
		randTimer -= 1;
		if (randTimer > 0) {randTimer -= 1}
		else if (randTimer <= 0) {randTimer = Math.random() * 100, chickenRandomChange(), wallobRandomChange()};
		if (dead == false) {collisionDetecting(player, wallob); chickenMovement(); wallobMovement(); }
	};

	function drawGround(ground) {
		for (let row = 0; row < ground.length; row++) {
			for (let col = 0; col < ground[row].length; col++) {
			
				const tile = ground[row][col];

				if (tile > 0 && tile < 4) { blocktypes[`Solid${row},${col}`] = new SolidBlock(groundMovement + col * 64, 0 + row * 64, 64, 64, 64, 'assets/textures/null.png');
					if (tile === 1) {context.drawImage(snowtile.image, groundMovement + col * snowtile.size, 0 + row * snowtile.size, snowtile.size, snowtile.size);}
					if (tile === 2) {context.drawImage(rocktile.image, groundMovement + col * rocktile.size, 0 + row * rocktile.size, rocktile.size, rocktile.size);}
					if (tile === 3) {context.drawImage(dirttile.image, groundMovement + col * dirttile.size, 0 + row * dirttile.size, dirttile.size, dirttile.size);}
					blocktypes[`Solid${row},${col}`].drawRedOverlay(); solidCollision(row,col,blocktypes); };
				if (tile === 10) { blocktypes[`rockBackground${row},${col}`] = new BackgroundObject(groundMovement + col * 64, 0 + row * 64, 64, 64, 64, 'assets/textures/null.png'); context.drawImage(rockpile.image, groundMovement + col * rockpile.size, 0 + row * rockpile.size, rockpile.size, rockpile.size); blocktypes[`rockBackground${row},${col}`].drawCyanOverlay(); }; } }
	};

// bottom overlap is only checking the y, which means when searching for if it is true, it says yes because of the blocks high up to the right and so stops the player falling. These need to be combined in some way to allow free movement while still maintaining gravity. They may need to be seperated.

    function solidCollision(row,col,blocktypes) {
		let blockCollision = blocktypes[`Solid${row},${col}`];

        if (dead == false && pause == false){
			let leftOverlap = (player.x < blockCollision.x + blockCollision.width);
        	let rightOverlap = (player.x + player.width > blockCollision.x);
        	let topOverlap = (player.y + player.height < blockCollision.y);
        	let bottomOverlap = (player.y >= blockCollision.y - 64 && player.x <= blockCollision.x + 48 && player.x >= blockCollision.x - 48 && player.y <= blockCollision.y - 14);

            if (leftOverlap)
                {//groundMovement += player.speed, wallob.x += player.speed, chicken.x += player.speed, shop.x += player.speed;
					}
            if (rightOverlap)
                {//groundMovement -= player.speed, wallob.x -= player.speed, chicken.x -= player.speed, shop.x -= player.speed;
					}
            if (topOverlap)
                {}
            if (bottomOverlap)
                {onGround = true; parachuteDeployed = false; player.velocityY = 0; player.y = blockCollision.y - 64
                if (keys[' '] && onGround == true) { jump(-14); onGround = false}; }
                if (keys[' '] && onGround == false && player.velocityY > 0) { parachute(player); }
            }
        }

	function jump(jumpheight) {
		{ player.gravity = 0.4; player.velocityY = jumpheight };
	};

	function parachute(player) {
		player.gravity = 0.025, parachuteDeployed = true;
		if (!parachutecheck && keys[' ']) {soundParachuteDeployed.play();}
		parachutecheck = keys[' '];
	};

		// Enemies (and interactions with the player) I will condense these 4 into 2 or 1 when I figure out a better way of making movement.
		
	function chickenMovement(){
		if (dead == false && pause == false) {if(chickenDirection == "right") {chicken.x += 1.8} if(chickenDirection == "left") {chicken.x -= 1.8} }
	};
	function chickenRandomChange(){
		if (dead == false && pause == false) {chickenDirection = Math.random() < 0.5 ? "right" : "left"}
	};

	function wallobMovement(){
		if(dead == false && pause == false) {if(wallobDirection == "right") {wallob.x += 2.8} if(wallobDirection == "left") {wallob.x -= 2.8} }
	};
	function wallobRandomChange(){
		if (dead == false && pause == false) {wallobDirection = Math.random() < 0.5 ? "right" : "left"}
	};

	function collsionsoundLog(direction) {
		const now = Date.now();
		if (now - lastCollision >= CollisionCooldown) {console.log("colliding with enemy", direction), lastCollision = now;
			if (hurt == true) {health -= 1, hurt == false};
			if (health > 0) {let RandomCollisionsound = [Math.floor(Math.random() * 2)];
				let ChosenCollisionsound = new Audio (Collisionsounds[RandomCollisionsound]); ChosenCollisionsound.play(); }
			else {deathSound.play(); } }
	};

	function collisionDetecting(player, wallob) {
		if (player.x >= wallob.x && player.x <= wallob.x + 48 && player.y - 2 > wallob.y - 2 && player.y < wallob.y + wallob.height && health > 0) { hurt = true, collsionsoundLog("to your left")};
		if (player.x >= wallob.x - 48 && player.x <= wallob.x && player.y - 2 > wallob.y - 2 && player.y < wallob.y + wallob.height && health > 0) { hurt = true, collsionsoundLog("to your right")};
		if (player.y >= wallob.y - 52 && player.x <= wallob.x + 32 && player.x >= wallob.x - 32 && player.y <= wallob.y - 14) { hurt = true, collsionsoundLog("below"), player.y = wallob.y - 52, player.velocityY = 0, jump(-4); };
		if (player.y > 700) {health = 0};
	};

	function screenClick() {
		if (pause == false){if (wallob.x <= player.x + 128 && player.y >= wallob.y || wallob.x <= player.x - 64 && player.y >= wallob.y) {wallob.y = -128}; };
		// very bodged prep for killing / knocking out a wallob.	
	};

	// UI and controls

	function setHealthBar() {
		if (health > 0) { dead = false } else if (health <= 0) { dead = true };
		if (health === 5) {healthBar = [1, 1, 1, 1, 1];}
		else {
			if (health === 4) healthBar = [1, 1, 1, 1, 0];
			if (health === 3) healthBar = [1, 1, 1, 0, 0];
			if (health === 2) healthBar = [1, 1, 0, 0, 0];
			if (health === 1) healthBar = [1, 0, 0, 0, 0];
			if (health === 0) healthBar = [0, 0, 0, 0, 0]; };
	};
	
	function drawHealth() {
		for (let heart = 0; heart < healthBar.length; heart++)
			if (healthBar[heart] === 1) { context.drawImage(heartfullImage, [heart] * 64 + 16, 16, 48, 48); }
			else { if (healthBar[heart] === 0) { context.drawImage(heartemptyImage, [heart] * 64 + 16, 16, 48, 48); } }
	};

	function drawButtons() {
		context.drawImage(drumImage, 1234, 16, 48, 48);
		context.drawImage(hornImage, 1170, 16, 48, 48);
	};

	function coordTrack(player) {
		coordstext.textContent = `GX: ${Math.round(groundMovement-128)}, PY: ${Math.round(player.y)}`
	};

	musicToggle.addEventListener("click", () => { musicChilderness.muted = !musicChilderness.muted, musicDead.muted = !musicDead.muted });
	soundToggle.addEventListener("click", () => { soundParachuteDeployed.muted = !soundParachuteDeployed.muted, deathSound.muted = !deathSound.muted, Collisionsounds.muted = !Collisionsounds.muted} );

	function musicStart() {
		const now = Date.now();
		let lastmusic = 0, musicCooldown = 1000;
		if (now - lastmusic >= musicCooldown) {musicChilderness.play(); };
	};

	window.addEventListener('keydown',
		function (pressed) {
		keys[pressed.key] = true; const runDirection = ["a", "d"];
		if (runDirection.includes(pressed.key) || pressed.ctrlKey) {pressed.preventDefault(); } } );
		// doesnt stop ctrl+W but does other combinations
	window.addEventListener('keyup',
		function (pressed) {keys[pressed.key] = false;} );
	window.addEventListener('click', screenClick);

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

		coordTrack(player);
		setHealthBar();

		context.drawImage(shop.image, shop.x, shop.y, shop.width, shop.height);
		drawHealth();
		drawGround(ground);
		drawButtons();

		context.drawImage(titleImage, gameTitle.x, gameTitle.y, gameTitle.width, gameTitle.height);

		{ context.drawImage(chicken.image, chicken.x, chicken.y, chicken.width, chicken.height) };

		{ context.drawImage(wallob.image, wallob.x, wallob.y, wallob.width, wallob.height) };

		if (parachuteDeployed == true && dead == false) { Parachute.x = player.x; Parachute.y = player.y - 32, context.drawImage(parachuteImage, Parachute.x, Parachute.y, Parachute.width, Parachute.height); }

		context.drawImage(player.image, goatFrameX, 0, player.width / 4, player.height, player.x, player.y, player.width, player.height * 4)

		//not sure why I haven't put this all in a function but okay

		if (pause == false) {
			var speed = keys['Control'] ? player.speed + 2 : player.speed; player.velocityY += player.gravity; player.y += player.velocityY;}
		let playerDirection = "", speedDelta = (speed * deltaTime);

		if (dead == false && pause == false) {
			musicStart();
			if (keys['s']) { playerDirection = "idle"; goatFrameX = 32; };
			if (keys['a']) { shop.x += speedDelta, chicken.x += speedDelta, wallob.x += speedDelta, groundMovement += speedDelta; playerDirection = "left"; goatFrameX = 16 };
			if (keys['d']) { shop.x -= speedDelta, chicken.x -= speedDelta, wallob.x -= speedDelta, snowtile.x -= speedDelta, groundMovement -= speedDelta, playerDirection = "right"; goatFrameX = 0; }; }
		else if (dead == true) {
			goatFrameX = 48; player.speed = 0; player.gravity = 0; player.velocityY = 0;
			if (deathTimer < 1) {deathTimer += 0.05; };
			const deathScreenGradient = context.createLinearGradient(0, 0, 0, gamespace.height);
			deathScreenGradient.addColorStop(0, 'rgba(255, 0, 0, 0');
			deathScreenGradient.addColorStop(0.8, `rgba(255, 0, 0, ${0.1 * deathTimer / 2}`);
			deathScreenGradient.addColorStop(1, `rgba(255, 0, 0, ${0.7 * deathTimer}`);
			context.fillStyle = deathScreenGradient;
			context.fillRect(0, 0, gamespace.width, gamespace.height); const deathScreen = document.getElementById('deathscreen'); deathScreen.textContent = "YOU DIED"; { musicChilderness.muted = true };
			musicDead.play(); };

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
	

	player.image.onload = gameloop; } )
	
	//#endregion Pause mechanics and gameloop condition end

//#endregion	🟧 Gameloop end

//#region 	🟩 Notes

/*
Things to work on: Screen scrolling (MOVING SCREEN AROUND THE player RATHER THAN MOVING THE WHOLE HTML DOC), enemy movement, animation, temperature bar, fixed object-based collision for ground features
Less important: sound design, texturing, niche/minor features
Current thing: Solid ground, onground fix to blocks themselves not a level of ground. Fix screen scrolling and settle on the best one for the game. Stop doing unimportant things though they are much more fun <o_o>
*/

//#endregion🟩 Notes end
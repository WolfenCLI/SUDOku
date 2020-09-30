const jsonfile = require ('jsonfile');
const fs = require('fs');
const Canvas = require('canvas');
const Discord = require('discord.js');

const Rajdhani = new Font('gubblebum', fontFile('./fonts/Rajdhani-Bold.ttf'));

// Pass the entire Canvas object because you'll need to access its width, as well its context
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

module.exports = {
	name: 'pog',
	description: 'Shows user level',
	cooldown: 5,
	async execute(message) {
		var stats ={};
		if (fs.existsSync('levels.json')) {
			stats = jsonfile.readFileSync('levels.json')
		}
		const guildStats = stats[message.guild.id];
		const userStats = guildStats[message.author.id]
		//message.reply(`You are currently level ${userStats.level}`)
		
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		// we need to await the Promise gets resolved since loading of Image is async
		const background = await Canvas.loadImage('./assets/background1.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);  



		// Slightly smaller text placed above the member's display name
		//ctx.font = '28px sans-serif';
		let memberUsername = `${message.author.username}, You are currently Level;`
		ctx.font = applyText(canvas, memberUsername);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(memberUsername, canvas.width / 2.5, canvas.height / 3.5);


		// Select the font size and type from one of the natively available fonts
		//ctx.font = applyText(canvas, member.displayName);
		ctx.font = '28px sans-serif';
		// Select the style that will be used to fill the text in
		ctx.fillStyle = '#ffffff';
		// Actually fill the text with a solid color
		ctx.fillText(`${userStats.level}`, canvas.width / 2.5, canvas.height / 1.8);
		
		
		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#f0f0f0';
		ctx.fill();
		ctx.lineWidth = 10;
		ctx.strokeStyle = '#ffffff';
		ctx.stroke();


		// Pick up the pen
		ctx.beginPath();
		// Start the arc to form a circle
		ctx.arc(125, 125, 95, 0, Math.PI * 2, true);
		// Put the pen down
		ctx.closePath();
		// Clip off the region you drew on
		ctx.clip();
		// Wait for Canvas to load the image
		const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
		// Draw a shape onto the main canvas
		ctx.drawImage(avatar, 25, 25, 200, 200);
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'test.png');
		message.reply(``, attachment);
	}
};
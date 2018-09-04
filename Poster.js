const { POSTER_ID, POSTER_TOKEN, POSTER_TIME } = process.env;
const request = require('node-superfetch');
const time = Number.parseFloat(POSTER_TIME) || 1.8e+6;
const subreddits = ['memes', 'surrealmemes', 'MemeEconomy', 'wholesomememes', 'tumblr', 'me_irl', 'blessedimages'];

setInterval(async () => {
	try {
		const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
		const { body } = await request.get(`https://www.reddit.com/r/${subreddit}/hot.json`);
		const posts = body.data.children.filter(post => post.data && post.data.post_hint === 'image' && post.data.url);
		if (!posts.length) throw new Error(`No images in r/${subreddit}.`);
		const post = posts[Math.floor(Math.random() * posts.length)];
		await request
			.post(`https://discordapp.com/api/webhooks/${POSTER_ID}/${POSTER_TOKEN}`)
			.send({ content: `**r/${subreddit}** ${post.data.title}\n${post.data.url}` });
	} catch (err) {
		console.error('[MEME POSTER]', err);
	}
}, time);

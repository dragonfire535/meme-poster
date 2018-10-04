require('dotenv').config();
const { POSTER_ID, POSTER_TOKEN, POSTER_TIME } = process.env;
const request = require('node-superfetch');
const time = Number.parseFloat(POSTER_TIME) || 3.6e+6;
const subreddits = require('./assets/json/subreddits');
const types = ['image', 'rich:video'];

setInterval(async () => {
	try {
		const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
		const { body } = await request
			.get(`https://www.reddit.com/r/${subreddit}/hot.json`)
			.query({ limit: 100 });
		const posts = body.data.children.filter(post => {
			if (!post.data) return false;
			return types.includes(post.data.post_hint) && post.data.url && post.data.title && !post.data.over_18;
		});
		if (!posts.length) return;
		const post = posts[Math.floor(Math.random() * posts.length)];
		await request
			.post(`https://discordapp.com/api/webhooks/${POSTER_ID}/${POSTER_TOKEN}`)
			.send({ content: `**r/${subreddit}** ${post.data.title}\n${post.data.url}` });
	} catch (err) {
		console.error('[MEME POSTER]', err);
	}
}, time);

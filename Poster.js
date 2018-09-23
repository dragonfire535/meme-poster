require('dotenv').config();
const { POSTER_ID, POSTER_TOKEN, POSTER_TIME } = process.env;
const request = require('node-superfetch');
const time = Number.parseFloat(POSTER_TIME) || 3.6e+6;
const subreddits = require('./assets/json/subreddits');

setInterval(async () => {
	try {
		const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
		const { body } = await request
			.get(`https://www.reddit.com/r/${subreddit}/top.json`)
			.query({
				sort: 'top',
				t: 'day',
				limit: 100
			});
		const posts = body.data.children.filter(post => {
			if (!post.data) return false;
			return post.data.post_hint === 'image' && post.data.url && post.data.title && !post.data.over_18;
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

const {
	listConfessions,
	createConfession,
} = require('../model/confessions.js');
const { Layout } = require('../templates.js');

function get(req, res) {
	const session = req.session;
	const current_user = session && session.user_id;
	const page_owner = Number(req.params.user_id);
	if (current_user !== page_owner) {
		return res.status(401).send('<h1>You cannot view this page.</h1>');
	} else {
		const confessions = listConfessions(req.params.user_id);
		const title = 'Your secrets';
		const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Stack" style="--gap: 0.5rem">
        <textarea name="content" aria-label="your confession" rows="4" cols="30" style="resize: vertical"></textarea>
        <button class="Button">Confess 🤫</button>
      </form>
      <ul class="Center Stack">
        ${confessions
					.map(
						(entry) => `
            <li>
              <h2>${entry.created_at}</h2>
              <p>${entry.content}</p>
            </li>
            `
					)
					.join('')}
      </ul>
    </div>
  `;
		const body = Layout({ title, content });
		res.send(body);
	}
}

function post(req, res) {
	const session = req.session;
	if (!session) {
		return res
			.status(401)
			.send('<h1>You must be logged in to submit a confession</h1>');
	} else {
		const current_user = session.user_id;
		createConfession(req.body.content, current_user);
		res.redirect(`/confessions/${current_user}`);
	}
}

module.exports = { get, post };

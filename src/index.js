let bodyParser = require('body-parser');
let compression = require('compression');
let Controller = require('./Controller.js');
let cors = require('cors');
let ErrorMessage = require('./ErrorMessage');
let express = require('express');
let Logger = require('./Logger');
let Message = require('./Message');
let SparkPost = require('sparkpost');

let SPARKPOST_KEY = process.env.SPARKPOST_KEY || 'ac91d28db7819d0668dcd965073e4f25f9a024fb';
let sparkpost = new SparkPost(SPARKPOST_KEY);

let CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT || 'sales@spry-group.com';
let CONTACT_TEMPLATE = process.env.CONTACT_TEMPLATE || 'contact';


// express app
let logger = new Logger();
let controller = new Controller(logger, sparkpost, CONTACT_RECIPIENT, CONTACT_TEMPLATE);
let app = express();
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.logger = logger;

let swagger = require('./swagger.json');

app.get('/', (req, res, next) => {
	res.status(200).send(swagger);
	next();
});

app.post('/v1/contact', (req, res, next) => {
	controller.contact(req.body).then(() => {
		res.status(200).send(new Message('contact', 'OK'));
		next();
	}).catch((error) => {
		next(error);
	});

});

app.get('/v1/dashboard/github/history/:owner/:repo', (req, res, next) => {
	controller.dashboardGithubHistory(req.params.owner, req.params.repo).then((req, res, next) => {
		res.status(200).send(new Message('webhookGithub', 'OK'));
		next();
	}).catch((error) => {
		next(error);
	});
});

app.post('/v1/webhook/github', (req, res, next) => {
	controller.webhookGithub(req.body).then(() => {
		res.status(200).send(new Message('webhookGithub', 'OK'));
		next();
	}).catch((error) => {
		next(error);
	});
});


function ErrorHandler(err, req, res, next) {
	let message = new ErrorMessage(err);
	switch (err.name) {
		case 'ValidationError':
			res.status(400);
			break;
		case 'SparkPostError':
			logger.log('sp', err);
			// fall through.
		default:
			res.status(500);
	}
	res.send(message);
	logger.log(message);
	return next();
}

// log error as a json structure for consumption and parsing.
app.use(ErrorHandler);

module.exports = app;


/* istanbul ignore next */
// if called directly, start a server.
if (!module.parent) {
	let cluster = require('cluster');
    // assign exit variable to prevent no-process-exit rule trigger in eslint.
	let exit = process.exit;
	// Handle error conditions
	process.on('SIGTERM', () => {
		logger.log('exit.sigterm', 'Exited on SIGTERM');
		exit(0);
	});

	process.on('SIGINT', () => {
		logger.log('exit.sigint', 'Exited on SIGINT');
		exit(0);
	});

	process.on('uncaughtException', (err) => {
		logger.log('exit.uncaught', err);
		exit(1);
	});

	if (cluster.isMaster) {
		// MASTER process
		cluster.on('fork', (worker) => {
			logger.log('cluster.fork', {id: worker.id, pid: worker.process.pid});
		});

		cluster.on('listening', (worker, address) => {
			logger.log('cluster.listening', {id: worker.id, pid: worker.process.pid}, address);
		});

		cluster.on('exit', (worker) => {
			logger.log('cluster.exit', {id: worker.id, pid: worker.process.pid});
			setTimeout(() => { cluster.fork(); }, 1000);
		});

		// fork workers, 1 by default for self recovery.
		let workers = process.env.WORKERS || 1;
		for (let i=0; i < workers; i++) cluster.fork();
		return;
	}
	let PORT = process.env.PORT || 3000;
	app.listen(PORT);
}

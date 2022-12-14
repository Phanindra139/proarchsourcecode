



var http = require("http");


//this method initiates
exports.handler = function (event, context, callback) {

	var headers = event.headers;
	var queryStringParameters = event.queryStringParameters;
	var pathParameters = event.pathParameters;
	var stageVariables = event.stageVariables;
	var arnV = event.methodArn;
	var tokenWithBearer = headers.Authorization

	var token = tokenWithBearer.substring(7, tokenWithBearer.length);


	var val = '';
	const pathV = '/validate/' + token;

	var option = {
		host: '52.66.175.84',
		port: 8010,
		method: 'GET',
		path: pathV
	};
	http.request(option, function (res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
			console.log('Got the data', body);

		});

		res.on('end', function () {
			val = JSON.parse(body);

			if (val === true) {
				callback(null, generateAllow('me', event.methodArn));
			} else {
				callback('Unauthorized')
			}

		})
		console.log('ENd of function', val);

	}).end();


}

var generatePolicy = function (principalId, effect, resource) {

	var authResponse = {};
	authResponse.principalId = principalId;
	var policyDocument = {};
	policyDocument.Version = '2012-10-17'; // default version
	policyDocument.Statement = [];
	var statementOne = {};
	statementOne.Action = 'execute-api:Invoke'; // default action
	statementOne.Effect = effect;
	statementOne.Resource = resource;
	policyDocument.Statement[0] = statementOne;
	authResponse.policyDocument = policyDocument;

	return authResponse;
}

var generateAllow = function (principalId, resource) {
	return generatePolicy(principalId, 'Allow', resource);
}

var generateDeny = function (principalId, resource) {
	return generatePolicy(principalId, 'Deny', resource);
}


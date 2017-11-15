const SaleResource = require('./resources/sale');
const recipe = require('./triggers/recipe');

const addAuthToHeader = (request, z, bundle) => {
	request.headers['api-auth-accountid'] = bundle.authData.accountId;
	request.headers['api-auth-applicationkey'] = bundle.authData.applicationKey;
	return request;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
	version: require('./package.json').version,
	platformVersion: require('zapier-platform-core').version,

	authentication: {
		type: 'custom',
		fields: [
      {
        key: 'accountId',
        type: 'string',
        required: true,
        helpText: 'Your Account ID, found at https://inventory.dearsystems.com/ExternalApi'
      },
      {
        key: 'applicationKey',
        type: 'string',
        required: true,
        helpText: 'Your API Key, found at https://inventory.dearsystems.com/ExternalApi'
      }
		],
		test: (z, bundle) => {
			const promise = z.request('https://inventory.dearsystems.com/ExternalApi/Me');
			return promise.then(response => {
				if (response.status !== 200) {
					throw new Error('Invalid API Credentials');
				}
			});
		}
	},

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
	beforeRequest: [
		addAuthToHeader
	],

	afterResponse: [
	],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
	resources: {
    [SaleResource.key]: SaleResource,
	},

  // If you want your trigger to show up, you better include it here!
	triggers: {
		// [recipe.key]: recipe
	},

  // If you want your searches to show up, you better include it here!
	searches: {
	},

  // If you want your creates to show up, you better include it here!
	creates: {
	}
};

// Finally, export the app.
module.exports = App;

//This is the game API that commnucates with the player API. The Game API is used by the game.
/*
	<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.24/browser-polyfill.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/postal.js/1.0.7/postal.min.js"></script>
    <script src="postal.federation.min.js"></script>
    <script src="postal.request-response.js"></script>
    <script src="postal.xframe.min.js"></script>
*/
(function(window, $, postal) {
	var GameAPITransport = postal;
	GameAPITransport.instanceId('gameAPI');
	
	// We need to tell postal how to get a deferred instance
	GameAPITransport.configuration.promise.createDeferred = function() {
	    return new $.Deferred();
	};
	// We need to tell GameAPITransport how to get a "public-facing"/safe promise instance
	GameAPITransport.configuration.promise.getPromise = function(dfd) {
	    return dfd.promise();
	};
	GameAPITransport.fedx.addFilter([
	    { channel: 'users',    topic: '#', direction: 'both'  },
	    { channel: 'iframez',   topic: '#', direction: 'both'  },
	    { channel: 'points',   topic: '#', direction: 'both' },
	    { channel: 'status',   topic: '#', direction: 'both' }

	]);

	GameAPITransport.addWireTap(function(d, e) {
	    console.log("ID: " + GameAPITransport.instanceId() + " - " + JSON.stringify(e, null, 4));
	});

	window.edFlockGameAPITransport = GameAPITransport;
	edFlockGameAPITransport.fedx.signalReady();

	window.EdflockGameApi = function() {
		/*var users = edFlockGameAPITransport.channel('users'),
			score = edFlockGameAPITransport.channel('score');

		this.requestForUserName = function() {
			return users.request({
				topic: 'username',
				data: {user: 1},
				timeout: 2000
			});
		}*/

		this.transport = edFlockGameAPITransport;

		/* It expect options as 
		*	{
		*		channel : "",
		*		topic : '',
		*		data : {}
		*	}
		*
		* Subscribes to topic = 'topic.request' and publish the data in the form of 'topic.response'
		*/
		this.subscribeAndReply = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '#',
				data = options.data || {};

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + '.request',
				callback : function() {
        		    edFlockGameAPITransport.publish({
	                    channel: channel,
	                    topic: topic + ".response",
	                    data: data
	                });
				}
			});
		}

		this.requestForData = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '#',
				callback = options.callback || function() {console.log('no call back given')};

			this.transport.publish({
                channel: channel,
                topic: topic + ".request"
            });

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + ".response",
				callback : callback
			}).once();
		}

		this.requestForUserName = function(cb) {
			this.requestForData({channel: 'users', topic: 'name', 'callback': cb});
		}

		this.addPoints = function(data) {
			this.transport.publish({
				channel: 'points',
				topic: 'points.add',
				data: data
			});
		}

		this.changeStatus = function(data) {
			this.transport.publish({
				channel: 'status',
				topic: 'status.change',
				data: data
			});
		}

	}
}) (window, $, postal)




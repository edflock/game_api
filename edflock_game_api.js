(function(window, $, PubSub) {
	var edFlockGameAPITransport = function (argument) {

		var argument = argument || {},
			parent = argument.parent || window;
		
		if (window.addEventListener) {
			// For standards-compliant web browsers
			parent.addEventListener("message", parseMessage, false);
		}
		else {
			parent.attachEvent("onmessage", parseMessage);
		}

		function parseMessage(event) {
			var messageData = event.data,
				channel = messageData.channel,
				topic = messageData.topic,
				actualData = messageData.data;
				console.log(event);

			messageName = channel + "." + topic;
			console.log('iframe message just recieved = ' + messageName);
			PubSub.publish(messageName, actualData);
		}

		this.publish = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '',
				data = options.data || "";

			var dataMain = {
				channel: channel,
				topic: topic,
				data: data
			};

			messageName = channel + "." + topic;

			console.log('iframe publishing event = '+ messageName);
			PubSub.publish(messageName, data);

			parent.postMessage(dataMain, "*");
		}

		this.subscribe = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '',
				callback = options.callback || function() {console.log('no call back given')};

			messageName = channel + "." + topic;
			console.log('iframe subscribing to event = '+ messageName);

			PubSub.subscribe(messageName, callback);
		}

		this.subscribeOnce = function (options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '',
				callback = options.callback || function() {console.log('no call back given')};

			messageName =  channel + "." + topic;
			console.log('iframe subscribing to event once = '+ messageName);

			subscribeId = PubSub.subscribe(messageName, callback);
			PubSub.subscribe(messageName, (function(token) {
				return function() {
					PubSub.unsubscribe( token );
				}
			})(subscribeId));

		}
	}

	window.EdflockGameApi = function(options) {
		/*var users = edFlockGameAPITransport.channel('users'),
			score = edFlockGameAPITransport.channel('score');

		this.requestForUserName = function() {
			return users.request({
				topic: 'username',
				data: {user: 1},
				timeout: 2000
			});
		}*/
		transport = new edFlockGameAPITransport();

		this.transport = transport;

		/* It expect options as 
		*	{
		*		channel : "",
		*		topic : '',
		*		dataFunction: function() {}
		*	}
		*
		* Subscribes to topic = 'topic.request' and publish the data in the form of 'topic.response'
		*/
		this.subscribeAndReply = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '#',
				dataFunction = options.dataFunction || function() {return{}};

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + '-request',
				callback : function() {
					var data = dataFunction();
        		    transport.publish({
	                    channel: channel,
	                    topic: topic + "-response",
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
                topic: topic + "-request"
            });

			this.transport.subscribeOnce({
				channel  : channel,
				topic    : topic + "-response",
				callback : callback
			});
		}

		this.requestForUserName = function(cb) {
			this.requestForData({channel: 'users', topic: 'name', 'callback': cb});
		}

		this.addPoints = function(data) {
			console.log('iframe sending');
			this.transport.publish({
				channel: 'points',
				topic: 'points-add',
				data: data
			});
		}

		this.changeStatus = function(data) {
			this.transport.publish({
				channel: 'status',
				topic: 'status-change',
				data: data
			});
		}

	}
}) (window, $, PubSub)




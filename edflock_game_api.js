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

            window.parent.postMessage(dataMain, "*");
        };

        this.subscribe = function(options) {
            var channel = options.channel || 'generic',
                topic = options.topic || '',
                callback = options.callback || function() {console.log('no call back given')};

            messageName = channel + "." + topic;
            console.log('iframe subscribing to event = '+ messageName);

            PubSub.subscribe(messageName, callback);
        };

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

        };
    };

    window.EdflockGameApi = function(options) {
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
        this.subscribeAndReplyWithFunction = function(options) {
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
        };

        this.subscribeAndReplyWithData = function(options) {
            var channel = options.channel || 'generic',
                topic = options.topic || '#',
                data = options.data || '';

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
        };

        this.subscribeAndReplyAsync = function(options) {
            var channel = options.channel || 'generic',
                topic = options.topic || '#',
                promise = options.promise;

            this.transport.subscribe({
                channel  : channel,
                topic    : topic + '-request',
                callback : function() {
                    promise.done(function(data) {
                        transport.publish({
                            channel: channel,
                            topic: topic + "-response",
                            data: data
                        });
                    });
                }
            });
        };

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
        };

        this.requestForUser = function(cb) {
            this.requestForData({channel: 'users', topic: 'all', 'callback': cb});
        };

        this.addPoints = function(data) {
            console.log('iframe sending');
            this.transport.publish({
                channel: 'points',
                topic: 'points-add',
                data: data
            });
        };

        this.changeStatus = function(data) {
            this.transport.publish({
                channel: 'status',
                topic: 'status-change',
                data: data
            });
        };

        this.updateLife = function (data) {
            this.transport.publish({
                channel: 'life',
                topic: 'update',
                data: data
            })
        };

        this.changeStatusLost = function (data) {
            this.transport.publish({
                channel: 'status',
                topic: 'lost',
                data: data
            })
        };

        this.awardBadge = function(data) {
            this.transport.publish({
                channel: 'status',
                topic: 'badge-awarded',
                data: data
            })
        }

    }
}) (window, $, PubSub);
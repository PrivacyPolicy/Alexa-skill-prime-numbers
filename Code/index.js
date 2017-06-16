'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = "amzn1.ask.skill.bd898084-7a07-4fde-ba4b-74b6cdad08b4";
var SKILL_NAME = 'Prime Numbers';

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var nthPrime = function (number, callback) {
    // TODO: calculate prime number
    return number;
};

var isPrime = function (number, callback) {
    // TODO: calculate prime number
    return true;
};

var addNth = function (number) {
    return number + 'th';
};

var handleIntent = function(_this, callback) {
    var n = _this.event.request.intent.slots.Number;
    if (n == null || n.value < 1) {
        _this.emit('UnrecognizedError');
    } else if (n.value > 1000000) {
        _this.emit('TooBigError');
    } else {
        callback(n.value);
    }
},

var handlers = {
    'NthPrimeIntent': function (n) {
        // var _this = this;
        // handleIntent(_this, function(n) {
        //     _this.emit(':tell', 'The ' + addNth(n) + ' prime number is '
        //         + prime + '.');
        // });
        this.emit(':tell', 'Gabe you\'re not crazy. This is working sort of n. :)');
    },
    'IsPrimeIntent': function () {
        // var _this = this;
        // handleIntent(_this, function(n) {
        //     _this.emit(':tell', n + ' is ' + (isPrime(n) ? '' : 'not ')
        //         + 'a prime number');
        // });
        this.emit(':tell', 'Gabe you\'re not crazy. This is working. :)');
    },
    'CustomError': function() {
        this.emit(':tell', "I'm sorry, I've encountered an error.", SKILL_NAME,
            "I've encountered an error.");
        this.emit('AMAZON.StopIntent');
    },
    'UnrecognizedError': function() {
        this.emit(':tell', "I'm sorry, I didn't understand the number you gave.",
            SKILL_NAME, "I've encountered an error understanding that number.");
        this.emit('AMAZON.StopIntent');
    },
    'TooBigError': function() {
        this.emit(':tell', "I'm sorry, I can only work with numbers less "
            + "than one million", SKILL_NAME, "Try numbers smaller than one million");
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can ask me for the enth prime number, you can "
            + "ask me whether a number is prime, or, you can say exit... What can I "
            + "help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye');
    }
};

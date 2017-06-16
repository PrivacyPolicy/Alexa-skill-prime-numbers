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

const MAX_N = 10000; // one million
const MAX_PRIME = 104729; // one millionth prime number
const SQRT_MAX_PRIME = 324; // sqrt(one millionth prime number) + 1

var nthPrime = function (n) {
    var m = 0, mark = [];

    mark[1] = true;

    for (var k = 0; k <= SQRT_MAX_PRIME; k = m) {
        for (m = k + 1; m < MAX_PRIME; m++) {
            if (!mark[m]) break;
        }
        for (var i = m * 2; i < MAX_PRIME; i += m) {
            mark[i] = true;
        }
    }

    for (var k = 0, i = 1; i < MAX_PRIME; i++) {
        if (!mark[i]) {
            if (n-- <= 1) {
                return i;
                break;
            }
        }
    }

    return 0; // some kind of error occurred
};

var isPrime = function (number) {
    if (number < 2) return false;
    if (number % 2 == 0) return (number == 2);
    var root = Math.sqrt(number);
    for (var i = 3; i <= root; i += 2) {
        if (number % i == 0) return false;
    }
    return true;
};

var addNth = function (number) {
    var onesPlace = number % 10;
    if (onesPlace == 1) return number + 'st';
    if (onesPlace == 2) return number + 'nd';
    if (onesPlace == 3) return number + 'rd';
    return number + 'th';
};

const ITH_TO_NUM = {
    "first": 1,
    "second": 2,
    "third": 3,
    "fourth": 4,
    "fifth": 5,
    "sixth": 6,
    "seventh": 7,
    "eighth": 8,
    "ninth": 9,
    "tenth": 10,
    "eleventh": 11,
    "twelfth": 12,
    "thirteenth": 13,
    "fourteenth": 14,
    "fifteenth": 15,
    "sixteenth": 16,
    "seventeenth": 17,
    "eighteenth": 18,
    "nineteenth": 19,
    "ith": 0,
    "1st": 1,
    "2nd": 2,
    "3rd": 3,
    "4th": 4,
    "5th": 5,
    "6th": 6,
    "7th": 7,
    "8th": 8,
    "9th": 9,
    "10th": 10,
    "11th": 11,
    "12th": 12,
    "13th": 13,
    "14th": 14,
    "15th": 15,
    "16th": 16,
    "17th": 17,
    "18th": 18,
    "19th": 19,
    "0th": 0
};

var calcNumber = function(slot1, slot2) {
    var n1, n2;
    if (slot2 == null || slot2.value == null) {
        n2 = 0;
    } else {
        try {
            n2 = ITH_TO_NUM[slot2.value];
        } catch (e) {
            n2 = 0;
        }
    }
    try {
        n1 = parseInt(slot1.value);
        if (isNaN(n1)) n1 = 0;
    } catch (e) {
        n1 = 0;
    }
    return n1 + n2;
}

var handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'NthPrimeIntent': function (n) {
        var slots = this.event.request.intent.slots;
        var n = calcNumber(slots.Number_One, slots.Number_Two);
        // this.emit(':tell', '(((' + JSON.stringify(slots) + ', ' + n + ')))');

        if (n == null || n < 1) {
            this.emit('UnrecognizedError');
        } else if (n > MAX_N) {
            this.emit('TooBigError');
        } else {
            this.emit(':tell', 'The ' + addNth(n) + ' prime number is '
                + nthPrime(n) + '.');
        }
    },
    'IsPrimeIntent': function () {
        var n = this.event.request.intent.slots.Number;
        if (n == null || n.value == null) {
            this.emit('UnrecognizedError');
            return;
        }
        var nInt = parseInt(n.value);
        if (isNaN(nInt) || n.value < 1) {
            this.emit('UnrecognizedError');
        } else if (n.value > MAX_PRIME) {
            this.emit('TooBigError');
        } else {
            var prime = isPrime(nInt);
            this.emit(':tell', nInt + ' is ' + (prime ? '' : 'not ')
                + 'a prime number');
        }
        // this.emit(':tell', 'Gabe you\'re not crazy. This is working. :)');
    },
    'UnrecognizedError': function() {
        this.emit(':tell', "I'm sorry, I didn't understand the number you gave.",
            SKILL_NAME, "I've encountered an error understanding that number.");
        this.emit('AMAZON.StopIntent');
    },
    'TooBigError': function() {
        this.emit(':tell', "I'm sorry, I can't work with numbers that big.",
            SKILL_NAME, "Try smaller numbers.");
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can ask me for the enth prime number, you can "
            + "ask me whether a number is prime, or, you can say exit... What can I "
            + "help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can ask how many people are in space, you can ask me to list the people in space, or, you can say exit... What can I help you with?";
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

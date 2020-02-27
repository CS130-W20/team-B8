var ProxySMSMessage = require('./ProxySMSMessage')
var assert = require('assert')

setTimeout(function(){
    // Test 1: Error if there is no from number or to number
    var request1 = {
        sender: '',
        recipients: [],
        message: 'hello world'
    }

    var event1 = {}

    var SMS1 = new ProxySMSMessage(request1, event1);
    assert.throws(function() {SMS1.send()}, Error);
    assert.equal(SMS1.sender, '');
    assert.equal(SMS1.recipients.length, 0);
    assert.equal(SMS1.message, 'hello world');
    assert.equal(SMS1.event, null);

    // Test 2: Removes all the numbers that are not of US Code
    var request2 = {
        sender: '+17205753789',
        recipients: ['+82591456382', '+13103079773', '+82595107867'],
        message: 'hello world'
    }

    var event2 = {}

    var SMS2 = new ProxySMSMessage(request2, event2);
    SMS2.verifyNumbers();
    assert.equal(SMS2.recipients.length, 1);
    assert.equal(SMS2.recipients[0], '+13103079773');
    assert.equal(SMS2.sender, '+17205753789');

    // Test 3: Invalid phone number format
    // Valid US numbers but called from other countries/locally
    var request3 = {
        sender: '+17205753789',
        recipients: ['1915417543010', '001-541-754-3010', '754-3010'], 
        message: 'hello world'
    }

    var event3 = {}

    var SMS3 = new ProxySMSMessage(request3, event3);
    SMS3.verifyNumbers();
    assert.equal(SMS3.recipients.length, 0);
    assert.equal(SMS3.sender, '+17205753789');

    // Test 4: Successfully formats message to designated person with event info
    var request4 = {
        sender: '+17205753789',
        recipients: ['+13103079773'], 
        message: 'hello world'
    }

    var event4 = {
        title: "CS130 Dis1b",
        tag: ["fun", "swe", "A"],
        location: null,
        locationName: "Royce",
        host: "Sean Derman"
    }

    var SMS4 = new ProxySMSMessage(request4, event4);
    SMS4.formatMessage();
    assert.equal(SMS4.message, `You have just received a text on BruinMeet from ${event4.host}, in relation to \
    the event ${event4.title} at ${event4.locationName} during ${event4.date}\r\n\r\n\
    ${request4.message}\r\n\r\n\
    Feel free to type any message below to reply to ${event4.host}`);

    // Test 5: Invalid event context
    var request5 = {
        sender: '+17205753789',
        recipients: ['+13103079773'], 
        message: 'hello world'
    }

    var event5 = {}

    var SMS5 = new ProxySMSMessage(request5, event5);
    assert.throws(function() {SMS5.send()}, Error);
}, 2000);
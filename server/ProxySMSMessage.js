/**
 * @author Phipson Lee
 * @date 02-26-2020
 * 
 * Class object to pass messages using Twilio via a Proxy Design Pattern
 * @see https://www.twilio.com/docs/sms/send-messages
 * @see https://www.twilio.com/docs/chat/tutorials/chat-application-node-express
 */

const TWILIO_SID = 'AC513454963ff517f3e07b90baf8f5d8e1';
const TWILIO_AUTH = 'cb93ae1bbfca766b1f00410a257e06da';
const client = require('twilio')(TWILIO_SID, TWILIO_AUTH);

// Base class that is used to send messages
// Creates a message object based on twilio API but does not verify number or format message
class SMSMessage {
    /**
     * Constructor that is used to generate SMSMessages
     * @param {Object} request Holds twilioSid and twilioToken used for authentication; also contains sender phone no. 
     * and recipient phone no. as well as message
     */
    constructor(request) {
      this.sender = request.sender;
      this.recipients = request.recipients;
      this.message = request.message;
    }

    /**
     * @function send Sends messages to specified recipients with message stored in this.message
     */
    send() {
        try {
          this.recipients.forEach((toNumber) => {
            client.messages
                  .create({
                    body: this.message,
                    from: sender,
                    to: toNumber,
                  })
                  .then(message => {console.log(message.sid)});
          });
        } catch (error) {
          throw Error(error);
        }
    }
}

/**
 * Subclass that extends functionality from SMSMessage
 * Adds phone validation checks and also formats message before sending
 */
class ProxySMSMessage extends SMSMessage {
    /**
     * @function constructor Inherits from SMSMessage to send message but with event-based context
     * @param {Object} request Same as SMSMessage
     * @param {Object} event Contains context about event related to this message
     */
    constructor (request, event) {
      super(request);
      this.event = event;
    }

    /**
     * @function send Uses the Proxy Pattern to verify the phone numbers are valid and send message
     * Also formats message to add context to conversation
     */
    send() {
        try {
            this.verifyNumbers();
            this.formatMessage();
            super.send();
        } catch (error) {
            throw Error(error);
        }
    }

    /**
     * @function verifyNumbers
     * Helper function that is called to verify the numbers to send to are valid
     * Assumes that countryCode of numbers are all US
     * Removes invalid numbers otherwise
     */
    verifyNumbers() {
      try {
        client.lookups.phoneNumbers(this.sender)
                        .fetch({countryCode: 'US'})
                        .then(result => {
                            if (result.phoneNumber == null) {
                                throw Error('Invalid sender number');
                            }
                        })

        for (var i = 0; i < this.recipients.length; i++) {
          client.lookups.phoneNumbers(this.recipients[i])
                        .fetch({countryCode: 'US'})
                        .then(result => {
                          if (result.phoneNumber == null) {
                            this.recipients.splice(i, 1);
                            console.log(this.recipients[i] + " is invalid. Removing...");
                            i--;
                          } 
                        });
        }
      } catch (error) {
        throw Error(error);
      }
    }

    /**
     * @function formatMessage
     * Formats message to give context about the event that this sender is talking about
     */
    formatMessage() {
        try {
            let tempMessage = `You have just received a text on BruinMeet from ${this.event.host}, in relation to \
            the event ${this.event.title} at ${this.event.locationName} during ${this.event.date}\r\n\r\n\
            ${this.message}\r\n\r\n\
            Feel free to type any message below to reply to ${this.event.host}`;

            this.message = tempMessage;
        } catch (error) {
            throw Error(error);
        }
    }
}

module.exports = ProxySMSMessage;
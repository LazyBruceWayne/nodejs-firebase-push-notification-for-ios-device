let FCM = require('fcm-node');
import config from '../config'
var apn = require('apn');
let path = require('path');
let fs = require('fs');

// Set up apn with the APNs Auth Key
let apnProvider = new apn.Provider({
    token: {
        key: fs.readFileSync(path.resolve(__dirname + '/file.p8')),
        keyId: config.keyId, // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
        teamId: config.teamId, // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
    },
    production: true // Set to true if sending a notification to a production iOS app
});


class PushNotification {

    static async sendIos(data) {
        try {
            var note = new apn.Notification();
            note.expiry = Math.floor(Date.now() / 1000) + 7200; // Expires 1 hour from now.
            note.badge = data.badge;
            note.sound = "ping.aiff";
            note.alert = {
                title: data.title,
                body: data.message
            };
            note.topic = config.topic;
            note.mutableContent = 1;
            note.payload = data
            note.aps['content-available'] = 1;

            let deviceToken = data.deviceToken;
            apnProvider.send(note, deviceToken).then((success) => {
                if (success) {
                    console.log("from success", success.failed)
                    return success;
                }
            });

        } catch (err) {
            console.log("Push Notification error- ", err);
            return ({
                message: err,
                status: 0
            });
        }
    }
}
module.exports = PushNotification

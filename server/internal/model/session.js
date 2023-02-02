var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const session = new Schema({
    userId: String,
    token: String,
    rol: String,

})

const Session = mongoose.model("Session", session);

const newSession = (user) => {
    return new Session({
        userId: user._id,
        token:  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        rol: user.rol,
    }).save();
} 

const findSession = (sessionId, token) => {
    return Session.findById({_id: sessionId, token: token}).exec();
}
    
const logout = (sessionId) => {
    return Session.deleteOne({_id: sessionId}).exec();
}

module.exports.newSession = newSession;
module.exports.findSession = findSession;
module.exports.logout = logout;
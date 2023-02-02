var Session = require('../model/session')

const createSession = (userId,token,rol) => {
    //gerar token
    let newUser = new Session({userId: userId, token: token, rol: rol});
    return newUser.save();
}

const findSession = (sessionId) => {
    return Session.findById(sessionId)
    .exec()
}

const deleteSession = (userId) => {
    return Session.deleteOne({_id: userId})
    .exec()
}

module.exports.createSession = createSession;
module.exports.findSession = findSession;
module.exports.deleteSession = deleteSession;
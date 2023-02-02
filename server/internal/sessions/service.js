var Session = require('./repository')

const newSession = (user) => {
    let newUser = new Session({
        userId: user._id,
        token:  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        rol: user.rol,
    
    });
    return newUser.save();
}

const findSession = (sessionId, token) => {
    let session = Session.findById(sessionId);
    return (!!session && session.token === token && session.rol === "user")
}

const findSessionAdmin = (sessionId, token) => {
    let session = Session.findById(sessionId);
    return (!!session && session.token === token && session.rol === "admin")

}

const logout = (sessionId) => {
    return Session.deleteOne({_id: sessionId})
    .exec()
}

module.exports.newSession = newSession;
module.exports.findSession = findSession;
module.exports.findSessionAdmin = findSessionAdmin;
module.exports.logout = logout;
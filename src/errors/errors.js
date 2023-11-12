class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class NotFriends extends CustomError{}
class RegisteredFriend extends CustomError{}

const Errors = {
    NotFriends,
    RegisteredFriend,
};

module.exports = Errors;
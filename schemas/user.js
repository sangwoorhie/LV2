const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nickname : {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.virtual("userId").get(function() {
    return this._id.toHexString() // mongoose에 있는 기본Id를 toHexString함수 사용한다
    // return mongoose.Schema.Types.ObjectId
});

UserSchema.set("toJson", {
    virtual: true //JSON형태로 가공할때 userId를 출력한다
});

module.exports = mongoose.model("User", UserSchema);

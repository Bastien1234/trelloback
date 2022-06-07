const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const checkListSchema = new mongoose.Schema({
    title: String,
    done: Boolean
})

const cardsSchema = new mongoose.Schema({
    cardTitle: String,
    text: String,
    members: [String],
    startDate: String,
    endDate: String,
    checkList: [checkListSchema]
})

const containersSchema = new mongoose.Schema({
    title: String,
    cards: [cardsSchema]
})

const spacesSchema = new mongoose.Schema({
    name: String,
    containers: [containersSchema]
})

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: [true, "please provide an email for this user"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "please provide password"],
        minLength: 8,
        select: false
    },

    confirmPassword: {
        type: String,
        required: [true, "please confirm password"],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not the same!"
        },
        select: false
    },

    spaces: [spacesSchema]

});

userSchema.pre('save', async function(next)
{
    // We are only using this middleware in case that the password field is modified
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    // Don't need the confirm password anymore
    this.confirmPassword = undefined

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword)
{
    return await bcrypt.compare(candidatePassword, userPassword);
}

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
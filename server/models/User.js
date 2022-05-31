const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const bookSchema = require('./book');

const userSchema = new Schema(
    {
        username: {
            type: String, 
            required: true,
            unique: true
        }, 
        email: {
            type: String, 
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        password: {
            type: String,
            required: true
        }, 
        savedBooks: [bookSchema]
    }, 
    {
        toJson: {
            virtuals: true
        }
    }
);

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next(); 
});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.virtual('bookCount').get(function (){
    return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;
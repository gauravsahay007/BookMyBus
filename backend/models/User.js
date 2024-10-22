const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid'); // Ensure you have uuid installed for salt generation

// Define the schema for a User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Username is required
    email: { type: String, required: true, unique: true }, // Email is required and must be unique
    role: { 
        type: String, 
        enum: ['customer', 'coach', 'operations'], // Role must be one of these options
        required: true 
    },
    createdAt: { type: Date, default: Date.now }, // Default to the current date if not provided
    encry_password: {
        type: String,
        required: false
       },
    
       salt: String,
       role: {
        type: Number,
        default: 0
       },
    registeredCentre: {type: mongoose.Schema.Types.ObjectId, ref: 'Centre', default: null }
});

// Custom methods
userSchema.methods = {
    securePassword: function(plainpassword) {
        if (!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt).update(plainpassword).digest('hex');  
        } catch (err) {
            console.error("Error in securePassword:", err);
            return null; // Handle error appropriately
        }
    },
    authenticate: function(plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password;
    }
};

// Creating a virtual field to handle password
userSchema.virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1(); // Generate a unique salt for the user
        this.encry_password = this.securePassword(password); // Encrypt the password
    })
    .get(function() {
        return this._password; // Return the raw password
    });

// Export the User model to be used in other parts of the app
module.exports = mongoose.model('User', userSchema);

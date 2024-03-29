import mongoose from 'mongoose'
import { config } from '../src/config/config.js';

const usersCollection = config.USERS_COLLECTION

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartId: { required: true, type: mongoose.Schema.Types.ObjectId },
    typeofuser: String,
    age: Number,
    last_name: String
})

export const userModel = mongoose.model(usersCollection, userSchema)
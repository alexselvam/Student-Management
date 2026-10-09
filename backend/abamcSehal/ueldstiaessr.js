const mongoose = require('mongoose');
const { Schema } = mongoose;
const { collection_prefix } = require("../config/geosbonosdm");


// ================= STUDENT SCHEMA =================

const StudentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        dob: {
            type: Date,
            default: null
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other", ""],
            default: ""
        },

        studentId: {
            type: String,
            required: true,
            trim: true
        },

        className: {
            type: String,
            required: true,
            trim: true
        },

        section: {
            type: String,
            required: true,
            trim: true
        },

        admissionDate: {
            type: Date,
            default: null
        },

        parentName: {
            type: String,
            trim: true,
            default: ""
        },

        parentPhone: {
            type: String,
            trim: true,
            default: ""
        },

        address: {
            type: String,
            trim: true,
            default: ""
        },

        city: {
            type: String,
            trim: true,
            default: ""
        },

        state: {
            type: String,
            trim: true,
            default: ""
        },

        country: {
            type: String,
            trim: true,
            default: "India"
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        }

    },
    {
        _id: true,
        timestamps: true
    }
);


// ================= USER SCHEMA =================

const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: ""
        },

        surname: {
            type: String,
            trim: true,
            default: ""
        },

        username: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            default: ""
        },

        password: {
            type: String,
            required: true
        },

        students: {
            type: [StudentSchema],
            default: []
        },

        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


module.exports = mongoose.model(
    'users',
    userSchema,
    collection_prefix + 'liarsuesestd'
);
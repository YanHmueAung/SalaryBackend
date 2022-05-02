const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
})


let Employees = mongoose.model('Employee', employeeSchema);

module.exports = Employees;

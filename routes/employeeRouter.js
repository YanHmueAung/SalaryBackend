const express = require("express");
const Employees = require("../models/employee");
const employeeRouter = express.Router();
const multer = require("multer");
const csv = require('fast-csv');
const fs = require('fs');
const upload = multer({dest: '../temporaryCsv/'});

employeeRouter.use(express.json());

employeeRouter.route("/")
    .get((req, res, next) => {
        Employees.find(req.query)
            .then((employees) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(employees);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

employeeRouter.route('/upload')
    .post(upload.single('file'), (req, res, next) => {
        const fileRows = [];
        csv.parseFile(req.file.path)
            .on("data", (data) => {
                fileRows.push(data);
            })
            .on("end", function () {
                fs.unlinkSync(req.file.path);
                const totalRows = fileRows.length;
                const originalList = [];
                const newIdList = [];
                let successCount = 0;
                for (let i = 0; i < totalRows; i++) {
                    const employeeData = {
                        id: fileRows[i][0],
                        login: fileRows[i][1],
                        name: fileRows[i][2],
                        salary: fileRows[i][3],
                    }
                    Employees.findOne({id: employeeData.id})
                        .then((employee) => {
                            if (employee) { // update
                                const original = employee;
                                Employees.findOneAndUpdate({id: employee.id}, employeeData)
                                    .then(() => {
                                        originalList.push(original);
                                        console.log(`id = ${employee.id} is updated`)
                                        successCount = successCount + 1;
                                    })
                                    .catch((e) => {
                                        console.log('Employees.findOneAndUpdate error')
                                        next(e);
                                    })
                            } else { // new entry
                                Employees.create(employeeData)
                                    .then((employee) => {
                                        newIdList.push(employee.id);
                                        console.log(`id = ${employee.id} is inserted`)
                                        successCount = successCount + 1;
                                    })
                                    .catch((e) => {
                                        console.log('Employee.create error')
                                        next(e);
                                    })
                            }
                        })
                        .catch((e) => {
                            console.log('Employees.findOne error')
                            next(e);
                        })
                }

                res.sendStatus(201);
            })
    })

employeeRouter.route("/:id")
    .put((req, res, next) => {
        Employees.findOneAndUpdate({id: req.params.id}, {$set: req.body,}, {new: true})
            .then(() => {
                res.sendStatus(204)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Employees.findOneAndDelete({id: req.params.id})
            .then((data) => {
                if (data) {
                    res.sendStatus(204);
                } else {
                    let err = new Error('id does not exist')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = employeeRouter;

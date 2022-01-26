// '/api/v1/jobs'
const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
   const jobs = await Job.find({ createdBy: req.user.userId }).sort(
      'createdAt'
   );

   res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};
const getJob = async (req, res) => {
   res.send('get job');
};
const createJob = async (req, res) => {
   req.body.createdBy = req.user.userId;
   // console.log(req.body) -> { "company": "google","position": "CEO","createdBy": "61f14841b51bd729d56fe71e"} // ⛵

   // creando un job
   const job = await Job.create(req.body);

   //respuesta a front
   res.status(StatusCodes.CREATED).json({ job }); // 🥊
};
const updateJob = async (req, res) => {
   res.send('update job');
};
const deleteJob = async (req, res) => {
   res.send('delete job');
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };

// 🥊
// {
//    "job": {
//        "status": "pending",
//        "_id": "61f15ac1ab56b532cd9c132f",
//        "company": "google",
//        "position": "CEO",
//        "createdBy": "61f14841b51bd729d56fe71e",
//        "createdAt": "2022-01-26T14:29:21.308Z",
//        "updatedAt": "2022-01-26T14:29:21.308Z",
//        "__v": 0
//    }
// }

// ⛵
// en el middleware de authentication se crea en req.user y ese tiene el id del q se está logeando ( lo saca del JWT )

// ayi
// "email":"turbo@turbo.com","password":"papitopichiruchi"
//emi
//  "name":"Emmita","email":"cachetes@cachetes.com","password":"cachetotes"
// pepi
//   "name":"Pepithor","email":"sully@sully.com","password":"maimlb2006"

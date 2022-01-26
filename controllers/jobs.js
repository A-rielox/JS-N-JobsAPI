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
   // el req debe traer el id del job, q viene como params ( /:id ) y el id del user q viene en el req.user q se genera en la authentication middleware
   const {
      user: { userId },
      params: { id: jobId },
   } = req;

   // si la id está mala => mongoose manda un error, y si está buena pero no hay un job con esa id => se manda mi error de notfound
   const job = await Job.findOne({ _id: jobId, createdBy: userId });

   if (!job) {
      throw new NotFoundError(`No job with id: ${jobId}`);
   }

   res.status(StatusCodes.OK).json({ job });
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

// recordar en las q se pasa el id ( del job )
// router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);
//

// ⛵
// en el middleware de authentication se crea en req.user y ese tiene el id del q se está logeando ( lo saca del JWT )

// ayi
// "email":"turbo@turbo.com","password":"papitopichiruchi"
//emi
//  "name":"Emmita","email":"cachetes@cachetes.com","password":"cachetotes"
// pepi
//   "name":"Pepithor","email":"sully@sully.com","password":"maimlb2006"

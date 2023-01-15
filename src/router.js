const router = require("express").Router();
const { 
    addUsersController, 
    addJobsController, 
    addApplicationController, 
    searchController, 
    viewJobsController, 
    viewApplicationController ,
    downloadController,
} = require('./controllers/jobController')

const { 
    verifyUser 
} = require('./auth/auth')

router.post("/createUser", verifyUser, addUsersController);
router.post("/createJob", verifyUser, addJobsController);
router.post("/createApplication", verifyUser, addApplicationController);
router.post("/search", verifyUser, searchController);
router.get("/viewJobs", verifyUser, viewJobsController);
router.post("/viewApplications", verifyUser, viewApplicationController);
router.get("/download_resume", verifyUser, downloadController);


module.exports = router;
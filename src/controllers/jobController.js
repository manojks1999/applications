const { 
    addUsers, 
    addJobs, 
    addApplications, 
    searchJobs, 
    viewJobs, 
    viewApplication 
} = require('../services/jobServices')


const addUsersController = async (req, res) => {
    try {
        console.log("camerer")
        console.log(req.body)
        const userData = req.body;
        const response = await addUsers(userData);
        console.log("respoeeee", response)
        return res.status(200).json({
            status: true,
            body: "User Created Successfully"
        });
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}

const addJobsController = async (req, res) => {
    try {
        console.log(req.body)
        const userData = req.body;
        const response = await addJobs(userData);
        return res.status(200).json({
            status: true,
            body: response
        });
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}

const addApplicationController = async (req, res) => {
    try {
        console.log(req.body)
        const userData = req;
        const response = await addApplications(userData);
        return res.status(200).json({
            status: true,
            body: response
        });
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}

const searchController = async (req, res) => {
    try {
        console.log(req.body)
        const response = await searchJobs(req);
        return res.status(200).json({
            status: true,
            body: response
        });
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}

const viewJobsController = async (req, res) => {
    try {
        console.log(req.body)
        const response = await viewJobs(req);
        return res.status(200).json({
            status: true,
            body: response
        });
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}


const viewApplicationController = async (req, res) => {
    try {
        const response = await viewApplication(req);
        return res.status(200).json({
            status: true,
            body: response
        });
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}


const downloadController = async (req, res) => {
    try {
        const response = await viewApplication(req);
        if(!response){
            throw new Error('Not found');
        }
        return res.download(response)
    } catch (e) {
        if (e.status) {
            res.status = e.status
        } else {
            res.status = 200
        }
        const errBody = {
            success: false,
            message: e.message,
        }
        res.body = errBody
    }
}

module.exports = {
    addUsersController,
    addJobsController,
    addApplicationController,
    searchController,
    viewJobsController,
    viewApplicationController,
    downloadController,
}
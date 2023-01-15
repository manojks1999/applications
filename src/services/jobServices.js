const User = require("../schema/user.schema");
const jobList = require("../schema/jobList.schema");
const jobApplication = require("../schema/jobApplication.schema");
const bcrypt = require('bcrypt')

const addUsers = async (data) => {
  try {
    let {email, password} = data;
    if(!email && !password){
      throw new Error("Input Error")
    }

    const userData = await findUser(email);
    console.log("camehere", userData)
    if(userData){
      throw new Error("User already present") 
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const resp = await User.create({
      email: email,
      password: hashedPassword
    });

    console.log(resp)
    return resp;
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};

const addJobs = async (data) => {
  try {
    let {title, description, email, skills, experience, createdBy} =  data;
    if(!title && !description && !skills && !experience && !createdBy){
      throw new Error("Invalid Data")
    }

    const resp = await jobList.create({
      title: title,
      description: description,
      email: email,
      skills: skills,
      experience: experience,
      createdBy: createdBy
    });

    console.log(resp)
    return resp;
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};

const addApplications = async (data) => {
  try {
    let fileStatus = await uploadFile(data)
    console.log("fileStatus", fileStatus)
    if(fileStatus.success === false){
      throw new Error("Error in uploading file")
    }

    let {name, email, jobId} = data.body;
    const presentApp = await checkPresentApplication(email, jobId);
    console.log("presentApp", presentApp)
    if(presentApp){
      throw new Error("Already applied")
    }

    const resp = await jobApplication.create({
      name: name,
      jobId: jobId,
      email: email,
      filePath: fileStatus.path
    });

    console.log(resp)
    return resp;
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};

const searchJobs = async (data) => {
  try {
    const limit = data.query.limit * 1 || 10;
    const page = data.query.page * 1 || 1;
    data = data.body;
    console.log(data)
    let count=0;
    let {skills, experience} = data;
    console.log(skills);
    let resp;

    if(skills && experience){
      resp = await jobList.find({ 
        $and: [ {
          'skills': { $in: skills }
          }, {'experience': experience} 
        ] 
      }).skip((page-1) * limit).limit(limit).exec()
      count = await jobList.countDocuments();

    }else if(skills){

      resp = await jobList.find({ 
          'skills': { $in: skills }
      }).skip((page-1) * limit).limit(limit).exec()
      count = await jobList.countDocuments();

    }else if(experience){

      resp = await jobList.find({ 
        'experience': experience
      }).skip((page-1) * limit).limit(limit).exec()
      count = await jobList.countDocuments();

    }else{

      resp = await jobList.find().skip((page-1) * limit).limit(limit).exec()
      count = await jobList.countDocuments();

    }
    console.log(resp)

    return {
      resp,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};

const viewJobs = async (data) => {
  try {
    const limit = data.query.limit * 1 || 10;
    const page = data.query.page * 1 || 1;
    let jobId = data.query.jobId || undefined;
    let count=0;
    console.log(data);
    let resp;
    if(!jobId){
      resp = await jobList.find().skip((page-1) * limit).limit(limit).exec()
      count = await jobList.countDocuments();
    }else{
      resp = await jobList.find({ 
        '_id': jobId
      }).skip((page-1) * limit).limit(limit).exec()
      count = await jobList.countDocuments();
    }
    console.log(resp)
    return {
      resp,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};


const viewApplication = async (data) => {
  try {
    const limit = data.query.limit * 1 || 10;
    const page = data.query.page * 1 || 1;
    data = data.body;
    let count=0;
    console.log(data);
    let {email, jobId} = data;
    let resp;
    if(jobId && email){

    const jobData = await viewJobs(jobId);
    console.log("jobData", jobData)
    if(jobData){
      if(!(jobData[0].email !== email)){
        throw new Error('Not a valid user')
      }
    }
    resp = await jobApplication.find(
        {'jobId': jobId}  
    ).skip((page-1) * limit).limit(limit).exec()
    count = await jobList.countDocuments();
    }
    console.log(resp)
    return {
      resp,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};

const downloadFile = async (data) => {
  try {
    let appId = data.query.applicationId;
    let resp;
    if(appId){
      resp = await jobApplication.find(
          {'jobId': jobId}  
      )
    }
    if(resp.length === 0){
      throw new Error('No file found')
    }
    console.log(resp)
    return resp[0].filePath;
  } catch (error) {
    console.log("error", error.message)
    return { error: error.message };
  }
};



// Supporting Functions


const uploadFile = async (req) => {
  try{
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    if("application/pdf" !== req.files.file.mimetype.toString()){
      return {success: false};
    }
    let uploadPath;
   console.log(req.files.file.mimetype)
    sampleFile = req.files.file;
    uploadPath = __dirname+'/uploads/'+Date.now()+sampleFile.name;
    await sampleFile.mv(uploadPath, function(err) {
      if (err)
        throw new Error()
    });
    return {success: true, path:uploadPath};
  }catch(error){
    return {success: false, error: error.message}
  }
  
}


const checkPresentApplication = async (email, jobId) => {
  try{
    let resp;
    console.log(email, jobId)
    if(email && jobId){
      resp = await jobApplication.find({ 
        $and: [ 
          {'email': email}, 
          {'jobId': jobId} 
        ] 
      });
    }
    console.log(resp)
    if(resp.length === 0){
      throw new Error()
    }
    return true;
  }catch(error){
    return false;
  }
  
}


const findUser = async (email) => {
  let resp;
  console.log(email)
  try{
    if(email){
      resp = await User.find(
          {'email': email});
    }
    console.log(resp)
    if(resp.length === 0){
      throw new Error('User not present')
    }
    console.log(resp[0])
    return resp[1];
  }catch(error){
    return false;
  }
}



module.exports = {
  viewApplication,
  addUsers,
  addJobs,
  addApplications,
  searchJobs,
  viewJobs,
  findUser
}
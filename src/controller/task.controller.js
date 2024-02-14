import asyncHandler from "../utils/asyncHandler.js";
import { Task } from "../models/task.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const newTask = asyncHandler(async(req,res) => {
    //Get the task data from the frontend
    //Validation--> Not empty
    //Create User Object
    //return response

    try {
        const { title, description } = req.body;

        if([title, description].some((field) => field?.trim() === ""))
        {
            throw new ApiError(400, "All Fields are Compulsory");
        }
        const task = await Task.create({title, description , user : req.user});

        return res
            .status(201)
            .json(new ApiResponse(200, task, "Task Created Successfully"));



    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating a new task");
    }

})


const getMyTask = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;

        if(!userId)
        {
            throw new ApiError(404, "User does not exist");
        }

        const task = await Task.find({user : userId});

        if(!task)
        {
            throw new ApiError(404, "Please Enter the Task First");
        }

        return res
            .status(200)
            .json(new ApiResponse(201, task, "Task Fetched Successfully"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Something went wrong while Fetching the tasks");
    }
})

const updateMyTask = asyncHandler(async(req,res) => {
   try {
     const {id} = req.params;
     
     const existedTask = await Task.findById(id);
 
     if(!existedTask) 
     {
         throw new ApiError(404, "Task Does not Exist");
     }
 
     existedTask.isComepleted = !existedTask.isComepleted;
 
     const task =  await existedTask.save();
 
     return res
         .status(200)
         .json(new ApiResponse(201, task, "Task Updated Successfully"));
   } catch (error) {
    throw new ApiError(401, "Error :: ", error);
   }

})

const deleteMyTask = asyncHandler(async(req,res) => {
   try {
     const {id} =req.params;
     const existedTask = Task.findById(id);
     if(!existedTask)
     {
         throw new ApiError(404, "Task Does not Exist");
     }
     
 
     const task = await existedTask.deleteOne(); 
     return res
         .status(200)
         .json(new ApiResponse(201, task, "Task Deleted Successfully"));
   } catch (error) {
    throw new ApiError(401, "Error ::", error);
   }
})

export {newTask,getMyTask,updateMyTask, deleteMyTask}
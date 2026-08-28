const departmentService = require("../services/department.service");
const { sendSuccess } = require("../utils/response");

const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentService.getDepartments();

        sendSuccess(res, departments);
    } catch (error) {
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.createDepartment(req.body);

        sendSuccess(res, department, "Department created successfully");
    } catch (error) {
        next(error);
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.updateDepartment(
                req.params.id,
                req.body
        );

        sendSuccess(res, department, "Department updated successfully");
    } catch (error) {
        next(error);
    }
}

const deleteDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.deleteDepartment(req.params.id);

        sendSuccess(res, department, "Department closed successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
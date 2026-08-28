const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department.controller");
const {
    validateCreateDepartment, validateUpdateDepartment, validateDeleteDepartment
} = require("../validators/department.validator");

router.get("/", departmentController.getDepartments);
router.post(
    "/",
    validateCreateDepartment,
    departmentController.createDepartment
);
router.patch(
    "/:id",
    validateUpdateDepartment,
    departmentController.updateDepartment
);
router.delete(
    "/:id",
    validateDeleteDepartment,
    departmentController.deleteDepartment
);

module.exports = router;
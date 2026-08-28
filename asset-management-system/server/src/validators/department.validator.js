const validStatuses = [0, 1];

const validateCreateDepartment = (req, res, next) => {
    const {
        department_code,
        department_name,
    } = req.body;

    if (!department_code || !department_name) {
        return res.status(400).json({
            message: "Invalid input",
        });
    }

    next();
};

const validateUpdateDepartment = (req, res, next) => {
    const { id } = req.params;
    const {
        department_code,
        department_name,
        status
    } = req.body;

    const departmentId = Number(id);

    if (Number.isNaN(departmentId) || departmentId <= 0) {
        return res.status(400).json({
            message: "Invalid Id",
        });
    }

    if (
        department_code === undefined &&
        department_name === undefined &&
        status === undefined
    ) {
        return res.status(400).json({
            message: "No data to update",
        });
    }

    if (
        status !== undefined &&
        !validStatuses.includes(status)
    ) {
        return res.status(400).json({
            message: "Invalid status",
        });
    }

    next();
};

const validateDeleteDepartment = (req, res, next) => {
    const { id } = req.params;
    const departmentId = Number(id);

    if (Number.isNaN(departmentId) || departmentId <= 0) {
        return res.status(400).json({
            message: "Invalid Id",
        });
    }

    next();
};

module.exports = {
    validateCreateDepartment,
    validateUpdateDepartment,
    validateDeleteDepartment
};
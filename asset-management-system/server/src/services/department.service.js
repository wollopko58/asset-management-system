const departmentRepository = require("../repositories/department.repository");
const AppError = require("../utils/AppError");

const getDepartments = async () => {
    const departments = await departmentRepository.findAll();

    return departments;
};

const createDepartment = async (data) => {
    const existing = await departmentRepository.findByCode(
    data.department_code
);

    if (existing) {
        throw new AppError(
            "Department code already exists",
            409
        );
    }
    
    const id = await departmentRepository.createDepartment(data);

    return {
        id,
        department_code: data.department_code,
        department_name: data.department_name,
    };
}

const updateDepartment = async (id, data) => {

    const department = await departmentRepository.findById(id);

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }

    if (data.department_code !== undefined) {
        const existing =
            await departmentRepository.findByCodeExceptId(
                data.department_code,
                id
            );

        if (existing) {
            throw new AppError(
                "Department code already exists",
                409
            );
        }
    }

    await departmentRepository.updateDepartment(id, data);

    return {
        id: Number(id),
        ...data
    };
};

const deleteDepartment = async (id) => {
    const department = await departmentRepository.findById(id);

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }

    if (department.status === 0) {
        throw new AppError(
            "Department already closed",
            409
        );
    }
    
    await departmentRepository.deleteDepartment(id);

    return {
        id: Number(id)
    };
}

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
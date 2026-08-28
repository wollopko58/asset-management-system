const repairsHistoryRepository = require("../repositories/repairs_history.repository");
const assetManagementRepository = require("../repositories/asset_management.repository");
const AppError = require("../utils/AppError");

const getRepairsHistory = async () => {
  const repairsHistory = await repairsHistoryRepository.findAll();

  return repairsHistory;
};

const createRepairsHistory = async (data) => {
  const existingAsset = await assetManagementRepository.findById(data.asset_id);

  if (!existingAsset) {
    throw new AppError("Asset id not found", 404);
  }

  const existingTicket = await repairsHistoryRepository.findByTicketNo(
    data.ticket_no,
  );

  if (existingTicket) {
    throw new AppError("Ticket no already existing", 409);
  }

  const id = await repairsHistoryRepository.createRepairsHistory(data);

  return {
    id,
    asset_id: data.asset_id,
    ticket_no: data.ticket_no,
    description: data.description,
    status: data.status,
  };
};

const updateRepairsHistory = async (id, data) => {
  const repairsHistory = await repairsHistoryRepository.findById(id);

  if (!repairsHistory) {
    throw new AppError("Repairs History not found", 404);
  }

  if (data.asset_id !== undefined) {
    const existingAsset = await assetManagementRepository.findById(
      data.asset_id,
    );

    if (!existingAsset) {
      throw new AppError("Asset Management not found", 404);
    }
  }

  if (data.ticket_no !== undefined) {
    const existingTicket = await repairsHistoryRepository.findByTicketExceptId(
      data.ticket_no,
      id,
    );

    if (existingTicket) {
      throw new AppError("Ticket no already existing", 409);
    }
  }

  await repairsHistoryRepository.updateRepairsHistory(id, data);

  return {
    id: Number(id),
    ...data,
  };
};

const deleteRepairsHistory = async (id) => {
  const existing = await repairsHistoryRepository.findById(id);

  if (!existing) {
    throw new AppError("Repairs History not found", 404);
  }

  if (existing.status === "CANCELLED") {
    throw new AppError("Repairs History already cancelled", 409);
  }

  await repairsHistoryRepository.deleteRepairsHistory(id);

  return {
    id: Number(id),
  };
};

module.exports = {
  getRepairsHistory,
  createRepairsHistory,
  updateRepairsHistory,
  deleteRepairsHistory,
};

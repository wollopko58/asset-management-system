const express = require("express");
const router = express.Router();
const repairsHistoryController = require("../controllers/repairs_history.controller");
const {
  validateCreateRepairsHistory,
  validateUpdateRepairsHistory,
  validateDeleteRepairsHistory,
} = require("../validators/repairs_history.validator");

router.get("/", repairsHistoryController.getRepairsHistory);
router.post(
  "/",
  validateCreateRepairsHistory,
  repairsHistoryController.createRepairsHistory,
);
router.patch(
  "/:id",
  validateUpdateRepairsHistory,
  repairsHistoryController.updateRepairsHistory,
);
router.delete(
  "/:id",
  validateDeleteRepairsHistory,
  repairsHistoryController.deleteRepairsHistory,
);

module.exports = router;

const approvalRequestService = require("../service/approvalRequestService");

// Get all approval requests
const getAll = async (req, res) => {
  try {
    const list = await approvalRequestService.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get requests by user ID
const getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const list = await approvalRequestService.getByUser(user_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get requests by session ID
const getbysession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const list = await approvalRequestService.getbysession(session_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Get requests by department ID
const getByDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;
    const list = await approvalRequestService.getByDepartment(department_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create new request
const create = async (req, res) => {
  try {
    const request = await approvalRequestService.create(req.body);
    res.status(201).json({ request });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update request by ID
const update = async (req, res) => {
  try {
    const updated = await approvalRequestService.update(req.body);
    res.status(200).json({ request: updated });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete request by ID
const remove = async (req, res) => {
  try {
    const { request_id } = req.params;
    const success = await approvalRequestService.remove(request_id);
    res.status(200).json({ success });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getByUser,
  getByDepartment,
  getbysession,
  create,
  update,
  remove
};

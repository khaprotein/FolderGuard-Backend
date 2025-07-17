const approvalSessionService = require("../service/ApprovalSessionService");
const userDepartmentService = require("../service/userDepartmentService");
const userService = require("../service/userService");
const mailService = require("../service/mailService");

const getAll = async (req, res) => {
  try {

    const list = await approvalSessionService.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};


const getDraft = async (req, res) => {
  try {

    const { created_by, department_id, session_type } = req.query
    const session = await approvalSessionService.getDraft(created_by, department_id, session_type);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const session = await approvalSessionService.create(req.body);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const session = await approvalSessionService.getById(req.params.session_id);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getbycompany = async (req, res) => {
  try {
    const list = await approvalSessionService.getbycompany(req.params.company_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getbydept = async (req, res) => {
  try {
    const session = await approvalSessionService.getbydept(req.params.department_id);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const session = await approvalSessionService.update(req.body);

    // Always send response first (non-blocking email)
    res.status(200).json({ session });

    if (session.status === 'PENDING') {
      const owner = await userDepartmentService.getOwner(session.department_id);
      const createdBy = await userService.findUserById(session.created_by);

      if (owner && owner.User.email) {
        const subject = `Approval Session #${session.session_id} is now PENDING`;
        const text = `
Hello ${owner.User.full_name},

Approval session #${session.session_id} in your department has been updated to status: PENDING by ${createdBy.full_name} (PUID: ${createdBy.puid}).

You can review the session details at:
http://localhost:5000

Best regards,  
Demo System Team
`;

        try {
          await mailService.sendMail(owner.User.email, subject, text);
          console.log(`Email sent to owner ${owner.User.email} for session #${session.session_id} (PENDING)`);
        } catch (err) {
          console.error(`Failed to send email to ${owner.User.email}:`, err);
        }
      } else {
        console.warn(`No valid email found for owner of department ${session.department_id}`);
      }

    } else if (session.status === 'APPROVED') {
      if (session.approved_by !== session.created_by) {
        const createdBy = await userService.findUserById(session.created_by);
        if (createdBy && createdBy.email) {
          const subject = `Approval Session #${session.session_id} has been APPROVED`;
          const text = `
Hello ${createdBy.full_name},

Your session #${session.session_id} has been approved.

Please review the details at:
http://localhost:5000

Best regards,  
Demo System Team
`;

          try {
            await mailService.sendMail(createdBy.email, subject, text);
            console.log(`Email sent to creator ${createdBy.email} for session #${session.session_id} (APPROVED)`);
          } catch (err) {
            console.error(`Failed to send email to ${createdBy.email}:`, err);
          }
        } else {
          console.warn(`No valid email found for created_by user ${session.created_by}`);
        }
      }
    } else if (session.status === 'DONE') {
      const owner = await userDepartmentService.getOwner(session.department_id);

      if (owner && owner.User.email) {
        const subject = `Approval Session #${session.session_id} is DONE`;
        const text = `
Hello ${owner.User.full_name},

Approval session #${session.session_id} for your department has been completed successfully.

You can view the session details at:
http://localhost:5000

Best regards,  
Demo System Team
`;

        try {
          await mailService.sendMail(owner.User.email, subject, text);
          console.log(`Email sent to owner ${owner.User.email} for session #${session.session_id} (DONE)`);
        } catch (err) {
          console.error(`Failed to send email to ${owner.User.email}:`, err);
        }
      } else {
        console.warn(`No valid email found for owner of department ${session.department_id}`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
};



const deleteSession = async (req, res) => {
  try {
    await approvalSessionService.deleteSession(req.params.session_id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  getDraft,
  getbydept,
  getbycompany,
  create,
  update,
  deleteSession

};

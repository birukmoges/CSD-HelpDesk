
const Workflow = require('../models/issueModel');


// const workflowController = {
//   getAllWorkflows: async (req, res) => {
//     try {
//       //const workflows = await Workflow.find({});
//       const workflows = "already solved !"
//       // Set the content type explicitly to application/json (though res.json() does this by default)
//       res.setHeader('Content-Type', 'application/json');
//       // Send the JSON response with the workflows array
//       res.send(JSON.stringify({ workflows }));
//     } catch (err) {
//       // Handle any errors
//       res.status(500).json({ message: "Internal Server Error; Try Again :(" });
//     }
//   },
//   getWorkflow: async (req, res) => {
//     let { issueName } = req.params; // Extracting issueName from route parameters
//     issueName = issueName.charAt(0).toUpperCase() + issueName.slice(1).toLowerCase(); // Convert to Proper Case
    
//     try {
//       const workflow = await Workflow.findOne({ Issue: issueName }); // Querying the database
      
//       if (!workflow) {
//         return res.status(404).json({ message: 'Solutions not found' });
//       }
      
//       const customWorkflow = workflow.Custom_Workflow;
//       res.json({ Custom_Workflow: customWorkflow });
//     } catch (err) {
//       res.status(500).json({ message: "Internal Server Error; Try Again :(" });
//     }
//   },
  
  

// createWorkflow: async (req, res) => {
//   const { Issue, Custom_Workflow, Sub_Issue_Type } = req.body;
//   try {
//     const workflow = await Workflow.create({ Issue, Custom_Workflow, Sub_Issue_Type });
//     res.status(201).json({ workflow });
//   } catch (err) {
//     console.error("Error creating workflow:", err); // Log the error details for debugging
//     res.status(500).json({ message: "Internal Server Error; Try Again" });
//   }

// },
// deleteWorkflow: async (req, res) => {
//   const { issuesid } = req.params; // Use req.params to get the ID from the route parameter
//   try {
//     const deleted = await Workflow.deleteOne({ _id: issuesid }); // Use _id to match the ObjectId
//     if (deleted.deletedCount === 0) {
//       return res.status(404).json({ message: 'Workflow not found' });
//     }
//     res.status(200).json({ message: 'Workflow deleted successfully' });
//   } catch (err) {
//     console.error("Error deleting workflow:", err); // Log the error details for debugging
//     res.status(500).json({ message: "Internal Server Error; Try Again" });
//   }
// },
// };

// module.exports = workflowController;

const workflowController = {
  getAllWorkflows: async (req, res) => {
    try {
      // Replace database call with static workflows
      const workflows = [
        { Issue: "Network Issue", Custom_Workflow: "Check cables, Restart router, Contact ISP" },
        { Issue: "Software Bug", Custom_Workflow: "Reproduce bug, Check logs, Escalate to developer" },
        { Issue: "Hardware Failure", Custom_Workflow: "Check warranty, Replace hardware, Document issue" }
      ];

      // Set the content type explicitly to application/json (though res.json() does this by default)
      res.setHeader('Content-Type', 'application/json');
      // Send the JSON response with the workflows array
      res.send(JSON.stringify({ workflows }));
    } catch (err) {
      // Handle any errors
      res.status(500).json({ message: "Internal Server Error; Try Again :(" });
    }
  },

  getWorkflow: async (req, res) => {
    let { issueName } = req.params; // Extracting issueName from route parameters
    issueName = issueName.charAt(0).toUpperCase() + issueName.slice(1).toLowerCase(); // Convert to Proper Case

    try {
      // Static workflows as a replacement for the database
      const workflows = [
        { Issue: "Network Issue", Custom_Workflow: "Check cables, Restart router, Contact ISP" },
        { Issue: "Software Bug", Custom_Workflow: "Reproduce bug, Check logs, Escalate to developer" },
        { Issue: "Hardware Failure", Custom_Workflow: "Check warranty, Replace hardware, Document issue" }
      ];

      // Find the matching workflow
      const workflow = workflows.find(w => w.Issue === issueName);

      if (!workflow) {
        return res.status(404).json({ message: 'Solutions not found' });
      }

      const customWorkflow = workflow.Custom_Workflow;
      res.json({ Custom_Workflow: customWorkflow });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error; Try Again :(" });
    }
  },

  createWorkflow: async (req, res) => {
    res.status(403).json({ message: "Creating workflows is disabled in manual mode." });
  },

  deleteWorkflow: async (req, res) => {
    res.status(403).json({ message: "Deleting workflows is disabled in manual mode." });
  },
};

module.exports = workflowController;

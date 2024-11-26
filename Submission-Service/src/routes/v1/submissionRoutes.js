const {
  createSubmission,
} = require("../../../src/controllers/submissionController");

async function submissionRoutes(fastify, options) {
  fastify.post("/", createSubmission);
}

module.exports = submissionRoutes;

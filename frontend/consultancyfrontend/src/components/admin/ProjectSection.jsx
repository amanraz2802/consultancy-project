import React, { useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";

const ProjectSection = () => {
  const [projectId, setProjectId] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { token } = useSelector((state) => state.auth);
  // Mock data for projects
  const [projects, setProjects] = useState([]);
  //     {
  //       id: "PROJ-2023-089",
  //       title: "Solar Panel Installation",
  //       pi: "Dr. Patel",
  //       department: "Electrical Engineering",
  //       status: "Active",
  //       startDate: "2023-08-15",
  //       endDate: "2024-02-15",
  //       budget: "₹ 12,50,000",
  //       currentStage: "Work Order",
  //     },
  //     {
  //       id: "PROJ-2023-092",
  //       title: "Water Treatment Plant",
  //       pi: "Dr. Sharma",
  //       department: "Civil Engineering",
  //       status: "Active",
  //       startDate: "2023-09-01",
  //       endDate: "2024-03-01",
  //       budget: "₹ 18,75,000",
  //       currentStage: "Bill of Supply",
  //     },
  //     {
  //       id: "PROJ-2023-078",
  //       title: "Smart Classroom Implementation",
  //       pi: "Dr. Mehta",
  //       department: "Computer Science",
  //       status: "On Hold",
  //       startDate: "2023-07-01",
  //       endDate: "2024-01-01",
  //       budget: "₹ 8,25,000",
  //       currentStage: "Consent Form",
  //     },
  //     {
  //       id: "PROJ-2023-085",
  //       title: "Laboratory Equipment",
  //       pi: "Dr. Singh",
  //       department: "Mechanical Engineering",
  //       status: "Active",
  //       startDate: "2023-08-01",
  //       endDate: "2023-12-31",
  //       budget: "₹ 9,85,000",
  //       currentStage: "Payment Details",
  //     },
  //     {
  //       id: "PROJ-2023-081",
  //       title: "Campus Network Upgrade",
  //       pi: "Dr. Kumar",
  //       department: "Electronics & Communication",
  //       status: "Completed",
  //       startDate: "2023-06-15",
  //       endDate: "2023-10-15",
  //       budget: "₹ 15,40,000",
  //       currentStage: "Closure Form",
  //     },
  //   ]);

  const filteredProjects = showAllProjects
    ? projects
    : projects.filter((project) =>
        project.id.toLowerCase().includes(projectId.toLowerCase())
      );

  const handleSearch = (e) => {
    e.preventDefault();
    setShowAllProjects(false);
  };

  async function handleViewAll() {
    setProjectId("");
    setShowAllProjects(true);
    const response = await apiConnector(
      "GET",
      "/admin/projects",
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(response);
    setProjects(response.data.data);
  }

  const handleProjectReject = (project) => {
    setSelectedProject(project);
    setShowConfirmDialog(true);
  };

  const confirmReject = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `/admin/${selectedProject.projectId}/reject`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(response);
      setShowConfirmDialog(false);
    } catch (err) {
      console.log(err);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 md:items-center"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Project ID"
                className="w-full md:w-64 pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FaSearch />
              </button>
            </div>
            <button
              type="button"
              onClick={handleViewAll}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View All
            </button>
          </form>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Project ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">PI</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Current Stage</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{project.projectId}</td>
                    <td className="py-3 px-4">{project.title}</td>
                    <td className="py-3 px-4">{project.createdBy}</td>
                    <td className="py-3 px-4">{project.dept}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.status.toLowerCase() == "accepted"
                            ? "bg-green-100 text-green-800"
                            : project.status.toLowerCase() == "ongoing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{project.latestForm}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title="Reject Project"
                          onClick={() => handleProjectReject(project)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500">
              No projects found for the specified Project ID. Try a different ID
              or view all projects.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Confirm Project Rejection
            </h3>

            <p className="mb-6">
              Are you sure you want to reject the project{" "}
              <strong>
                {selectedProject.id}: {selectedProject.title}
              </strong>
              ? This action will reject the project from the system and cannot
              be undone.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmReject}
              >
                Reject Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSection;

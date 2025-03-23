import React, { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ComplaintForm = () => {
  // Sample project data that would normally come from user's previous projects
  const [projects, setProjects] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchProject() {
      const response = await apiConnector(
        "GET",
        "/user/projects",
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setProjects(response.data.data);
      console.log(response);
    }
    fetchProject();
  }, []);
  const [formData, setFormData] = useState({
    projectId: "",
    subject: "",
    body: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Would normally send data to backend
    try {
      const response = await apiConnector("POST", "/user/complain", formData, {
        Authorization: `Bearer ${token}`,
      });
      if (response) {
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(err, "In submitting complaint form");
    }

    // Reset form
    setFormData({
      projectId: "",
      subject: "",
      body: "",
    });
  };

  return (
    <div className="w-full bg-gray-100 pt-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[50%] h-[50%] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#4345af] px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            Submit Complaint to Admin
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div>
            <label
              htmlFor="projectId"
              className="block text-sm font-medium text-gray-700"
            >
              Project
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.title} ({project.projectId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of your issue"
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700"
            >
              Complaint Details
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide details about your complaint..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4345af] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;

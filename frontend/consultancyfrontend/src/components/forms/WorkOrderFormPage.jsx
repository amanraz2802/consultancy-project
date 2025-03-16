import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const WorkOrderFormPage = () => {
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);

  // Manage form data using useState
  const [formData, setFormData] = useState({
    description: "",
    estimatedCost: "",
    file: null,
    projectId: projectId,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Handle file upload separately
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0], // Store the file object
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      formData.projectId,
      formData.description,
      formData.estimatedCost,
      formData.file
    );
    // Send data to backend
    try {
      const response = await apiConnector(
        "POST",
        "/form/workForm",
        {
          projectId: formData.projectId.toString(),
          description: formData.description.toString(),
          estimatedCost: formData.estimatedCost.toString(),
          path: formData.file ? formData.file.name : "", // Send file name
        },
        { draft: "false", Authorization: `Bearer ${token}` }
      );
      toast.success(response.data.message);
      setFormData({
        description: "",
        estimatedCost: "",
        file: null,
        projectId: projectId,
      });
      // const result = await response.json();
      // console.log("Work document created successfully", result);
    } catch (error) {
      toast.error(error.response.data.error);
      // console.log(error.response);
      console.error("Error creating work document:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Work Order Form</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Project ID
              </label>
              <input
                value={formData.projectId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Estimated Cost (₹)
              </label>
              <input
                name="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                min={0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Upload Work Order
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-blue-50 file:text-cyan-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 transition duration-150 ease-in-out font-semibold text-lg"
            >
              Submit Work Order
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default WorkOrderFormPage;

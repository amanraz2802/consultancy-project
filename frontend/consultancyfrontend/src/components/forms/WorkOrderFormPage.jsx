import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";
const WorkOrderFormPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  // Manage form data using useState
  const [formData, setFormData] = useState({
    description: "",
    estimatedCost: "",
    file: null,
    projectId: projectId,
    path: "",
  });

  //to upload files on cloudinary

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

    if (!formData.file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setLoading(true);
    const fileFormData = new FormData();
    fileFormData.append("file", formData.file);
    fileFormData.append("resource_type", "raw");
    fileFormData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    fileFormData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER); // Optional: specify folder

    try {
      // Upload file to Cloudinary
      const fileResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/raw/upload`,
        {
          method: "POST",
          body: fileFormData,
        }
      );

      const fileData = await fileResponse.json();
      console.log("Cloudinary Response:", fileData);

      if (fileData.secure_url) {
        toast.success("File uploaded successfully!");

        // Update formData with the Cloudinary file URL
        const updatedFormData = {
          ...formData,
          path: fileData.secure_url, // Attach secure URL
        };

        // Send the updated formData to the backend
        const response = await apiConnector(
          "POST",
          "/form/workForm",
          {
            projectId: updatedFormData.projectId.toString(),
            description: updatedFormData.description.toString(),
            estimatedCost: updatedFormData.estimatedCost.toString(),
            path: updatedFormData.path, // Send secure URL
          },
          { draft: "false", Authorization: `Bearer ${token}` }
        );

        navigate("/work-order");
        toast.success(response.data.message);

        // Reset form fields
        setFormData({
          description: "",
          estimatedCost: "",
          file: null,
          projectId: projectId,
          path: "",
        });
      }
      // else {
      //   toast.error("Upload failed.");
      // }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
      toast.error("File upload failed.");
    }
  };
  if (loading) {
    return <Spinner text={"Submitting form..."} />;
  }
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

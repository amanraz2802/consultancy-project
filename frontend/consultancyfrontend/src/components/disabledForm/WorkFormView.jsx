import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Spinner from "../spinner/Spinner";

const WorkFormView = () => {
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  // Manage form data using useState
  const [formData, setFormData] = useState({
    description: "",
    estimatedCost: "",
    file: null,
    projectId: projectId,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(projectId);
        const response = await apiConnector(
          "GET",
          `form/workForm/${projectId}`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log("in work order view", response);

        // Directly set data
        // setData(response.data.data);
        setFormData({
          description: response.data.data.description,
          estimatedCost: response.data.data.estimatedCost,
          file: response.data.data.path,
          projectId: projectId,
        });
        console.log("Form Data: ", formData);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [projectId, token]);

  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#34357c] to-[#1f205b] px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Work Order Form</h2>
          </div>
          <form className="p-6 space-y-6">
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
                // onChange={handleChange}
                disabled
                rows={5}
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
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="flex gap-5 ">
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Attached Work Order
              </label>
              <Link to={formData.path} className="text-blue-500 font-semibold">
                link
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default WorkFormView;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";

const WorkOrderView = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  //   const [expandedRows, setExpandedRows] = useState(new Set());

  //   const toggleRow = (projectID) => {
  //     const newExpandedRows = new Set(expandedRows);
  //     if (newExpandedRows.has(projectID)) {
  //       newExpandedRows.delete(projectID);
  //     } else {
  //       newExpandedRows.add(projectID);
  //     }
  //     setExpandedRows(newExpandedRows);
  //   };
  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const response = await apiConnector(
          "GET",
          "/form/getProjects/work",
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setData(response.data.data || []);
        console.log(response.data.data);
      } catch (err) {
        console.error("Error in fetching consent forms:", err);
        setData([]);
      }
    };

    fetchAllForms();
  }, []);

  // return (
  //   <div className="w-full max-w-6xl mx-auto p-4 mt-4 ">
  //     <div className="bg-white rounded-lg shadow overflow-hidden">
  //       <table className="w-full">
  //         <thead className="bg-gray-100">
  //           <tr>
  //             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
  //               Project ID
  //             </th>
  //             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
  //               Project Name
  //             </th>
  //             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
  //               {" "}
  //             </th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {data.map((project) => (
  //             <React.Fragment key={project.id}>
  //               {/* make changes */}
  //               <tr
  //                 className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
  //                 onClick={() => navigate(`/create/work-order/${project.id}`)}
  //               >
  //                 <td className="px-4 py-3 text-sm font-medium text-gray-700">
  //                   {project.id}
  //                 </td>
  //                 <td className="px-4 py-3 text-sm text-gray-700">
  //                   {project.title}
  //                 </td>
  //                 {project.workStatus === -1 ? (
  //                   <td className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
  //                     Create Workorder
  //                   </td>
  //                 ) : (
  //                   <>
  //                     <td className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
  //                       View Workorder
  //                     </td>
  //                     <td className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
  //                       View Project
  //                     </td>
  //                   </>
  //                 )}
  //               </tr>
  //             </React.Fragment>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
  return (
    <div className="w-9/12 max-w-6xl mx-auto p-4 mt-4">
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Project ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Project Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((project) => (
                <tr
                  key={project.projectID}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-all"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {project.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {project.title}
                  </td>
                  <td className="px-4 py-3">
                    {/* Conditional Button */}
                    {project.workStatus === -1 ? (
                      <td
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg "
                        onClick={() =>
                          navigate(`/create/work-order/${project.id}`)
                        }
                      >
                        Create Workorder
                      </td>
                    ) : (
                      <div className="flex gap-4">
                        <td
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold  rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                          onClick={() =>
                            navigate(`/view/work-order/${project.id}`)
                          }
                        >
                          View Workorder
                        </td>
                        <td
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                          onClick={() => navigate("/view/project/18")}
                        >
                          View Project
                        </td>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-4 text-sm"
                >
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkOrderView;

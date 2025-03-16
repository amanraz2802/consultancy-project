import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const WorkOrderView = () => {
  const { token } = useSelector((state) => state.auth);
  const { formname, projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  //consent, work, bill,closure, voucher, payment
  const formtype = {
    consentForm: {
      name: "consent-form",
      check: 0,
      btn0: "Complete Draft",
      link: "/create/consent-form/",
      prefix: "consult",
    },
    workOrder: {
      name: "work-order",
      check: -1,
      btn0: "Create Workorder",
      link: "/create/work-order",
      prefix: "work",
    },
    billOfSupply: {
      check: -1,
      name: "bill-supply",
      btn0: "Create Bill",
      link: "/create/bill-supply",
      prefix: "bill",
      //bill
    },
    checkDeposit: {
      name: "payment",
      check: -1,
      btn0: "Create CheckDeposit",
      link: "/create/check-deposit",
      prefix: "payment",
    },
    closureReport: {
      name: "closure",
      check: -1,
      btn0: "Create Closure",
      link: "/create/closure-report",
      prefix: "closure",
    },
    finalLetter: {
      check: -1,
      btn0: "Create FinalLetter",
      link: "/create/final-letter",
    },
    voucher: {
      name: "voucher",
      check: -1,
      btn0: "Create Voucher",
      link: "/create/voucher",
      prefix: "voucher",
    },
  };
  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `/form/getProjects/${formtype[formname].prefix}`,
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
                    {project.workStatus === `${formtype[formname].check}` ? (
                      <td
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg "
                        onClick={() =>
                          navigate(
                            `/create/${formtype[formname].link}/${project.id}`
                          )
                        }
                      >
                        {formtype[formname].btn0}
                      </td>
                    ) : (
                      <div className="flex gap-4">
                        <td
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold  rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                          onClick={() =>
                            navigate(
                              `/view/${formtype[formname].name}/${project.id}`
                            )
                          }
                        >
                          View {formtype[formname].name}
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
                  No projects available. yhaha pe hu
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

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../spinner/Spinner";

const ConsultancyProjectRegistrationForm = ({ view }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { token, email } = useSelector((state) => state.auth);
  console.log("email=", email);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const date = new Date();
  const { formId } = useParams();
  const [data, setData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: date.toISOString().split("T")[0],
    principalFacultyName: email,
    associatedFacultyNames: [],
    consultancyTitle: "",
    firmName: "",
    firmEmail: "",
    firmPhone: "",
    assignmentTypes: "",
    natureOfWork: "",
    estimatedDuration: "",
    outOfCampusVisits: "",
    commencementDate: "",
    totalAmount: 0,
    workOrderNo: "",
    estimateLetterNo: "",
    proposedLetterNo: "",
  });

  {
    projectId &&
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await apiConnector(
              "GET",
              `form/consentForm/${projectId}`,
              {},
              {
                Authorization: `Bearer ${token}`,
              }
            );
            console.log(response);
            setData(response.data.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        if (projectId) {
          fetchData();
        }
      }, [projectId]);
  }

  // Update formData whenever data changes
  useEffect(() => {
    if (data) {
      setFormData({
        projectNo: data.projectId || "",
        date: date.toISOString().split("T")[0],
        principalFacultyName: email,
        associatedFacultyNames: data.associatedFacultyNames || [],
        consultancyTitle: data.consultancyTitle || "",
        firmName: data.firmName || "",
        firmEmail: data.firmEmail || "",
        firmPhone: data.firmPhone || "",
        assignmentTypes: data.assignmentTypes || "",
        natureOfWork: data.natureOfWork || "",
        estimatedDuration: data.estimatedDuration || "",
        outOfCampusVisits: data.outOfCampusVisits || "",
        commencementDate: data.commencementDate || "",
        totalAmount: data.totalAmount || "",
        workOrderNo: data.workOrderNo || "",
        estimateLetterNo: data.estimateLetterNo || "",
        proposedLetterNo: data.proposedLetterNo || "",
      });
    }
  }, [data]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the form?"
    );

    if (confirmSubmit) {
      const form = {
        ...formData,
        assignmentTypes: selectedOption,

        // to: "hod@svnit.ac.in",
      };
      console.log(form);
      setLoading(true);
      try {
        console.log(form, "consent form data");
        const response = await apiConnector(
          "POST",
          "/form/consentForm",
          JSON.stringify(form),
          { draft: "false", Authorization: `Bearer ${token}` }
        );
        console.log(response);
        if (response.status === 200) toast.success("Submitted successfully");
        // if (!response.ok) {
        //   return toast.error(`HTTP error! Status: ${response.status}`);
        // }

        // const result = await response.json();
        // console.log("Success:", result);
        // handleDownloadPDF(formData);
        // Reset the form data
        setFormData({
          projectNo: "",
          date: date.toISOString().split("T")[0],
          principalFacultyName: "",
          associatedFacultyNames: "",
          consultancyTitle: "",
          firmName: "",
          firmEmail: "",
          firmPhone: "",
          assignmentTypes: "",
          natureOfWork: "",
          estimatedDuration: "",
          outOfCampusVisits: "",
          commencementDate: "",
          totalAmount: "",
          workOrderNo: "",
          estimateLetterNo: "",
          proposedLetterNo: "",
        });
        setLoading(false);
        navigate("/home");
        // alert("Form submitted successfully!");
      } catch (err) {
        setLoading(false);
        console.log("error in consultancy registration", err);
      }
    }
  };
  const handleDraft = async (event) => {
    event.preventDefault();

    const confirmDraft = window.confirm(
      "Are you sure you want to save this as a draft?"
    );

    if (confirmDraft) {
      const draftForm = {
        ...formData,
        assignmentTypes: selectedOption,
      };
      console.log(draftForm);
      setLoading(true);
      try {
        const response = await apiConnector(
          "POST",
          "/form/consentForm",
          JSON.stringify(draftForm),
          { draft: "true", Authorization: `Bearer ${token}` }
        );
        console.log(response);
        // if (!response.ok) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        // const result = await response.json();
        // console.log(result);
        // console.log("Draft saved successfully:", result);

        toast.success("Draft saved successfully!");
        setFormData({
          projectNo: "",
          date: date.toISOString().split("T")[0],
          principalFacultyName: "",
          associatedFacultyNames: "",
          consultancyTitle: "",
          firmName: "",
          firmEmail: "",
          firmPhone: "",
          assignmentTypes: "",
          natureOfWork: "",
          estimatedDuration: "",
          outOfCampusVisits: "",
          commencementDate: "",
          totalAmount: "",
          workOrderNo: "",
          estimateLetterNo: "",
          proposedLetterNo: "",
        });
        setLoading(false);
        navigate("/home");
      } catch (error) {
        console.error("Error saving draft:", error.response);
        setLoading(false);
        alert("There was an error saving the draft. Please try again.");
      }
    }
  };
  if (loading) {
    return <Spinner text="Submitting form..." />;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* <div className="bg-white border-8 border-[#efefef] font-extrabold rounded-3xl p-6  text-3xl font-poppins ">
        Consent Form
      </div> */}
      <header className="max-w-6xl mx-auto p-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
              alt="SVNIT Logo"
              className="h-20 w-28 scale-150"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-center mb-2 mx-16">
                Sardar Vallabhbhai National Institute of Technology Surat -
                395007 (GUJARAT)
              </h1>
              <h3 className="text-xl font-semibold text-center mb-1">
                Office of the Dean Research & Consultancy
              </h3>
              <h3 className="text-xl font-semibold text-center mb-4">
                Form-CP-1.1-Form for Consultancy Project Registration
              </h3>
            </div>
          </div>
          <div className="text-5xl font-bold transform -rotate-90 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            SVNIT
          </div>
        </div>
        <p className="text-sm text-center italic mt-2">
          (To be filled in by the Faculty Member assigned to undertake the
          consultancy work, for onwards submission through the HOD)
        </p>
      </header>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="text-gray-800 font-semibold text-base mb-4 flex justify-between">
          <span>
            <span>ProjectId: </span>

            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-40 mx-2"
              placeholder="Autogenerated*"
              name="projectNo"
              value={formData.projectNo}
              onChange={handleInputChange}
              disabled
            />
            {/* <span>/</span>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-14 mx-2"
              min="0"
              max="99"
              placeholder="24"
              name="year1"
              value={formData.year1}
              onChange={handleInputChange}
            />
            <span>-</span>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-14 mx-2"
              min="0"
              max="99"
              name="year2"
              value={formData.year2}
              onChange={handleInputChange}
              placeholder="25"
            /> */}
          </span>
          <span>
            <span className="ml-20"> Date: </span>
            <input
              type="text"
              name="date"
              // value={formData.date}
              value={formatDate(new Date())}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1 w-32 "
              placeholder="dd/mm/yyyy"
            />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              1. Email of the Principal Faculty member
              {/* & the affiliating department */}
            </label>
            <input
              type="text"
              disabled
              name="principalFacultyName"
              value={formData.principalFacultyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              2. Email of the Associated Faculty members
              {/* & the affiliating department  */}
              (if applicable) (if multiple separate by ',')
            </label>
            <input
              type="text"
              name="associatedFacultyNames"
              value={formData.associatedFacultyNames}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              3. Title of the Consultancy Assignment
            </label>
            <input
              type="text"
              name="consultancyTitle"
              value={formData.consultancyTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              4. Name, E-mail, & Phone No. of the Firm Soliciting Consultancy
              from SVNIT
            </label>
            {/* <!-- Firm Name --> */}
            <div className="mb-4">
              <label
                htmlFor="firmName"
                className="block text-sm font-medium text-gray-700"
              >
                Firm Name
              </label>
              <input
                type="text"
                id="firmName"
                name="firmName"
                value={formData.firmName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* <!-- Firm Email --> */}
            <div className="mb-4">
              <label
                htmlFor="firmEmail"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                type="email"
                id="firmEmail"
                name="firmEmail"
                value={formData.firmEmail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* <!-- Firm Phone Number --> */}
            <div className="mb-4">
              <label
                htmlFor="firmPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone No.
              </label>
              <input
                type="text"
                id="firmPhone"
                name="firmPhone"
                value={formData.firmPhone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              5. Types of the Assignment
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assignmentTypes"
                  value="High-Impact Consultancy"
                  onChange={handleRadioChange}
                  checked={selectedOption === "High-Impact Consultancy"}
                  className="form-checkbox"
                />
                <span className="ml-2">High-Impact Consultancy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assignmentTypes"
                  value="Low-Impact Consultancy"
                  onChange={handleRadioChange}
                  className="form-checkbox"
                  checked={selectedOption === "Low-Impact Consultancy"}
                />
                <span className="ml-2">Low-Impact Consultancy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assignmentTypes"
                  value="Routine Consultancy"
                  onChange={handleRadioChange}
                  className="form-checkbox"
                  checked={selectedOption === "Routine Consultancy"}
                />
                <span className="ml-2">Routine Consultancy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assignmentTypes"
                  value="TPI"
                  onChange={handleRadioChange}
                  className="form-checkbox"
                  checked={selectedOption === "TPI"}
                />
                <span className="ml-2">TPI</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assignmentTypes"
                  value="Testing"
                  onChange={handleRadioChange}
                  className="form-checkbox"
                  checked={selectedOption === "Testing"}
                />
                <span className="ml-2">Testing</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assignmentTypes"
                  value="Others"
                  onChange={handleRadioChange}
                  className="form-checkbox"
                  checked={selectedOption === "Others"}
                />
              </label>
              <span className="ml-2">Others</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              6. Nature of Work
            </label>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="natureOfWork"
                  value="Confidential"
                  checked={formData.natureOfWork === "Confidential"}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">Confidential</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="natureOfWork"
                  value="Not Confidential"
                  checked={formData.natureOfWork === "Not Confidential"}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">Not Confidential</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              7a. Estimated Duration of Project
            </label>
            <input
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              7b. Estimated out of Campus Visits
            </label>
            <input
              type="text"
              name="outOfCampusVisits"
              value={formData.outOfCampusVisits}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              8. Date of Commencement
            </label>
            <input
              type="date"
              name="commencementDate"
              value={formData.commencementDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              9. Total Amount (Rs.) Plus Taxes
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              10. Attachments
            </label>
            <div className="space-y-2">
              <div>
                <label className="block">Work order No.:</label>
                <input
                  type="text"
                  name="workOrderNo"
                  value={formData.workOrderNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Estimate letter No.:</label>
                <input
                  type="text"
                  name="estimateLetterNo"
                  value={formData.estimateLetterNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Proposed letter No.:</label>
                <input
                  type="text"
                  name="proposedLetterNo"
                  value={formData.proposedLetterNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="bg-[#4648ad] mt-2 text-white px-4 py-2 rounded hover:bg-[#36378d] mx-auto"
            onClick={handleDraft}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="bg-[#3e3fa1] text-white px-4 py-2 rounded hover:bg-[#30328a] mx-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultancyProjectRegistrationForm;

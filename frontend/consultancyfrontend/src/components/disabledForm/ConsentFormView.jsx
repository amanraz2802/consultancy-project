import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Spinner from "../spinner/Spinner";
function ConsentFormView() {
  const [data, setData] = useState({});
  const [formdata, setFormData] = useState({
    date: "",
    principalFacultyName: "",
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
    totalAmount: "",
    workOrderNo: "",
    estimateLetterNo: "",
    proposedLetterNo: "",
  });
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(projectId);
        const response = await apiConnector(
          "GET",
          `form/consentForm/${projectId}`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log("in consent form view", response);

        // Directly set data
        setData(response.data.data);
        setFormData({
          projectNo: response.data.data.projectId || "",
          date: response.data.data.date || "",
          principalFacultyName: response.data.data.principalFacultyName || "",
          associatedFacultyNames:
            response.data.data.associatedFacultyNames || "",
          consultancyTitle: response.data.data.consultancyTitle || "",
          firmName: response.data.data.firmName || "",
          firmEmail: response.data.data.firmEmail || "",
          firmPhone: response.data.data.firmPhone,
          assignmentTypes: response.data.data.assignmentTypes || "",
          natureOfWork: response.data.data.natureOfWork || "",
          estimatedDuration: response.data.data.estimatedDuration || "",
          outOfCampusVisits: response.data.data.outOfCampusVisits || "",
          commencementDate: response.data.data.commencementDate || "",
          totalAmount: response.data.data.totalAmount.toString() || "",
          workOrderNo: response.data.data.workOrderNo || "",
          estimateLetterNo: response.data.data.estimateLetterNo || "",
          proposedLetterNo: response.data.data.proposedLetterNo || "", // If applicable
        });
        console.log("Form Data: ", formdata);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
      setLoading(false);
    };

    fetchData();
  }, [projectId, token]);

  const handleDownloadPDF = async (formData) => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { width, height } = page.getSize();
      const fontSize = 12;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Add watermark
      const logoImageBytes = await fetch(
        "https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
      ).then((res) => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoDims = logoImage.scale(0.5);
      const watermarkOpacity = 0.1;

      // Add logo
      page.drawImage(logoImage, {
        x: 30,
        y: height - 120,
        width: 90,
        height: 90,
      });

      page.drawImage(logoImage, {
        x: 120,
        y: 250,
        width: 300,
        height: 300,
        opacity: watermarkOpacity,
      });

      // Add header text
      page.drawText("Sardar Vallabhbhai National Institute of Technology", {
        x: 140,
        y: height - 50,
        size: 16,
        font: boldFont,
      });
      page.drawText("Surat - 395007 (GUJARAT)", {
        x: 240,
        y: height - 70,
        size: 14,
        font: boldFont,
      });
      page.drawText("Office of the Dean Research & Consultancy", {
        x: 190,
        y: height - 90,
        size: 14,
        font: boldFont,
      });
      page.drawText("Form-CP-1.1-Form for Consultancy Project Registration", {
        x: 140,
        y: height - 110,
        size: 14,
        font: boldFont,
      });
      page.drawLine({
        start: { x: 20, y: height - 130 },
        end: { x: 550, y: height - 130 },
        thickness: 2,
        color: rgb(0, 0, 0),
      });

      // Add form fields
      const drawField = (label, value, y) => {
        page.drawText(label, {
          x: 50,
          y,
          size: fontSize,
          font: boldFont,
        });
        page.drawText(value, {
          x: 250,
          y,
          size: fontSize,
          font: font,
        });
      };

      let yPosition = height - 200;
      const lineHeight = 25;

      drawField("Project No:", `${formData.projectNo}`, yPosition);
      yPosition -= lineHeight;
      drawField("Date:", formData.date, yPosition);
      yPosition -= lineHeight;
      drawField(
        "Principal Faculty Name:",
        formData.principalFacultyName,
        yPosition
      );
      yPosition -= lineHeight;
      drawField(
        "Associated Faculty Names:",
        formData.associatedFacultyNames,
        yPosition
      );
      yPosition -= lineHeight;
      drawField("Consultancy Title:", formData.consultancyTitle, yPosition);
      yPosition -= lineHeight;
      drawField("Firm Name:", formData.firmName, yPosition);
      yPosition -= lineHeight;
      drawField("Firm Email:", formData.firmEmail, yPosition);
      yPosition -= lineHeight;
      drawField("Firm Phone:", formData.firmPhone, yPosition);
      yPosition -= lineHeight;
      drawField("Assignment Types:", formdata.assignmentTypes, yPosition);
      yPosition -= lineHeight;
      drawField("Nature of Work:", formData.natureOfWork, yPosition);
      yPosition -= lineHeight;
      drawField("Estimated Duration:", formData.estimatedDuration, yPosition);
      yPosition -= lineHeight;
      drawField("Out of Campus Visits:", formData.outOfCampusVisits, yPosition);
      yPosition -= lineHeight;
      drawField("Commencement Date:", formData.commencementDate, yPosition);
      yPosition -= lineHeight;
      drawField("Total Amount:", formData.totalAmount, yPosition);
      yPosition -= lineHeight;
      drawField("Work Order No:", formData.workOrderNo, yPosition);
      yPosition -= lineHeight;
      drawField("Estimate Letter No:", formData.estimateLetterNo, yPosition);
      yPosition -= lineHeight;
      drawField("Proposed Letter No:", formData.proposedLetterNo, yPosition);

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `Consent-Form-ProjectId-${projectId}.pdf`;
      link.click();
      // Create FormData and append the PDF file
      // const formDataToSend = new FormData();
      // formDataToSend.append("file", pdfBlob, "document.pdf");
    } catch (error) {
      console.error("Error handling PDF:", error);
    }
  };

  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
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
      <form className="space-y-6">
        <div className="text-gray-800 font-semibold text-base mb-4 flex justify-between">
          <span>
            <span>ProjectId: </span>

            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-18 mx-2"
              min="1"
              max="10000"
              placeholder="####"
              name="projectNo"
              value={data.projectId}
              // disabled
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
              disabled
            />
            <span>-</span>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-14 mx-2"
              min="0"
              max="99"
              name="year2"
              value={formData.year2}
              disabled
              placeholder="25"
            /> */}
          </span>
          <span>
            <span className="ml-20"> Date: </span>
            <input
              type="text"
              name="date"
              // value={formData.date}
              value={data.date}
              disabled
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
              value={data.principalFacultyName}
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
              value={data.associatedFacultyNames}
              disabled
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
              value={data.consultancyTitle}
              disabled
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
                value={data.firmName}
                disabled
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
                value={data.firmEmail}
                disabled
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
                value={data.firmPhone}
                disabled
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
                  disabled
                  checked={
                    formdata.assignmentTypes === "High-Impact Consultancy"
                  }
                  className="form-checkbox"
                />
                <span className="ml-2">High-Impact Consultancy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  disabled
                  name="assignmentTypes"
                  value="Low-Impact Consultancy"
                  className="form-checkbox"
                  checked={
                    formdata.assignmentTypes === "Low-Impact Consultancy"
                  }
                />
                <span className="ml-2">Low-Impact Consultancy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  disabled
                  name="assignmentTypes"
                  value="Routine Consultancy"
                  className="form-checkbox"
                  checked={formdata.assignmentTypes === "Routine Consultancy"}
                />
                <span className="ml-2">Routine Consultancy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  disabled
                  name="assignmentTypes"
                  value="TPI"
                  className="form-checkbox"
                  checked={formdata.assignmentTypes === "TPI"}
                />
                <span className="ml-2">TPI</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  disabled
                  name="assignmentTypes"
                  value="Testing"
                  className="form-checkbox"
                  checked={formdata.assignmentTypes === "Testing"}
                />
                <span className="ml-2">Testing</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  disabled
                  name="assignmentTypes"
                  value={formdata.assignmentTypes === "Others"}
                  className="form-checkbox"
                  checked={formdata.assignmentTypes === "Others"}
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
                  checked={formdata.natureOfWork === "Confidential"}
                  disabled
                  className="form-radio"
                />
                <span className="ml-2">Confidential</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="natureOfWork"
                  value="Not Confidential"
                  checked={formdata.natureOfWork === "Not Confidential"}
                  disabled
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
              value={data.estimatedDuration}
              disabled
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
              value={data.outOfCampusVisits}
              disabled
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
              value={data.commencementDate}
              disabled
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
              value={data.totalAmount}
              disabled
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
                  value={data.workOrderNo}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Estimate letter No.:</label>
                <input
                  type="text"
                  name="estimateLetterNo"
                  value={data.estimateLetterNo}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block">Proposed letter No.:</label>
                <input
                  type="text"
                  name="proposedLetterNo"
                  value={data.proposedLetterNo}
                  disabled
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="bg-[#484aad] mt-2 text-white px-4 py-2 rounded hover:bg-[#383a90] mx-auto"
            onClick={() => handleDownloadPDF(formdata)}
          >
            Download PDF
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConsentFormView;

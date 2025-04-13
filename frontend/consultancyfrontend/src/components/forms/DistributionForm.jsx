import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { apiConnector } from "../../services/apiConnectors";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

const DistributionForm = () => {
  // const { projectId } = useParams();
  // const projectId = 6;
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { projectId } = useParams();
  const [currentDate, setCurrentDate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [totalAmount, setTotalAmount] = useState(260313);
  const formRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [file, setFile] = useState(null);
  const [billReceiptUrl, setBillReceiptUrl] = useState(
    "abchde.comhttps://github.com/colinhacks/zod/issues/2236"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `/form/prefetch/closure/${projectId}`,
          {},
          { Authorization: `Bearer ${token}` }
        );
        console.log(response);
        setTotalAmount(response.data.data.payments[0].netPaymentReceived);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, token]);

  // Section percentages
  const [sections, setSections] = useState([
    { id: 1, name: "Institute", percentage: 28.5, amount: 0, rows: [] },
    {
      id: 2,
      name: "Charges For Personnel Engaged Technical Services",
      percentage: 6.5,
      amount: 0,
      rows: [],
    },
    {
      id: 3,
      name: "Concerned Faculty/ Faculties",
      percentage: 65,
      amount: 0,
      rows: [],
    },
  ]);

  async function submitHandler() {
    // console.log(body);
    // console.log(subject);
    // console.log(sections);
    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("subject", subject);
    formData.set("body", body);
    formData.set("sections", JSON.stringify(sections));
    formData.set("billReceiptUrl", billReceiptUrl);
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        "/form/distributionForm",
        formData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      console.log(obj, "Submitting bill disbursement form");
      console.log(response);
      if (response.data) {
        toast.success("Form submitted successfully");
        navigate("/home");
      }
    } catch (err) {
      console.error("Error submitting closure form:", err);
      toast.error("Failed to submit form");
      setLoading(false);
    }
    setLoading(false);
  }

  // Initialize date on component mount
  useEffect(() => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  // Recalculate amounts when total or percentages change
  useEffect(() => {
    const updatedSections = sections.map((section) => {
      const sectionAmount = (section.percentage / 100) * totalAmount;
      return {
        ...section,
        amount: Math.round(sectionAmount),
      };
    });
    setSections(updatedSections);
  }, [totalAmount, sections.map((s) => s.percentage).join(",")]);

  // Add a new row to a section
  const addRow = (sectionId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          rows: [
            ...section.rows,
            {
              id: Date.now(),
              name: "",
              employeeCode: "",
              email: "",
              percentage: 0,
              amount: 0,
            },
          ],
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Update row details
  const updateRow = (sectionId, rowId, field, value) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedRows = section.rows.map((row) => {
          if (row.id === rowId) {
            const updatedRow = { ...row, [field]: value };

            // Recalculate amount if percentage changes
            if (field === "percentage") {
              updatedRow.amount = Math.round(
                (updatedRow.percentage / 100) * section.amount
              );
            }

            return updatedRow;
          }
          return row;
        });

        return { ...section, rows: updatedRows };
      }
      return section;
    });

    setSections(updatedSections);
  };

  // Remove a row
  const removeRow = (sectionId, rowId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          rows: section.rows.filter((row) => row.id !== rowId),
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Update section percentage
  const updateSectionPercentage = (sectionId, percentage) => {
    const numericPercentage = parseFloat(percentage) || 0;

    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, percentage: numericPercentage };
      }
      return section;
    });

    setSections(updatedSections);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return (
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })
        .format(amount)
        .replace("₹", "") + "/-"
    );
  };

  // Function to generate PDF
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Add a page to the document
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

      // Get font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Page settings
      const { width, height } = page.getSize();
      const margin = 50;
      let currentY = height - margin;
      const lineHeight = 15;

      // Add header
      page.drawText(
        "Sardar Vallabhbhai National Institute of Technology Surat - 395007 (GUJARAT)",
        {
          x: margin,
          y: currentY,
          size: 10,
          font: helveticaBold,
        }
      );

      currentY -= lineHeight * 2;

      page.drawText("Consultancy Fees Distribution Form", {
        x: margin + 120,
        y: currentY,
        size: 12,
        font: helveticaBold,
      });

      currentY -= lineHeight * 2;

      // Draw horizontal line
      page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: width - margin, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      currentY -= lineHeight * 2;

      // Project details
      page.drawText(`Project No- ${projectId || "____"}`, {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaFont,
      });

      page.drawText(`Date: ${currentDate}`, {
        x: width - margin - 120,
        y: currentY,
        size: 10,
        font: helveticaFont,
      });

      currentY -= lineHeight * 2;

      // Subject
      page.drawText("Subject:", {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaBold,
      });

      currentY -= lineHeight;

      page.drawText(
        subject || "Distribution of consultancy fees Received from...",
        {
          x: margin + 10,
          y: currentY,
          size: 10,
          font: helveticaFont,
        }
      );

      currentY -= lineHeight * 2;

      // Body
      page.drawText("Body:", {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaBold,
      });

      currentY -= lineHeight;

      // Break body text into multiple lines if needed
      const bodyText = body || "The Department during the year...";
      const words = bodyText.split(" ");
      let line = "";
      for (const word of words) {
        if ((line + word).length > 80) {
          page.drawText(line, {
            x: margin + 10,
            y: currentY,
            size: 10,
            font: helveticaFont,
          });
          currentY -= lineHeight;
          line = word + " ";
        } else {
          line += word + " ";
        }
      }

      if (line) {
        page.drawText(line, {
          x: margin + 10,
          y: currentY,
          size: 10,
          font: helveticaFont,
        });
      }

      currentY -= lineHeight * 2;

      // Total Amount
      page.drawText(`Total Amount (Rs.): ${formatCurrency(totalAmount)}`, {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaBold,
      });

      currentY -= lineHeight * 2;

      // Details of Distribution
      page.drawText("Details of Distribution:", {
        x: margin,
        y: currentY,
        size: 12,
        font: helveticaBold,
      });

      currentY -= lineHeight * 2;

      // Sections
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        // Check if we need a new page
        if (currentY < margin + 100) {
          // Add a new page
          page = pdfDoc.addPage([595.28, 841.89]);
          currentY = height - margin;
        }

        // Section header
        page.drawText(`${i + 1}. ${section.name}`, {
          x: margin,
          y: currentY,
          size: 10,
          font: helveticaBold,
        });

        page.drawText(
          `Percentage: ${section.percentage}%    Amount (Rs.): ${formatCurrency(
            section.amount
          )}`,
          {
            x: margin + 300,
            y: currentY,
            size: 10,
            font: helveticaFont,
          }
        );

        currentY -= lineHeight * 2;

        // Draw tables for rows if any
        if (section.rows.length > 0) {
          // Table headers
          const colWidths = [80, 120, 120, 80, 80];
          const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
          let tableX = margin;

          // Table header row
          page.drawRectangle({
            x: tableX,
            y: currentY - lineHeight,
            width: tableWidth,
            height: lineHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: rgb(0.9, 0.9, 0.9),
          });

          let columnX = tableX;

          page.drawText("Employee Code", {
            x: columnX + 5,
            y: currentY - 10,
            size: 8,
            font: helveticaBold,
          });
          columnX += colWidths[0];

          page.drawLine({
            start: { x: columnX, y: currentY },
            end: { x: columnX, y: currentY - lineHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
          });

          page.drawText("Title/Name", {
            x: columnX + 5,
            y: currentY - 10,
            size: 8,
            font: helveticaBold,
          });
          columnX += colWidths[1];

          page.drawLine({
            start: { x: columnX, y: currentY },
            end: { x: columnX, y: currentY - lineHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
          });

          if (section.id !== 2) {
            page.drawText("Email", {
              x: columnX + 5,
              y: currentY - 10,
              size: 8,
              font: helveticaBold,
            });
            columnX += colWidths[2];

            page.drawLine({
              start: { x: columnX, y: currentY },
              end: { x: columnX, y: currentY - lineHeight },
              thickness: 1,
              color: rgb(0, 0, 0),
            });
          }

          page.drawText("Percentage (%)", {
            x: columnX + 5,
            y: currentY - 10,
            size: 8,
            font: helveticaBold,
          });
          columnX += colWidths[3];

          page.drawLine({
            start: { x: columnX, y: currentY },
            end: { x: columnX, y: currentY - lineHeight },
            thickness: 1,
            color: rgb(0, 0, 0),
          });

          page.drawText("Amount (Rs.)", {
            x: columnX + 5,
            y: currentY - 10,
            size: 8,
            font: helveticaBold,
          });

          currentY -= lineHeight;

          // Draw table rows
          for (const row of section.rows) {
            // Check if we need a new page
            if (currentY < margin + 20) {
              // Add a new page
              page = pdfDoc.addPage([595.28, 841.89]);
              currentY = height - margin;
            }

            page.drawRectangle({
              x: tableX,
              y: currentY - lineHeight,
              width: tableWidth,
              height: lineHeight,
              borderColor: rgb(0, 0, 0),
              borderWidth: 1,
            });

            columnX = tableX;

            page.drawText(row.employeeCode || "", {
              x: columnX + 5,
              y: currentY - 10,
              size: 8,
              font: helveticaFont,
            });
            columnX += colWidths[0];

            page.drawLine({
              start: { x: columnX, y: currentY },
              end: { x: columnX, y: currentY - lineHeight },
              thickness: 1,
              color: rgb(0, 0, 0),
            });

            page.drawText(row.name || "", {
              x: columnX + 5,
              y: currentY - 10,
              size: 8,
              font: helveticaFont,
            });
            columnX += colWidths[1];

            page.drawLine({
              start: { x: columnX, y: currentY },
              end: { x: columnX, y: currentY - lineHeight },
              thickness: 1,
              color: rgb(0, 0, 0),
            });

            if (section.id !== 2) {
              page.drawText(row.email || "", {
                x: columnX + 5,
                y: currentY - 10,
                size: 8,
                font: helveticaFont,
              });
              columnX += colWidths[2];

              page.drawLine({
                start: { x: columnX, y: currentY },
                end: { x: columnX, y: currentY - lineHeight },
                thickness: 1,
                color: rgb(0, 0, 0),
              });
            }

            page.drawText(`${row.percentage}%`, {
              x: columnX + 5,
              y: currentY - 10,
              size: 8,
              font: helveticaFont,
            });
            columnX += colWidths[3];

            page.drawLine({
              start: { x: columnX, y: currentY },
              end: { x: columnX, y: currentY - lineHeight },
              thickness: 1,
              color: rgb(0, 0, 0),
            });

            page.drawText(formatCurrency(row.amount), {
              x: columnX + 5,
              y: currentY - 10,
              size: 8,
              font: helveticaFont,
            });

            currentY -= lineHeight;
          }

          currentY -= lineHeight;
        }

        currentY -= lineHeight * 2;
      }

      // Notes at the bottom
      if (currentY < margin + 40) {
        // Add a new page
        page = pdfDoc.addPage([595.28, 841.89]);
        currentY = height - margin;
      }

      page.drawText(
        "* If there is no email associated to it, leave it empty.",
        {
          x: margin,
          y: currentY,
          size: 8,
          font: helveticaFont,
        }
      );

      currentY -= lineHeight;

      page.drawText("* If there is no employee code, fill 0.", {
        x: margin,
        y: currentY,
        size: 8,
        font: helveticaFont,
      });

      // Convert the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Create a blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link to download the PDF and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = `Consultancy_Fees_Distribution_${
        projectId || "Form"
      }.pdf`;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      setIsGeneratingPDF(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGeneratingPDF(false);
      alert("Error generating PDF. Please try again.");
    }
  };
  if (loading) {
    return <Spinner text={"One moment, please..."} />;
  }
  return (
    <div
      className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-4"
      ref={formRef}
    >
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

              <h3 className="text-xl font-semibold text-center mb-4">
                Consultancy Fees Distribution Form
              </h3>
            </div>
          </div>
          <div className="text-5xl font-bold transform -rotate-90 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            SVNIT
          </div>
        </div>
        <div className="bg-black h-[2px] w-full mt-6"></div>
      </header>
      <div className="mb-6 border-b pb-4 mt-8">
        <div className="flex justify-between mb-4">
          <div>
            <span className="font-bold">Project No: </span>
            <span>{projectId}</span>
          </div>
          <div>
            <span className="font-bold">Date: </span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-bold">Subject:</label>
          <textarea
            className="w-full border rounded p-2"
            rows="2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Distribution of consultancy fees Received from..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-bold">Body:</label>
          <textarea
            className="w-full border rounded p-2"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="The Department during the year..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-bold">
            Total Amount (Rs.):
          </label>
          <input
            type="number"
            className="border rounded p-2 w-48"
            value={totalAmount}
            // onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            readOnly
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-bold text-lg mb-2">Details of Distribution:</h2>
        {sections.map((section, index) => (
          <div key={section.id} className="mb-8 border p-4 rounded">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-md flex-1">
                {index + 1}. {section.name}
              </h3>
              <div className="flex items-center">
                <label className="mr-2">Percentage (%):</label>
                <input
                  type="number"
                  className="border rounded p-1 w-20 mr-4"
                  value={section.percentage}
                  onChange={(e) =>
                    updateSectionPercentage(section.id, e.target.value)
                  }
                />
                <label className="mr-2">Amount (Rs.):</label>
                <span className="font-bold">
                  {formatCurrency(section.amount)}
                </span>
              </div>
            </div>

            {section.rows.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Employee Code</th>
                      <th className="border p-2 text-left">Title/ Name</th>
                      {
                        // section.id !== 2 && (
                        //   <th className="border p-2 text-left">Email</th>
                        // )
                      }
                      <th className="border p-2 text-left">Percentage (%)</th>
                      <th className="border p-2 text-left">Amount (Rs.)</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.id}>
                        <td className="border p-2">
                          <input
                            type="text"
                            className="border rounded p-1 w-full"
                            value={row.employeeCode}
                            onChange={(e) =>
                              updateRow(
                                section.id,
                                row.id,
                                "employeeCode",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            className="border rounded p-1 w-full"
                            value={row.name}
                            onChange={(e) =>
                              updateRow(
                                section.id,
                                row.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        {
                          // section.id !== 2 && (
                          //   <td className="border p-2">
                          //     <input
                          //       type="text"
                          //       className="border rounded p-1 w-full"
                          //       value={row.email}
                          //       onChange={(e) =>
                          //         updateRow(
                          //           section.id,
                          //           row.id,
                          //           "email",
                          //           e.target.value
                          //         )
                          //       }
                          //     />
                          //   </td>
                          // )
                        }
                        <td className="border p-2">
                          <input
                            type="number"
                            className="border rounded p-1 w-full"
                            value={row.percentage}
                            onChange={(e) =>
                              updateRow(
                                section.id,
                                row.id,
                                "percentage",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="border p-2">
                          {formatCurrency(row.amount)}
                        </td>
                        <td className="border p-2">
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            onClick={() => removeRow(section.id, row.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => addRow(section.id)}
            >
              Add Row
            </button>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={submitHandler}
          className="bg-blue-800 p-2 text-white rounded-lg flex justify-center"
        >
          Submit
        </button>

        <button
          onClick={generatePDF}
          disabled={isGeneratingPDF}
          className={`p-2 text-white rounded-lg flex justify-center items-center ${
            isGeneratingPDF ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
        </button>
      </div>

      <div className="mt-5">
        <span className="text-red-600 ">* </span>
        <span>If there is no employee code , fill 0.</span>
      </div>
    </div>
  );
};

export default DistributionForm;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { apiConnector } from "../../services/apiConnectors";
import Spinner from "../spinner/Spinner";

const DistributionViewForm = () => {
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const formRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [billReceiptUrl, setBillReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchDistributionFormData = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `form/distributionForm/${projectId}`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log(response.data, "distribution form");
        const formData = response.data.data;

        if (formData) {
          setFormData(formData);
          setSubject(formData.subject);
          setBody(formData.body);
          setSections(formData.sections);
          setBillReceiptUrl(formData.billReceiptUrl);

          // Calculate total amount from sections
          const total = formData.sections.reduce(
            (sum, section) => sum + section.amount,
            0
          );
          setTotalAmount(total);
        }
      } catch (error) {
        console.error("Error fetching distribution form data:", error);
        toast.error("Failed to load distribution form data");
      } finally {
        setLoading(false);
      }
    };

    fetchDistributionFormData();
  }, [projectId, token]);

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
        opacity: watermarkOpacity, // Set the opacity for watermark
      });

      // Add header text
      page.drawText("Sardar Vallabhbhai National Institute of Technology", {
        x: 140,
        y: height - 50,
        size: 16,
        font: helveticaBold,
      });
      page.drawText("Surat - 395007 (GUJARAT)", {
        x: 240,
        y: height - 70,
        size: 14,
        font: helveticaFont,
      });

      page.drawText("Consultancy Fee Distribution Form", {
        x: 190,
        y: height - 110,
        size: 14,
        font: helveticaBold,
      });
      page.drawLine({
        start: { x: 20, y: height - 130 },
        end: { x: 550, y: height - 130 },
        thickness: 2,
        color: rgb(0, 0, 0),
      });

      currentY -= lineHeight * 2;
      currentY -= 50;

      currentY -= lineHeight * 2;

      // Project details
      page.drawText(`Project No- ${projectId || "____"}`, {
        x: margin,
        y: currentY,
        size: 10,
        font: helveticaBold,
      });

      page.drawText(`Date: ${currentDate}`, {
        x: width - margin - 120,
        y: currentY,
        size: 10,
        font: helveticaBold,
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
      toast.error("Error generating PDF. Please try again.");
    }
  };

  if (loading) {
    return <Spinner text={"Loading distribution form data..."} />;
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-bold">Project No: </span>
            <span>{projectId}</span>
          </div>
          <div className="text-right">
            <span className="font-bold">Date: </span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold text-gray-700 mb-1">Subject:</div>
          <div className="border rounded p-3 bg-gray-50">{subject}</div>
        </div>

        <div className="mb-4">
          <div className="font-bold text-gray-700 mb-1">Body:</div>
          <div className="border rounded p-3 bg-gray-50 whitespace-pre-wrap">
            {body}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold text-gray-700 mb-1">Total Amount:</div>
          <div className="border rounded p-3 bg-gray-50 font-semibold">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        {billReceiptUrl && (
          <div className="mb-4">
            <div className="font-bold text-gray-700 mb-1">
              Bill Receipt URL:
            </div>
            <div className="border rounded p-3 bg-gray-50">
              <a
                href={billReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {billReceiptUrl}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-lg mb-4">Details of Distribution:</h2>
        {sections.map((section, index) => (
          <div key={section.id} className="mb-8 border p-4 rounded bg-gray-50">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-bold text-md">
                {index + 1}. {section.name}
              </h3>
              <div className="flex items-center space-x-4">
                <div>
                  <span className="font-semibold">Percentage: </span>
                  <span>{section.percentage}%</span>
                </div>
                <div>
                  <span className="font-semibold">Amount: </span>
                  <span className="font-bold">
                    {formatCurrency(section.amount)}
                  </span>
                </div>
              </div>
            </div>

            {section.rows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Employee Code</th>
                      <th className="border p-2 text-left">Title/Name</th>
                      {section.id !== 2 && (
                        <th className="border p-2 text-left">Email</th>
                      )}
                      <th className="border p-2 text-left">Percentage (%)</th>
                      <th className="border p-2 text-left">Amount (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-100">
                        <td className="border p-2">
                          {row.employeeCode || "N/A"}
                        </td>
                        <td className="border p-2">{row.name}</td>
                        {section.id !== 2 && (
                          <td className="border p-2">{row.email || "N/A"}</td>
                        )}
                        <td className="border p-2">{row.percentage}%</td>
                        <td className="border p-2 font-medium">
                          {formatCurrency(row.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={generatePDF}
          disabled={isGeneratingPDF}
          className={`px-4 py-2 text-white rounded-lg flex items-center justify-center ${
            isGeneratingPDF ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
        </button>
      </div>
    </div>
  );
};

export default DistributionViewForm;

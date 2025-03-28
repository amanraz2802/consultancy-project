import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnectors";
import { useNavigate } from "react-router-dom";

const ReceiptVoucherViewForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReceiptVoucher() {
      try {
        setIsLoading(true);
        const response = await apiConnector(
          "GET",
          `form/voucherForm/${projectId}`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // Ensure data is properly set
        if (response?.data?.data) {
          setFormData(response.data.data);
          //   setData(response.data.data);
        } else {
          setError("No voucher data found");
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching receipt voucher:", err);
        setError("Failed to fetch receipt voucher details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReceiptVoucher();
  }, [projectId, token]);

  const wrapText = (text, maxWidth, font, fontSize) => {
    if (text === "") return "";
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines;
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { width, height } = page.getSize();

      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Fetch logo
      const logoResponse = await fetch(
        "https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
      );
      const logoImageBytes = await logoResponse.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoImageBytes);

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
        opacity: 0.1, // Set the opacity for watermark
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
        font: font,
      });

      page.drawText("Misc. Receipt Voucher", {
        x: 240,
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

      // Add form details with text wrapping
      const drawField = (label, value, startY, maxWidth = 250) => {
        const fontSize = 12;

        // Draw label
        page.drawText(label, {
          x: 50,
          y: startY,
          size: fontSize,
          font: boldFont,
        });

        // Wrap value text
        const wrappedLines = wrapText(value, maxWidth, font, fontSize);

        // Draw wrapped lines
        wrappedLines.forEach((line, index) => {
          page.drawText(line, {
            x: 250,
            y: startY - index * 15,
            size: fontSize,
            font: font,
          });
        });

        // Return the Y position of the last line
        return startY - (wrappedLines.length - 1) * 15;
      };

      // Fields to draw
      const fields = [
        ["Voucher No:", formData[0].voucherNo],
        ["Date:", formData[0].date],
        ["Account:", formData[0].account],
        ["Amount:", `Rs. ${formData[0].amount}`],
        ["Through:", formData[0].throughBank],
        ["On Account:", formData[0].onAccount],
        ["Reference:", formData[0].reference],
        ["Bank Reference:", formData[0].bankReference],
      ];

      // Start Y position
      let currentY = height - 300;

      // Draw each field with dynamic line breaking
      fields.forEach((field) => {
        currentY = drawField(field[0], field[1], currentY) - 20;
      });

      // Watermark
      page.drawImage(logoImage, {
        x: width / 2 - 150,
        y: height / 2 - 150,
        width: 300,
        height: 300,
        opacity: 0.1,
      });

      // Serialize PDF
      const pdfBytes = await pdfDoc.save();

      // Create and trigger download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Receipt_Voucher_${formData[0].voucherNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Misc. Receipt Voucher
        </h3>

        {formData && (
          <div className="mt-8 p-6 bg-gray-50 rounded-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="border-b border-gray-300 pb-2">
                  <span className="font-semibold text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </span>
                  {typeof value === "object" && value !== null ? (
                    <ul className="ml-2 text-gray-600">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <li key={subKey} className="mt-1">
                          <strong className="mr-1">
                            {subKey.replace(/([A-Z])/g, " $1")}:
                          </strong>
                          {subValue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="ml-2 text-gray-600">{value}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-md 
                           hover:bg-blue-700 transition duration-300 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           flex items-center justify-center space-x-2"
                onClick={() => handleDownloadPDF(formData)}
                disabled={!formData}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-8.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptVoucherViewForm;

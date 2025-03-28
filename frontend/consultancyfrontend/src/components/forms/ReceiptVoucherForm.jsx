import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnectors";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ulid } from "ulid";

const ReceiptVoucherForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    projectId: parseInt(projectId),
    voucherNo: ulid(),
    date: "29-Jan-2025",
    account: "Fine Charges From Students",
    amount: "100.00",
    throughBank: "State Bank of India MHRD C/A 36743656767",
    onAccount: "AMAN RAJ AD. NO. U23CS021, ROOM NO. 403, FINE CHARGES",
    reference: "HOSTEL SECTION/ABVB/73/2024-25 DT. 28/01/2025",
    bankReference: "SBI SCAN REF: 658696341128 DT. 29/01/2025",
    particulars: "",
    bankTransactionDetails: "",
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = apiConnector("POST", "/form/voucherForm", formData, {
        draft: "false",
        Authorization: `Bearer ${token}`,
      });
      console.log(response);
      if (response) {
        toast.success("Receipt Voucher generated successfully");
        navigate("/payment-detail");
      }

      setSubmittedData(formData);
      // console.log("Form Data Submitted:", formData);
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.log(err);
      setLoading(false);
    }
  };

  // Function to wrap text
  const wrapText = (text, maxWidth, font, fontSize) => {
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
        ["Voucher No:", formData.voucherNo],
        ["Date:", formData.date],
        ["Account:", formData.account],
        ["Amount:", `&#8377 ${formData.amount}`],
        ["Through:", formData.throughBank],
        ["On Account:", formData.onAccount],
        ["Reference:", formData.reference],
        ["Bank Reference:", formData.bankReference],
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
      link.download = `Receipt_Voucher_${formData.voucherNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
  if (loading) {
  }
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
            alt="SVNIT Logo"
            className="h-24 w-24 mr-6"
          />
          <div>
            <h1 className="text-2xl font-bold text-center">
              Sardar Vallabhbhai National Institute of Technology
            </h1>
            <h2 className="text-xl text-center">Surat - 395007 (GUJARAT)</h2>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-center mb-6">
          Misc. Receipt Voucher
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Voucher No.
              </label>
              <input
                type="text"
                name="voucherNo"
                value={formData.voucherNo}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account
              </label>
              <textarea
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
          </div>

          {/* Third Row */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Through (Bank)
            </label>
            <textarea
              name="throughBank"
              value={formData.throughBank}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-20"
              required
            />
          </div>

          {/* Fourth Row */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              On Account Details
            </label>
            <textarea
              name="onAccount"
              value={formData.onAccount}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-20"
              required
            />
          </div>

          {/* Fifth Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference
              </label>
              <textarea
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Transaction Details
              </label>
              <textarea
                name="bankReference"
                value={formData.bankReference}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-20"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Submit Form
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </form>

        {/* Submitted Data Display */}
        {submittedData && (
          <div className="mt-8 p-6 bg-gray-100 rounded-md">
            <h4 className="text-xl font-semibold mb-4">Submitted Form Data</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(submittedData).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </span>
                  <span className="ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptVoucherForm;

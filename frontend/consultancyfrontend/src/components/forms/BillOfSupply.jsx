import React, { useState } from "react";
import { FiPrinter, FiDownload, FiPlus, FiX } from "react-icons/fi";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    projectId: "SVNIT/2024/001",
    workName: "",
    billTo: {
      name: "",
      address: "",
      gstin: "",
      state: "",
      code: "",
    },
    shipTo: {
      name: "",
      address: "",
      gstin: "",
      state: "",
      code: "",
    },
    items: [
      {
        description: "",
        sacCode: "",
        qty: 0,
        rate: 0,
        amount: 0,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 0,
      },
    ],
  });

  const addNewItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          sacCode: "",
          qty: 0,
          rate: 0,
          amount: 0,
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (indexToRemove) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, index) => index !== indexToRemove),
      }));
    }
  };
  async function generateInvoicePDF(formData) {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points

    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add watermark
    const logoImageBytes = await fetch(
      "https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
    ).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.5);
    const watermarkOpacity = 0.1;

    // Set default font size and color
    const fontSize = 10;
    const textColor = rgb(0, 0, 0);

    // Helper function to draw text
    const drawText = (text, x, y, options = {}) => {
      const {
        font = helveticaFont,
        size = fontSize,
        color = textColor,
        align = "left",
      } = options;

      page.drawText(text, {
        x,
        y,
        font,
        size,
        color,
        ...options,
      });
    };

    // // Draw header
    // drawText(
    //   "Sardar Vallabhbhai National Institute of Technology, Surat",
    //   150,
    //   800,
    //   {
    //     font: helveticaBold,
    //     size: 16,
    //   }
    // );
    // Add logo
    page.drawImage(logoImage, {
      x: 30,
      y: 720,
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
      y: 800,
      size: 16,
      font: helveticaBold,
    });
    page.drawText("Surat - 395007 (GUJARAT)", {
      x: 240,
      y: 780,
      size: 14,
      font: helveticaFont,
    });
    // drawText("Surat - 395007 (Gujarat)", 250, 780, { size: 12 });
    drawText("GSTIN: hfkjhds32kj", 250, 760, { size: 14 });

    // Draw invoice details
    drawText(`Project ID: ${formData.projectId}`, 140, 720, {
      font: helveticaBold,
    });
    drawText(`Date: ${new Date().toLocaleDateString()}`, 400, 720);

    // Draw work name
    drawText("Name of Work:", 50, 680, { font: helveticaBold });
    drawText(formData.workName, 50, 660, { maxWidth: 500 });

    // Draw billing and shipping details
    const drawPartyDetails = (title, data, startX, startY) => {
      drawText(title, startX, startY, { font: helveticaBold });
      drawText(`Name: ${data.name}`, startX, startY - 20);
      drawText(`Address: ${data.address}`, startX, startY - 40);
      drawText(`GSTIN: ${data.gstin}`, startX, startY - 60);
      drawText(`State: ${data.state}`, startX, startY - 80);
      drawText(`Code: ${data.code}`, startX, startY - 100);
    };

    drawPartyDetails("Bill To:", formData.billTo, 50, 620);
    drawPartyDetails("Ship To:", formData.shipTo, 300, 620);

    const tableY = 450;
    const rowHeight = 40;
    const padding = 2;
    const startX = 20;
    const startY = tableY;

    // Table Headers & Column Widths
    const tableHeaders = [
      "Description",
      "SAC Code",
      "Qty",
      "Rate",
      "Amount",
      "CGST",
      "SGST",
      "Total",
    ];
    const columnWidths = [150, 53, 30, 70, 70, 70, 70, 70];

    // Function to draw a rectangle (cell border)
    const drawCell = (x, y, width, height) => {
      page.drawRectangle({
        x,
        y,
        width,
        height,
        borderColor: rgb(0, 0, 0), // Black border
        borderWidth: 1, // Border thickness
      });
    };

    // Draw Table Headers with Borders
    let currentX = startX;
    tableHeaders.forEach((header, index) => {
      drawCell(currentX, startY, columnWidths[index], rowHeight); // Draw header cell
      drawText(header, currentX + padding, startY + padding, {
        font: helveticaBold,
      });
      currentX += columnWidths[index];
    });

    // Draw Table Rows with Borders
    let currentY = startY - rowHeight;
    formData.items.forEach((item) => {
      currentX = startX;

      // Draw each column with text and padding
      drawCell(currentX, currentY, columnWidths[0], rowHeight);
      drawText(item.description, currentX + padding, currentY + padding, {
        maxWidth: columnWidths[0] - padding,
      });

      drawCell(
        (currentX += columnWidths[0]),
        currentY,
        columnWidths[1],
        rowHeight
      );
      drawText(item.sacCode, currentX + padding, currentY + padding);

      drawCell(
        (currentX += columnWidths[1]),
        currentY,
        columnWidths[2],
        rowHeight
      );
      drawText(item.qty.toString(), currentX + padding, currentY + padding);

      drawCell(
        (currentX += columnWidths[2]),
        currentY,
        columnWidths[3],
        rowHeight
      );
      drawText(
        `Rs.${item.rate.toFixed(2)}`,
        currentX + padding,
        currentY + padding
      );

      drawCell(
        (currentX += columnWidths[3]),
        currentY,
        columnWidths[4],
        rowHeight
      );
      drawText(
        `Rs.${item.amount.toFixed(2)}`,
        currentX + padding,
        currentY + padding
      );

      drawCell(
        (currentX += columnWidths[4]),
        currentY,
        columnWidths[5],
        rowHeight
      );
      drawText(
        `Rs.${item.cgst.toFixed(2)}`,
        currentX + padding,
        currentY + padding
      );

      drawCell(
        (currentX += columnWidths[5]),
        currentY,
        columnWidths[6],
        rowHeight
      );
      drawText(
        `Rs.${item.sgst.toFixed(2)}`,
        currentX + padding,
        currentY + padding
      );

      drawCell(
        (currentX += columnWidths[6]),
        currentY,
        columnWidths[7],
        rowHeight
      );
      drawText(
        `Rs.${item.total.toFixed(2)}`,
        currentX + padding,
        currentY + padding
      );

      currentY -= rowHeight; // Move to the next row
    });

    // Draw totals
    const totals = {
      amount: formData.items.reduce((sum, item) => sum + item.amount, 0),
      cgst: formData.items.reduce((sum, item) => sum + item.cgst, 0),
      sgst: formData.items.reduce((sum, item) => sum + item.sgst, 0),
      total: formData.items.reduce((sum, item) => sum + item.total, 0),
    };

    currentY -= 20;
    drawText("Total Amount:", 400, currentY, { font: helveticaBold });
    drawText(`Rs.${totals.amount.toFixed(2)}`, 480, currentY);

    drawText("CGST (9%):", 400, currentY - 20, { font: helveticaBold });
    drawText(`Rs.${totals.cgst.toFixed(2)}`, 480, currentY - 20);

    drawText("SGST (9%):", 400, currentY - 40, { font: helveticaBold });
    drawText(`Rs.${totals.sgst.toFixed(2)}`, 480, currentY - 40);

    drawText("Grand Total:", 400, currentY - 60, { font: helveticaBold });
    drawText(`Rs.${totals.total.toFixed(2)}`, 480, currentY - 60);

    // Draw note
    drawText("Note:", 50, 80, { font: helveticaBold });
    drawText(
      "TDS exemption certificate from income tax department for no deduction of TDS on consultancy",
      50,
      60,
      {
        maxWidth: 500,
      }
    );
    drawText(
      "payment is attached herewith for your kind reference. Therefore, hereby request you to release",
      50,
      40,
      {
        maxWidth: 500,
      }
    );
    drawText(
      "this payment without deducting TDS against this certificate.",
      50,
      20,
      {
        maxWidth: 500,
      }
    );

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  async function handlePDFDownload(formData) {
    try {
      const pdfBytes = await generateInvoicePDF(formData);

      // Create a blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${formData.projectId}.pdf`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }
  const calculateTotals = () => {
    const totals = formData.items.reduce(
      (acc, item) => ({
        amount: acc.amount + Number(item.amount),
        cgst: acc.cgst + Number(item.cgst),
        sgst: acc.sgst + Number(item.sgst),
        igst: acc.igst + Number(item.igst),
        total: acc.total + Number(item.total),
      }),
      { amount: 0, cgst: 0, sgst: 0, igst: 0, total: 0 }
    );
    return totals;
  };

  const handleInputChange = (e, section, field, index = null) => {
    const value = e.target.value;

    if (index !== null) {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === "rate" || field === "qty") {
        const qty = field === "qty" ? value : newItems[index].qty;
        const rate = field === "rate" ? value : newItems[index].rate;
        newItems[index].amount = qty * rate;
        newItems[index].taxableValue = newItems[index].amount;
        newItems[index].cgst = newItems[index].amount * 0.09;
        newItems[index].sgst = newItems[index].amount * 0.09;
        newItems[index].total =
          newItems[index].amount + newItems[index].cgst + newItems[index].sgst;
      }

      setFormData((prev) => ({ ...prev, items: newItems }));
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const handleDownload = async () => {
    try {
      await handlePDFDownload(formData);
      console.log("Downloading PDF...");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle error appropriately
    }
    console.log("Downloading PDF...");
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <header className="max-w-6xl mx-auto p-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 gap-4">
            <img
              src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
              alt="SVNIT Logo"
              className="h-24 w-28 scale-150"
            />
            <div className="flex flex-col ">
              <h1 className="text-2xl font-bold text-center mb-2 ">
                Sardar Vallabhbhai National Institute of Technology <br /> Surat
                - 395007 (GUJARAT)
              </h1>
            </div>
          </div>
          <div className="text-5xl font-bold transform -rotate-90 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            SVNIT
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Document Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Project ID:</label>
            <input
              type="text"
              value={formData.projectId}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Date:</label>
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        {/* Work Name */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Name of Work:</label>
          <textarea
            value={formData.workName}
            onChange={(e) => handleInputChange(e, null, "workName")}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        {/* Party Details */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {["billTo", "shipTo"].map((section) => (
            <div key={section} className="border p-4 rounded">
              <h3 className="font-bold mb-2 capitalize">
                {section.replace(/([A-Z])/g, " $1").trim()}
              </h3>
              {["name", "address", "gstin", "state", "code"].map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm mb-1 capitalize">
                    {field}:
                  </label>
                  <input
                    type="text"
                    value={formData[section][field]}
                    onChange={(e) => handleInputChange(e, section, field)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Updated Items section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Items</h3>
            <button
              type="button"
              onClick={addNewItem}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FiPlus className="mr-1" /> Add Item
            </button>
          </div>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded bg-gray-50 relative"
              >
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <FiX size={20} />
                  </button>
                )}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-1">Description:</label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleInputChange(e, null, "description", index)
                      }
                      className="w-full p-2 border rounded"
                      rows="2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm mb-1">SAC Code:</label>
                    <input
                      type="text"
                      value={item.sacCode}
                      onChange={(e) =>
                        handleInputChange(e, null, "sacCode", index)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Quantity:</label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleInputChange(e, null, "qty", index)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Rate (Rs.):</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleInputChange(e, null, "rate", index)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Amount:</label>
                    <input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-bold mb-2">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>Rs.{totals.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%):</span>
              <span>Rs.{totals.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%):</span>
              <span>Rs.{totals.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Grand Total:</span>
              <span>Rs.{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="text-sm text-gray-600 mb-6">
          <p>
            Note: TDS exemption certificate from income tax department for no
            deduction of TDS on consultancy payment is attached herewith for
            your kind reference. Therefore, hereby request you to release this
            payment without deducting TDS against this certificate.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiPrinter className="mr-2" />
            Submit
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <FiDownload className="mr-2" />
            Download
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;

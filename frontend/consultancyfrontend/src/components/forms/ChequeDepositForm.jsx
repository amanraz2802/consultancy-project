import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const ChequeDepositForm = () => {
  // Hardcoded department info (to be replaced with backend data later)
  const departmentInfo = {
    fullName: "Civil Engineering",
    shortName: "ME", // This will be used in the document number
  };

  const getDocPrefix = () => {
    return `Do${departmentInfo.shortName}`; // Creates format like "DoCE"
  };
  const handleDownloadPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const fontSize = 12;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add watermark
    const logoImageBytes = await fetch("../../../images/svnitLogo.png").then(
      (res) => res.arrayBuffer()
    );
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
      font: boldFont,
    });
    page.drawText("Surat - 395007 (GUJARAT)", {
      x: 240,
      y: height - 70,
      size: 14,
      font: font,
    });
    page.drawText(`Department of ${departmentInfo.fullName}`, {
      x: 190,
      y: height - 90,
      size: 14,
      font: boldFont,
    });

    page.drawText("Cheque Deposit Form", {
      x: 220,
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
        x: 300,
        y,
        size: fontSize,
        font: font,
      });
    };

    let yPosition = height - 200;
    const lineHeight = 25;

    drawField(
      "Project No.",
      `${getDocPrefix()}/C-${formData.receiptNo}/${formData.year1st}-${
        formData.year2nd
      }`,
      yPosition
    );
    yPosition -= lineHeight;
    drawField("Date:", formData.date, yPosition);
    yPosition -= lineHeight;
    drawField("Client Name:", formData.clientName, yPosition);
    yPosition -= lineHeight;
    drawField("Amount:", formData.amount, yPosition);
    yPosition -= lineHeight;
    drawField("Amount in Words:", formData.amountInWords, yPosition);
    yPosition -= lineHeight;
    drawField("Cheque No.:", formData.chequeNo, yPosition);
    yPosition -= lineHeight;
    drawField("Cheque Date:", formData.chequeDate, yPosition);
    yPosition -= lineHeight;
    drawField("A/c No:", formData.accountNo, yPosition);
    yPosition -= lineHeight;
    drawField(
      "Title of the Consultancy Assignment:",
      formData.title,
      yPosition
    );
    yPosition -= lineHeight;
    drawField("DRCC No:", formData.drccNo, yPosition);
    yPosition -= lineHeight * 3;
    // --------------
    // Headers
    // Font sizes, spacing, and coordinates

    const tableWidth = 450;
    const xPositions = { sr: 65, detail: 150, amount: 300, code: 400 }; // X positions for columns
    page.drawLine({
      start: { x: xPositions.sr - 10, y: yPosition + lineHeight - 5 }, // Add some padding
      end: { x: xPositions.code + 70, y: yPosition + lineHeight - 5 },
      thickness: 1,
    });
    // Draw table headers
    page.drawText("Sr. No.", {
      x: xPositions.sr,
      y: yPosition,
      size: fontSize,
      font: boldFont,
    });
    page.drawText("Details", {
      x: xPositions.detail,
      y: yPosition,
      size: fontSize,
      font: boldFont,
    });
    page.drawText("Amount (Rs.)", {
      x: xPositions.amount,
      y: yPosition,
      size: fontSize,
      font: boldFont,
    });
    page.drawText("Code No.", {
      x: xPositions.code,
      y: yPosition,
      size: fontSize,
      font: boldFont,
    });
    page.drawLine({
      start: { x: xPositions.sr - 10, y: yPosition - 5 }, // Add some padding
      end: { x: xPositions.code + 70, y: yPosition - 5 },
      thickness: 1,
    });

    // Move down to start rows
    yPosition -= lineHeight;

    // Data rows
    const data = [
      {
        sr: 1,
        detail: "Consultancy Charges",
        amount: formData.consultancyCharges,
      },
      { sr: 2, detail: "Add. C.G.S.T. @ 9%", amount: calculatedData.cgst },
      { sr: 3, detail: "Add. S.G.S.T. @ 9%", amount: calculatedData.sgst },
      {
        sr: 4,
        detail: "Total Invoice Amount",
        amount: calculatedData.totalInvoiceAmount,
      },
      { sr: 5, detail: "(-) TDS @ 10%", amount: calculatedData.tds },
      {
        sr: 6,
        detail: "Net Amount Received",
        amount: calculatedData.netAmountReceived,
      },
      { sr: 7, detail: "Invoice No.", amount: formData.invoiceNo },
    ];

    // Draw the rows with borders
    data.forEach((item) => {
      // Draw a horizontal line under the row (bottom border)
      page.drawLine({
        start: { x: xPositions.sr - 10, y: yPosition + lineHeight - 5 }, // Add some padding
        end: { x: xPositions.code - 10, y: yPosition + lineHeight - 5 },
        thickness: 1,
      });
      // Draw text for each column
      page.drawText(`${item.sr}`, {
        x: xPositions.sr,
        y: yPosition,
        size: fontSize,
      });
      page.drawText(item.detail, {
        x: xPositions.detail,
        y: yPosition,
        size: fontSize,
      });
      page.drawText(`${item.amount}`, {
        x: xPositions.amount,
        y: yPosition,
        size: fontSize,
      });

      yPosition -= lineHeight; // Move down to the next row
    });
    page.drawLine({
      start: { x: xPositions.sr - 10, y: yPosition + lineHeight - 5 }, // Add some padding
      end: { x: xPositions.code + 70, y: yPosition + lineHeight - 5 },
      thickness: 1,
    });
    // Calculate the yPosition for the code and total table height dynamically
    const totalRows = data.length + 1; // Including the header row
    const tableHeight = totalRows * lineHeight;

    // Draw the "Code: 5/112" text in the last column for the third row
    const codeRowPosition = yPosition + 3 * lineHeight;
    page.drawText("Code: 5/112", {
      x: xPositions.code,
      y: codeRowPosition + lineHeight,
      size: fontSize,
    });

    // Draw table borders (vertical lines)
    page.drawLine({
      start: {
        x: xPositions.sr - 10,
        y: yPosition + lineHeight + tableHeight - 5,
      },
      end: { x: xPositions.sr - 10, y: yPosition + lineHeight - 5 },
      thickness: 1,
    }); // Left border
    page.drawLine({
      start: {
        x: xPositions.detail - 10,
        y: yPosition + tableHeight + lineHeight - 5,
      },
      end: { x: xPositions.detail - 10, y: yPosition + lineHeight - 5 },
      thickness: 1,
    }); // Detail column border
    page.drawLine({
      start: {
        x: xPositions.amount - 10,
        y: yPosition + tableHeight + lineHeight - 5,
      },
      end: { x: xPositions.amount - 10, y: yPosition + 2 * lineHeight - 5 },
      thickness: 1,
    }); // Amount column border
    page.drawLine({
      start: {
        x: xPositions.code - 10,
        y: yPosition + tableHeight + lineHeight - 5,
      },
      end: { x: xPositions.code - 10, y: yPosition + lineHeight - 5 },
      thickness: 1,
    }); // Code No. border
    page.drawLine({
      start: {
        x: xPositions.code + 70,
        y: yPosition + tableHeight + lineHeight - 5,
      },
      end: { x: xPositions.code + 70, y: yPosition + lineHeight - 5 },
      thickness: 1,
    }); // Rightmost border

    // // Draw the bottom border of the entire table
    // page.drawLine({
    //   start: { x: xPositions.sr - 10, y: yPosition },
    //   end: { x: xPositions.code + 70, y: yPosition },
    //   thickness: 1,
    // });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ChequeDepositForm.pdf";
    link.click();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the form?"
    );
    if (confirmSubmit) {
      console.log("Form Submitted:", formData);
      setFormData({
        receiptNo: "",
        year1st: "",
        year2nd: "",
        date: "",
        clientName: "",
        amount: "",
        amountInWords: "",
        chequeNo: "",
        chequeDate: "",
        accountNo: "",
        title: "",
        drccNo: "",
        consultancyCharges: "",
        invoiceNo: "",
      });

      setCalculatedData({
        cgst: 0,
        sgst: 0,
        totalInvoiceAmount: 0,
        tds: 0,
        netAmountReceived: 0,
      });
    }
  };

  const [formData, setFormData] = useState({
    receiptNo: "",
    year1st: "",
    year2nd: "",
    date: "",
    clientName: "",
    amount: "",
    amountInWords: "",
    chequeNo: "",
    chequeDate: "",
    accountNo: "",
    title: "",
    drccNo: "",
    consultancyCharges: "",
    invoiceNo: "",
  });

  const [calculatedData, setCalculatedData] = useState({
    cgst: 0,
    sgst: 0,
    totalInvoiceAmount: 0,
    tds: 0,
    netAmountReceived: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const consultancyCharges = parseFloat(formData.consultancyCharges) || 0;
    const amount = parseFloat(formData.amount) || 0;
    const cgst = consultancyCharges * 0.09;
    const sgst = consultancyCharges * 0.09;
    const totalInvoiceAmount = consultancyCharges + cgst + sgst + amount;
    const tds = totalInvoiceAmount * 0.1;
    const netAmountReceived = totalInvoiceAmount - tds;

    setCalculatedData({
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      totalInvoiceAmount: totalInvoiceAmount.toFixed(2),
      tds: tds.toFixed(2),
      netAmountReceived: netAmountReceived.toFixed(2),
    });
  }, [formData.consultancyCharges, formData.amount]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex">
        <div>
          <img
            src="../../../images/svnitLogo.png"
            alt="svnit logo"
            className="h-16 w-16 scale-150 mt-5"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center  mx-16">
            Sardar Vallabhbhai National Institute of Technology <br /> Surat -
            395007 (GUJARAT)
          </h1>
        </div>
      </div>
      <h2 className="text-lg font-medium text-center -mt-3 mb-3">
        Department of {departmentInfo.fullName}
      </h2>
      <h3 className="text-lg font-medium text-center mb-6 underline">
        Cheque Deposit Form
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-gray-800 font-semibold text-base mb-4 flex justify-between">
          <span>
            <span>No. {getDocPrefix()}/C-</span>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-18 mx-2"
              name="receiptNo"
              value={formData.receiptNo}
              onChange={handleInputChange}
              min="1"
              max="10000"
              placeholder="####"
              required
            />
            <span>/</span>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-14 mx-2"
              name="year1st"
              value={formData.year1st}
              onChange={handleInputChange}
              min="0"
              max="99"
              placeholder="24"
              required
            />
            <span>-</span>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-14 mx-2"
              name="year2nd"
              value={formData.year2nd}
              onChange={handleInputChange}
              min="0"
              max="99"
              placeholder="25"
              required
            />
          </span>
          <span>
            <span className="ml-20"> Date: </span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1 w-32 "
              placeholder="dd/mm/yyyy"
              required
            />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Client Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount in Words
            </label>
            <input
              type="text"
              name="amountInWords"
              value={formData.amountInWords}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cheque No.</label>
            <input
              type="text"
              name="chequeNo"
              value={formData.chequeNo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Cheque Date
            </label>
            <input
              type="date"
              name="chequeDate"
              value={formData.chequeDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">A/c No.</label>
            <input
              type="number"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Title of the Consultancy Assignment
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">DRCC No.</label>
            <input
              type="text"
              name="drccNo"
              value={formData.drccNo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 mt-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Sr. No.</th>
              <th className="border border-gray-300 p-2">Details</th>
              <th className="border border-gray-300 p-2">Amount (Rs.)</th>
              <th className="border border-gray-300 p-2">Code No.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">
                Consultancy Charges
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  name="consultancyCharges"
                  value={formData.consultancyCharges}
                  onChange={handleInputChange}
                  className="w-full p-1"
                  required
                />
              </td>
              <td className="border border-gray-300 p-2 " rowSpan={6}>
                Code: 5/112
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">2</td>
              <td className="border border-gray-300 p-2">Add. C.G.S.T. @ 9%</td>
              <td className="border border-gray-300 p-2">
                {calculatedData.cgst}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">3</td>
              <td className="border border-gray-300 p-2">Add. S.G.S.T. @ 9%</td>
              <td className="border border-gray-300 p-2">
                {calculatedData.sgst}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">4</td>
              <td className="border border-gray-300 p-2">
                Total Invoice Amount
              </td>
              <td className="border border-gray-300 p-2">
                {calculatedData.totalInvoiceAmount}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">5</td>
              <td className="border border-gray-300 p-2">(-) TDS @ 10%</td>
              <td className="border border-gray-300 p-2">
                {calculatedData.tds}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">6</td>
              <td className="border border-gray-300 p-2">
                Net Amount Received
              </td>
              <td className="border border-gray-300 p-2">
                {calculatedData.netAmountReceived}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">7</td>
              <td className="border border-gray-300 p-2">Invoice No.</td>
              <td className="border border-gray-300 p-2" colSpan="2">
                <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                  className="w-full p-1"
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className=" flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 mt-2 text-white px-4 py-2 rounded hover:bg-blue-600 mx-auto"
          >
            Submit
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChequeDepositForm;

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { ulid } from "ulid";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Spinner from "../spinner/Spinner";
const PaymentViewForm = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    receiptNo: "",
    date: "",
    projectNo: projectId,
    workName: "",
    clientName: "",
    pcName: "",
    totalAmount: "",
    previousAmount: "",
    invoiceNo: "",
    invoiceDate: "",
    basicAmount: "",
    cgst: "",
    sgst: "",
    igst: "",
    tds: "",
    tdsCgst: "",
    tdsSgst: "",
    tdsIgst: "",
    securityDeposit: "",
    retentionMoney: "",
    otherDeductions: "",
    paymentDate: "",
    remark: "",
  });

  useEffect(() => {
    async function fetchPaymentData() {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `form/paymentForm/${projectId}`,
          {},
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log(response);
        if (response) {
          setFormData({
            receiptNo: response.data.data.receiptNo,
            date: response.data.data.date,
            projectNo: projectId,
            workName: response.data.data.workName,
            clientName: response.data.data.clientName,
            pcName: response.data.data.pcName,
            totalAmount: response.data.data.previousAmount,
            previousAmount: response.data.data.previousAmount,
            invoiceNo: response.data.data.invoiceNo,
            invoiceDate: response.data.data.invoiceDate,
            basicAmount: response.data.data.basicAmount,
            cgst: response.data.data.cgst,
            sgst: response.data.data.sgst,
            igst: response.data.data.igst,
            tds: response.data.data.tds,
            tdsCgst: response.data.data.tdsCgst,
            tdsSgst: response.data.data.tdsSgst,
            tdsIgst: response.data.data.tdsIgst,
            securityDeposit: response.data.data.securityDeposit,
            retentionMoney: response.data.data.retentionMoney,
            otherDeductions: response.data.data.otherDeductions,
            paymentDate: response.data.data.paymentDate,
            remark: response.data.data.remark,
          });
        }
      } catch (err) {
        console.log(err, "in fetching payment data");
        setLoading(false);
      }
      setLoading(false);
    }
    fetchPaymentData();
  }, []);

  const handleDownloadPDF = async () => {
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

    page.drawText("Payment Receipt Approval Note", {
      x: 190,
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
        x: 265,
        y,
        size: fontSize,
        font: font,
      });
    };

    let yPosition = height - 150;
    const lineHeight = 25;

    drawField("Receipt No:", `${formData.receiptNo}`, yPosition);
    yPosition -= lineHeight;
    drawField("Date:", formData.date, yPosition);
    yPosition -= lineHeight;
    drawField("1. Consultancy Project No.:", formData.projectNo, yPosition);
    yPosition -= lineHeight;
    drawField(" 2. Name of Work:", formData.workName, yPosition);
    yPosition -= lineHeight;
    drawField("3. Name of Client:", formData.clientName, yPosition);
    yPosition -= lineHeight;
    drawField("4. Name of Project Consultant:", formData.pcName, yPosition);
    yPosition -= lineHeight;
    drawField("5. Total Consultancy Amount:", formData.totalAmount, yPosition);
    yPosition -= lineHeight;
    drawField(
      "6. Previous Received Amount:",
      formData.previousAmount,
      yPosition
    );
    yPosition -= lineHeight;
    drawField("7. Account Code No:", "5/112", yPosition);
    yPosition -= lineHeight;
    drawField("8.a. Invoice No. & Date:", formData.invoiceNo, yPosition);
    yPosition -= lineHeight;
    drawField("8.b. Invoice Date:", formData.invoiceDate, yPosition);
    yPosition -= lineHeight;
    drawField("9. Basic Amount:", formData.cgst, yPosition);
    yPosition -= lineHeight;
    drawField("10. C.G.S.T. @ 9%:", formData.sgst, yPosition);
    yPosition -= lineHeight;
    drawField("11. S.G.S.T. @ 9%:", formData.totalAmount, yPosition);
    yPosition -= lineHeight;
    drawField("12. I.G.S.T. @ 18%:", formData.igst, yPosition);
    yPosition -= lineHeight;
    drawField(
      "13. Total Invoice Amount:",
      (
        parseFloat(formData.basicAmount) +
        parseFloat(formData.cgst) +
        parseFloat(formData.sgst)
      ).toFixed(2),
      yPosition
    );
    yPosition -= lineHeight;
    drawField("14. Less: Tax Deducted at Source:", formData.tds, yPosition);
    yPosition -= lineHeight;
    drawField("15. Less: T.D.S. on C.G.S.T:", formData.tdsCgst, yPosition);
    yPosition -= lineHeight;
    drawField("16. Less: T.D.S. on S.G.S.T:", formData.tdsSgst, yPosition);
    yPosition -= lineHeight;
    drawField("17. Less: T.D.S. on I.G.S.T:", formData.tdsIgst, yPosition);
    yPosition -= lineHeight;
    drawField(
      "18. Less: Security Deposit:",
      formData.securityDeposit,
      yPosition
    );
    yPosition -= lineHeight;
    drawField("19. Less: Retention Money:", formData.retentionMoney, yPosition);
    yPosition -= lineHeight;
    drawField(
      "20. Less: Other Deductions (If Any):",
      formData.otherDeductions,
      yPosition
    );
    yPosition -= lineHeight;
    drawField(
      "21. Net Amount Received:",
      (
        parseFloat(formData.basicAmount) +
        parseFloat(formData.cgst) +
        parseFloat(formData.sgst) -
        parseFloat(formData.tds) -
        parseFloat(formData.tdsCgst) -
        parseFloat(formData.tdsSgst) -
        parseFloat(formData.tdsIgst) -
        parseFloat(formData.securityDeposit) -
        parseFloat(formData.retentionMoney) -
        parseFloat(formData.otherDeductions)
      ).toFixed(2),
      yPosition
    );
    yPosition -= lineHeight;
    drawField("22. Date of Payment Received:", formData.paymentDate, yPosition);
    yPosition -= lineHeight;
    drawField("23. Remark (if any):", formData.remark, yPosition);
    yPosition -= lineHeight;

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PaymentReceiptForm.pdf";
    link.click();
  };

  useEffect(() => {
    const basicAmount = parseFloat(formData.basicAmount) || 0;
    const cgst = basicAmount * 0.09;
    const sgst = basicAmount * 0.09;
    const igst = basicAmount * 0.18;

    setFormData((prevData) => ({
      ...prevData,
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
    }));
  }, [formData.basicAmount]);
  if (loading) {
    return <Spinner text={"Preparing your dashboard..."} />;
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex">
        <div>
          <img
            src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
            alt="svnit logo"
            className="h-16 w-16 scale-150 mt-5"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center mb-6 mx-12">
            Sardar Vallabhbhai National Institute of Technology <br /> Surat -
            395007 (GUJARAT)
          </h1>
          {/* <h3 className="text-xl font-semibold text-center mb-6 -mt-4">
            Department of {departmentInfo.fullName}
          </h3> */}
        </div>
      </div>

      <h3 className="text-xl font-medium text-center mb-6 underline">
        Payment Receipt Approval Note
      </h3>
      <form className="space-y-4">
        <div className="text-gray-800 flex justify-between font-semibold text-base mb-4">
          {/* <span>No. {getDocPrefix()}/Payment Receipt/C-</span> */}
          <div>
            <span>Receipt No: </span>
            {/* <span>No. DoCE/AKD/Cons/Payment Receipt/C-</span> */}
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-72 mx-2"
              name="receiptNo"
              value={formData.receiptNo}
              readOnly
            />
          </div>
          <div>
            <span className="mx-5"> Date: </span>
            <input
              type="date"
              name="date"
              value={formData.date}
              readOnly
              className="border border-gray-300 rounded px-2 py-1 w-32 mx-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              1. Consultancy Project No.
            </label>
            <input
              type="text"
              name="projectNo"
              value={formData.projectNo}
              readOnly
              className="w-full p-2 border rounded text-gray-500 bold"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              2. Name of Work
            </label>
            <input
              type="text"
              name="workName"
              value={formData.workName}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              3. Name of Client
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              4. Name of Project Consultant
            </label>
            <input
              type="text"
              name="pcName"
              value={formData.pcName}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              5. Total Consultancy Amount
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              6. Previous Received Amount
            </label>
            <input
              type="number"
              name="previousAmount"
              value={formData.previousAmount}
              readOnly
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              7. Account Code No.
            </label>
            <input
              type="text"
              value="5/112"
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              8. Invoice No. & Date
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                readOnly
                className="w-1/2 p-2 border rounded"
                placeholder="Invoice No."
              />
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                readOnly
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              9. Basic Amount
            </label>
            <input
              type="number"
              name="basicAmount"
              value={formData.basicAmount}
              readOnly
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              10. C.G.S.T. @ 9%
            </label>
            <input
              type="text"
              value={formData.cgst}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              11. S.G.S.T. @ 9%
            </label>
            <input
              type="text"
              value={formData.sgst}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              12. I.G.S.T. @ 18%
            </label>
            <input
              type="text"
              value={formData.igst}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              13. Total Invoice Amount
            </label>
            <input
              type="text"
              value={(
                parseFloat(formData.basicAmount) +
                parseFloat(formData.cgst) +
                parseFloat(formData.sgst)
              ).toFixed(2)}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              14. Less: Tax Deducted at Source
            </label>
            <input
              type="number"
              name="tds"
              value={formData.tds}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              15. Less: T.D.S. on C.G.S.T.
            </label>
            <input
              type="number"
              name="tdsCgst"
              value={formData.tdsCgst}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              16. Less: T.D.S. on S.G.S.T.
            </label>
            <input
              type="number"
              name="tdsSgst"
              value={formData.tdsSgst}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              17. Less: T.D.S. on I.G.S.T.
            </label>
            <input
              type="number"
              name="tdsIgst"
              value={formData.tdsIgst}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              18. Less: Security Deposit
            </label>
            <input
              type="number"
              name="securityDeposit"
              value={formData.securityDeposit}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              19. Less: Retention Money
            </label>
            <input
              type="number"
              name="retentionMoney"
              value={formData.retentionMoney}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              20. Less: Other Deductions (If Any else 0)
            </label>
            <input
              type="number"
              name="otherDeductions"
              value={formData.otherDeductions}
              readOnly
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              21. Net Amount Received
            </label>
            <input
              type="text"
              value={(
                parseFloat(formData.basicAmount) +
                parseFloat(formData.cgst) +
                parseFloat(formData.sgst) -
                parseFloat(formData.tds) -
                parseFloat(formData.tdsCgst) -
                parseFloat(formData.tdsSgst) -
                parseFloat(formData.tdsIgst) -
                parseFloat(formData.securityDeposit) -
                parseFloat(formData.retentionMoney) -
                parseFloat(formData.otherDeductions)
              ).toFixed(2)}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              22. Date of Payment Received
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            23. Remark (if any)
          </label>
          <textarea
            name="remark"
            value={formData.remark}
            readOnly
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>
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

export default PaymentViewForm;

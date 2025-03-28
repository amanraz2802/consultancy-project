import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useParams } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const BillFormView = () => {
  const { projectId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    projectId: projectId,
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
        qty: "0",
        rate: "0",
        amount: "0",
        taxableValue: "0",
        cgst: "0",
        sgst: "0",
        igst: "0",
        total: "0",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `form/billForm/${projectId}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (response && response.data) {
          setFormData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching bill details:", error);
        toast.error("Failed to fetch bill details");
        setIsLoading(false);
      }
    };

    fetchBillDetails();
  }, [projectId, token]);

  // Reuse the PDF generation function from the previous component
  async function generateInvoicePDF(formData) {
    // ... (keep the existing generateInvoicePDF function from the previous component)
    // Note: This function remains exactly the same as in the previous implementation
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
      toast.error("Failed to generate PDF");
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

  const handleDownload = async () => {
    try {
      await handlePDFDownload(formData);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading bill details...</p>
      </div>
    );
  }

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

      <div className="mt-6">
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
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
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
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Items section */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Items</h3>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-1">Description:</label>
                    <textarea
                      value={item.description}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                      rows="2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm mb-1">SAC Code:</label>
                    <input
                      type="text"
                      value={item.sacCode.toString()}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Quantity:</label>
                    <input
                      type="number"
                      value={item.qty.toString()}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Rate (Rs.):</label>
                    <input
                      type="number"
                      value={item.rate.toString()}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Amount:</label>
                    <input
                      type="number"
                      value={item.amount.toString()}
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
              <span>Rs.{totals.amount.toFixed(2).toString()}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%):</span>
              <span>Rs.{totals.cgst.toFixed(2).toString()}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%):</span>
              <span>Rs.{totals.sgst.toFixed(2).toString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Grand Total:</span>
              <span>Rs.{totals.total.toFixed(2).toString()}</span>
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

        {/* Download Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <FiDownload className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillFormView;

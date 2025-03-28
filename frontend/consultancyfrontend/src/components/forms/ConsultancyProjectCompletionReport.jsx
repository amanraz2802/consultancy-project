import React, { useState, useEffect } from "react";
import Spinner from "../spinner/Spinner";
const ConsultancyProjectCompletionReport = () => {
  const [formData, setFormData] = useState({
    consultancyProjectNo: "",
    nameOfWork: "",
    nameOfPI: "",
    departmentSection: "",
    objectivesAchieved: "",
    objectivesUnfulfilled: "",
    manpowerAssociatedFrom: "",
    manpowerAssociatedTo: "",
    manpowerHiredFrom: "",
    manpowerHiredTo: "",
    publicationsPublished: "",
    patentsFiled: "",
    researchStudents: [],
    pendingAdvances: "", // Changed from boolean to string for radio buttons
    disbursementsComplete: "", // Changed from boolean to string for radio buttons
    finalReportAttached: false,
  });

  // Add the missing payments state
  const [payments, setPayments] = useState([
    {
      receiptNo: "",
      date: "",
      basicFee: 0,
      cgst: 0,
      sgst: 0,
      totalBillAmount: 0,
      proposedAmount: 0,
      tds: 0,
      sd: 0,
      netPaymentReceived: 0,
    },
  ]);

  const [paymentData, setPaymentData] = useState({
    receiptNo: "",
    date: "",
    basicFee: 0,
    cgst: 0,
    sgst: 0,
    totalBillAmount: 0,
    proposedAmount: 0,
    tds: 0,
    sd: 0,
    netPaymentReceived: 0,
  });

  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/consultancy-project");
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          consultancyProjectNo: data.consultancyProjectNo,
          nameOfWork: data.nameOfWork,
          nameOfPI: data.nameOfPI,
          departmentSection: data.departmentSection,
        }));

        if (data.payments && data.payments.length > 0) {
          setPayments(data.payments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddStudent = () => {
    setFormData((prevData) => ({
      ...prevData,
      researchStudents: [
        ...prevData.researchStudents,
        { name: "", studentId: "", type: "" },
      ],
    }));
  };

  const handleRemoveStudent = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      researchStudents: prevData.researchStudents.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleResearchStudentChange = (index, field, value) => {
    setFormData((prevData) => {
      const newResearchStudents = [...prevData.researchStudents];
      newResearchStudents[index] = {
        ...newResearchStudents[index],
        [field]: value,
      };
      return { ...prevData, researchStudents: newResearchStudents };
    });
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFileUploaded(true);
      // setFormData((prevData) => ({ ...prevData, finalReportAttached: true }));
    } else {
      setFileUploaded(false);
      // setFormData((prevData) => ({ ...prevData, finalReportAttached: false }));
    }
  };

  const handleAddPayment = () => {
    setPayments([
      ...payments,
      {
        receiptNo: "",
        date: "",
        basicFee: 0,
        cgst: 0,
        sgst: 0,
        totalBillAmount: 0,
        proposedAmount: 0,
        tds: 0,
        sd: 0,
        netPaymentReceived: 0,
      },
    ]);
  };

  const handleRemovePayment = (indexToRemove) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, index) => index !== indexToRemove));
    }
  };

  const handlePaymentChange = (index, field, value) => {
    const newPayments = [...payments];
    newPayments[index] = {
      ...newPayments[index],
      [field]: value,
      totalBillAmount: calculateTotalBillAmount(
        newPayments[index],
        field,
        value
      ),
      netPaymentReceived: calculateNetPaymentReceived(
        newPayments[index],
        field,
        value
      ),
    };
    setPayments(newPayments);
  };

  const calculateTotalBillAmount = (payment, field, value) => {
    const basicFee =
      field === "basicFee" ? Number(value) : Number(payment.basicFee);
    const cgst = field === "cgst" ? Number(value) : Number(payment.cgst);
    const sgst = field === "sgst" ? Number(value) : Number(payment.sgst);
    return basicFee + cgst + sgst;
  };

  const calculateNetPaymentReceived = (payment, field, value) => {
    const totalBill = payment.totalBillAmount;
    const tds = field === "tds" ? Number(value) : Number(payment.tds);
    const sd = field === "sd" ? Number(value) : Number(payment.sd);
    return totalBill - tds - sd;
  };

  const getTotalNetPaymentReceived = () => {
    return payments.reduce(
      (sum, payment) => sum + Number(payment.netPaymentReceived),
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to submit the form?")) {
      console.log("Form submitted:", { ...formData, payments });
      // Add your form submission logic here
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <header className="max-w-6xl mx-auto p-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://res.cloudinary.com/dpyurrpfa/image/upload/v1742117068/ry46xbwnlh1qttam6inp.png"
              alt="SVNIT Logo"
              className="h-20 w-20 scale-150"
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
                Form-CP-1.3-Consultancy Project Completion Report
              </h3>
            </div>
          </div>
          <div className="text-5xl font-bold transform -rotate-90 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            SVNIT
          </div>
        </div>
      </header>
      <h1 className="text-2xl font-bold mb-6 text-center underline">
        CLOSURE REPORT
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Date
            </label>
          </div>
          <div>
            <input
              type="text"
              value={formatDate(new Date())}
              readOnly
              className=" block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Consultancy Project No.
          </label>
          <input
            type="text"
            value={formData.consultancyProjectNo}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name of Work
          </label>
          <input
            type="text"
            value={formData.nameOfWork}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name of Person Involved
          </label>
          <input
            type="text"
            value={formData.nameOfPI}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Department/Section
          </label>
          <input
            type="text"
            value={formData.departmentSection}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Total Payments Received (INR)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(paymentData).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type="number"
                  value={value}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            ))}
          </div>
        </div> */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Total Payments Received (INR)
            </h2>
            <button
              type="button"
              onClick={handleAddPayment}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Add Payment
            </button>
          </div>

          {payments.map((payment, index) => (
            <div
              key={index}
              className="mb-6 p-4 border rounded-lg bg-gray-50 relative"
            >
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border rounded-lg bg-gray-50 relative"
                >
                  {payments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePayment(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Receipt No.
                      </label>
                      <input
                        type="text"
                        value={payment.receiptNo}
                        onChange={(e) =>
                          handlePaymentChange(
                            index,
                            "receiptNo",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        value={payment.date}
                        onChange={(e) =>
                          handlePaymentChange(index, "date", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Basic Fee
                      </label>
                      <input
                        type="number"
                        value={payment.basicFee}
                        onChange={(e) =>
                          handlePaymentChange(index, "basicFee", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CGST
                      </label>
                      <input
                        type="number"
                        value={payment.cgst}
                        onChange={(e) =>
                          handlePaymentChange(index, "cgst", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        SGST
                      </label>
                      <input
                        type="number"
                        value={payment.sgst}
                        onChange={(e) =>
                          handlePaymentChange(index, "sgst", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Bill Amount
                      </label>
                      <input
                        type="number"
                        value={payment.totalBillAmount}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Proposed Amount
                      </label>
                      <input
                        type="number"
                        value={payment.proposedAmount}
                        onChange={(e) =>
                          handlePaymentChange(
                            index,
                            "proposedAmount",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        TDS
                      </label>
                      <input
                        type="number"
                        value={payment.tds}
                        onChange={(e) =>
                          handlePaymentChange(index, "tds", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        SD
                      </label>
                      <input
                        type="number"
                        value={payment.sd}
                        onChange={(e) =>
                          handlePaymentChange(index, "sd", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Net Payment Received
                      </label>
                      <input
                        type="number"
                        value={payment.netPaymentReceived}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-semibold">
              Total Net Amount Received: ₹
              {getTotalNetPaymentReceived().toFixed(2)}
            </p>
            <p className="mt-2">
              100% Net Amount ₹{getTotalNetPaymentReceived().toFixed(2)}/- is
              distributed (after deducting G.S.T. / Expenditure and add GST TDS)
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Objectives Achieved
          </label>
          <textarea
            name="objectivesAchieved"
            value={formData.objectivesAchieved}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Objectives Unfulfilled
          </label>
          <textarea
            name="objectivesUnfulfilled"
            value={formData.objectivesUnfulfilled}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Associated From
            </label>
            <input
              type="date"
              name="manpowerAssociatedFrom"
              value={formData.manpowerAssociatedFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Associated To
            </label>
            <input
              type="date"
              name="manpowerAssociatedTo"
              value={formData.manpowerAssociatedTo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Hired From
            </label>
            <input
              type="date"
              name="manpowerHiredFrom"
              value={formData.manpowerHiredFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manpower Hired To
            </label>
            <input
              type="date"
              name="manpowerHiredTo"
              value={formData.manpowerHiredTo}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Distribution of Payments Received
          </h2>
          <p>Total Amount Net Received: Rs. {paymentData.netPaymentReceived}</p>
          <p>
            100% Net Amount Rs. {paymentData.netPaymentReceived}/- is
            distributed (after deducting G.S.T. / Expenditure and add GST TDS)
          </p>
        </div> */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Publications / Patents</h2>
          <div>
            <label className="block mb-2">Publications Published:</label>
            <div className="ml-8">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="publicationsPublished"
                  value="yes"
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="publicationsPublished"
                  value="no"
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block mb-2">Patents Filed:</label>
            <div className="ml-8">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="patentsFiled"
                  value="yes"
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="patentsFiled"
                  value="no"
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Research Students Supported
            </h2>
            <button
              type="button"
              onClick={handleAddStudent}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Add Student
            </button>
          </div>

          {formData.researchStudents.map((student, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-lg bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveStudent(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Student {index + 1} Name:
                  </label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) =>
                      handleResearchStudentChange(index, "name", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter student name"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Student ID:
                  </label>
                  <input
                    type="text"
                    value={student.studentId}
                    onChange={(e) =>
                      handleResearchStudentChange(
                        index,
                        "studentId",
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter student ID"
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Type:
                </label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`studentType${index}`}
                      value="Research Scholar"
                      checked={student.type === "Research Scholar"}
                      onChange={(e) =>
                        handleResearchStudentChange(
                          index,
                          "type",
                          e.target.value
                        )
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Research Scholar</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`studentType${index}`}
                      value="M.Tech Student"
                      checked={student.type === "M.Tech Student"}
                      onChange={(e) =>
                        handleResearchStudentChange(
                          index,
                          "type",
                          e.target.value
                        )
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">M.Tech Student</span>
                  </label>
                </div>
              </div>
            </div>
          ))}

          {formData.researchStudents.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No research students added. Click the "Add Student" button to add
              students.
            </p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Statements</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are there any pending advances?
            </label>
            <div className="space-x-4 ml-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="pendingAdvances"
                  value="yes"
                  checked={formData.pendingAdvances === "yes"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="pendingAdvances"
                  value="no"
                  checked={formData.pendingAdvances === "no"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are all the disbursements and expenditure complete?
            </label>
            <div className="space-x-4 ml-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="disbursementsComplete"
                  value="yes"
                  checked={formData.disbursementsComplete === "yes"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="disbursementsComplete"
                  value="no"
                  checked={formData.disbursementsComplete === "no"}
                  onChange={handleInputChange}
                  className="form-radio text-cyan-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Final Report</h2>
          <label className="flex items-center">
            <input
              type="file"
              onChange={handleFileUpload}
              className="form-input"
            />
          </label>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              name="finalReportAttached"
              checked={formData.finalReportAttached}
              onChange={handleInputChange}
              className="form-checkbox"
              // disabled={true}
            />
            <span className="ml-2">
              A Copy of the Final Report submitted to the Client, duly
              counter-signed by the Dean (R&C) is attached herewith.
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ConsultancyProjectCompletionReport;

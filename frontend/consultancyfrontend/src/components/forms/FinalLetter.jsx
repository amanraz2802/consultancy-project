import React, { useState, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const FinalLetter = () => {
  const handleDownloadPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { width, height } = page.getSize();
      const fontSize = 12;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

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
        font: boldFont,
      });

      page.drawText(
        "(An Institute of National Importance, Established under NITSER Act by",
        {
          x: 150,
          y: height - 100,
          size: 10,
          font: italicFont,
        }
      );

      page.drawText("Ministry of Education, Govt. of India)", {
        x: 220,
        y: height - 115,
        size: 10,
        font: italicFont,
      });
      // font.italic = false;
      // Add horizontal line
      page.drawLine({
        start: { x: 50, y: height - 140 },
        end: { x: width - 50, y: height - 140 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      // Add project ID and date
      page.drawText(`Project Id:`, {
        x: 50,
        y: height - 170,
        size: fontSize,
        font: boldFont,
      });

      page.drawText(`${formData.projectNumber} `, {
        x: 115,
        y: height - 170,
        size: fontSize,
        font: font,
      });

      page.drawText(`Date:`, {
        x: width - 200,
        y: height - 170,
        size: fontSize,
        font: boldFont,
      });
      page.drawText(`${new Date().toLocaleDateString()}`, {
        x: width - 200 + 35,
        y: height - 170,
        size: fontSize,
        font: font,
      });

      // Add recipient details
      let yPos = height - 220;

      page.drawText("To:", {
        x: 50,
        y: yPos,
        size: fontSize,
        font: boldFont,
      });

      yPos -= 20;

      page.drawText(toName, {
        x: 50,
        y: yPos,
        size: fontSize,
        font: font,
      });

      // Handle multi-line address
      const addressLines = splitTextToLines(toAddress, 60);
      for (const line of addressLines) {
        yPos -= 20;
        page.drawText(line, {
          x: 50,
          y: yPos,
          size: fontSize,
          font: font,
        });
      }

      yPos -= 20;
      page.drawText(toPincode, {
        x: 50,
        y: yPos,
        size: fontSize,
        font: font,
      });

      // Add subject with wrapping
      yPos -= 40;
      page.drawText("Sub:", {
        x: 50,
        y: yPos,
        size: fontSize,
        font: boldFont,
      });

      // Handle multi-line subject
      const subjectLines = splitTextToLines(sub, 70, { startX: 90 });
      for (let i = 0; i < subjectLines.length; i++) {
        const line = subjectLines[i];
        const xPos = i === 0 ? 90 : 50; // First line starts after "Sub:", subsequent lines are indented
        page.drawText(line, {
          x: xPos,
          y: yPos,
          size: fontSize,
          font: font,
        });
        yPos -= 20;
      }

      // Add reference with wrapping
      yPos -= 20;
      page.drawText("Reference:", {
        x: 50,
        y: yPos,
        size: fontSize,
        font: boldFont,
      });

      // Handle multi-line reference
      const referenceLines = splitTextToLines(reference, 65, { startX: 120 });
      for (let i = 0; i < referenceLines.length; i++) {
        const line = referenceLines[i];
        const xPos = i === 0 ? 120 : 50; // First line starts after "Reference:", subsequent lines are indented
        page.drawText(line, {
          x: xPos,
          y: yPos,
          size: fontSize,
          font: font,
        });
        yPos -= 20;
      }

      // Add salutation
      yPos -= 20;
      page.drawText("Dear Sir,", {
        x: 50,
        y: yPos,
        size: fontSize,
        font: font,
      });

      // Add main subject with word wrap
      yPos -= 30;
      page.drawText("With reference to the above subject:", {
        x: 50,
        y: yPos,
        size: fontSize,
        font: boldFont,
      });

      yPos -= 20;
      const mainSubjectLines = splitTextToLines(mainSubject, 80);
      for (const line of mainSubjectLines) {
        page.drawText(line, {
          x: 50,
          y: yPos,
          size: fontSize,
          font: font,
        });
        yPos -= 20;
      }

      // Add certification text
      yPos -= 20;
      const certificationText =
        "It is certified that this work has been completed in confirmation to the requirement and specification and satisfactory compliance of queries raised during the site visit of SVNIT officials. The work is completed satisfactorily.";
      const certificationLines = splitTextToLines(certificationText, 80);
      for (const line of certificationLines) {
        page.drawText(line, {
          x: 50,
          y: yPos,
          size: fontSize,
          font: font,
        });
        yPos -= 20;
      }

      // Add closing
      yPos -= 20;
      page.drawText("Thanking You", {
        x: 50,
        y: yPos,
        size: fontSize,
        font: boldFont,
      });

      // Enhanced splitTextToLines function
      function splitTextToLines(text, maxCharsPerLine, options = {}) {
        if (!text) return [];

        const words = text.split(" ");
        const lines = [];
        let currentLine = "";
        let currentLineWidth = 0;
        const startX = options.startX || 50;
        const availableWidth = width - startX - 50; // 50px margin on right

        for (const word of words) {
          const wordWidth = font.widthOfTextAtSize(word + " ", fontSize);

          if (currentLineWidth + wordWidth <= availableWidth) {
            currentLine += (currentLine.length === 0 ? "" : " ") + word;
            currentLineWidth += wordWidth;
          } else {
            lines.push(currentLine);
            currentLine = word;
            currentLineWidth = wordWidth;
          }
        }

        if (currentLine.length > 0) {
          lines.push(currentLine);
        }

        return lines;
      }

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Create download link
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `FinalLetter_${formData.projectNumber}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Utility function to split text into lines
  const splitTextToLines = (text, maxCharsPerLine) => {
    if (!text) return [];
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
        currentLine += (currentLine.length === 0 ? "" : " ") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    return lines;
  };
  const [formData, setFormData] = useState({
    address: "",
    projectNumber: "",
    subject: "",
    reference: "",
    drccNumber: "",
    signature: "",
  });
  const [mainSubject, setMainSubject] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toPincode, setToPincode] = useState("");
  const [sub, setSub] = useState("");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the data from the backend when the component mounts
    fetch("/api/acknowledgment-data")
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          ...formData,
          address: data.address,
          projectNumber: data.projectNumber,
          subject: data.subject,
          reference: data.reference,
          drccNumber: data.drccNumber,
          signature: data.signature,
        });
        setMainSubject(data.mainSubject || "");
        setToName(data.toName || "Executive Engineer");
        setToAddress(data.toAddress || "");
        setToPincode(data.toPincode || "");
        setSub(data.subject || "");
        setReference(data.reference || "");
      });
  }, []);

  const handleMainSubjectChange = (e) => {
    setMainSubject(e.target.value);
  };

  const handleToNameChange = (e) => {
    setToName(e.target.value);
  };

  const handleToAddressChange = (e) => {
    setToAddress(e.target.value);
  };

  const handleToPincodeChange = (e) => {
    setToPincode(e.target.value);
  };

  const handleSubChange = (e) => {
    setSub(e.target.value);
  };

  const handleReferenceChange = (e) => {
    setReference(e.target.value);
  };

  const handleSubmit = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to submit this letter? Please verify all details before confirming."
    );

    if (isConfirmed) {
      try {
        setIsSubmitting(true);
        // Prepare the data to be submitted
        const submitData = {
          ...formData,
          mainSubject,
          toName,
          toAddress,
          toPincode,
          sub,
          reference,
        };

        // Make the API call to submit the form
        const response = await fetch("/api/submit-letter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        if (response.ok) {
          alert("Letter submitted successfully!");
          // Optionally redirect or clear form
        } else {
          throw new Error("Failed to submit letter");
        }
      } catch (error) {
        alert("Error submitting letter. Please try again.");
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
              <p className="text-md italic leading-tight text-center">
                (An Institute of National Importance, Established under NITSER
                Act by Ministry of
                <br /> Education, Govt. of India)
              </p>
            </div>
          </div>
          <div className="text-5xl font-bold transform -rotate-90 absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            SVNIT
          </div>
        </div>
      </header>
      <hr className="border-0 h-1 w-xl bg-gray-700 my-8" />
      <div className="flex justify-between">
        <div className="flex ">
          <label className=" text-md font-medium mr-4 mt-1">Project Id</label>
          <input
            type="text"
            // change it
            value={formData.consultancyProjectNo}
            readOnly
            className=" block  px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div className="mb-4">
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </div>
      </div>
      {/* Input fields for admin */}
      <div className="mb-4 mt-4">
        <strong>To (Name):</strong>
        <input
          type="text"
          value={toName}
          onChange={handleToNameChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
          placeholder="Enter recipient name"
        />
      </div>

      <div className="mb-4">
        <strong>To (Address):</strong>
        <textarea
          value={toAddress}
          onChange={handleToAddressChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
          rows="2"
          placeholder="Enter address"
        />
      </div>

      <div className="mb-4">
        <strong>To (Pincode):</strong>
        <input
          type="text"
          value={toPincode}
          onChange={handleToPincodeChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
          placeholder="Enter pincode"
        />
      </div>

      <div className="mb-4">
        <strong>Sub:</strong>
        <input
          type="text"
          value={sub}
          onChange={handleSubChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
          placeholder="Enter subject"
        />
      </div>

      <div className="mb-4">
        <strong>Reference:</strong>
        <input
          type="text"
          value={reference}
          onChange={handleReferenceChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
          placeholder="Enter reference"
        />
      </div>

      {/* Letter Content */}

      {/* <p className="mb-4">
        <strong>To:</strong>
        <br />
        {toName}
        <br />
        {toAddress}
        <br />
        {toPincode}
      </p>

      <p className="mb-4">
        <strong>Sub:</strong> {sub}
      </p>

      <p className="mb-4">
        <strong>Reference:</strong> {reference}
      </p> */}

      <p className="mb-4">Dear Sir,</p>

      <p className="mb-4">
        <strong>With reference to the above subject:</strong>
        <br />
        <textarea
          value={mainSubject}
          onChange={handleMainSubjectChange}
          className="w-full border border-gray-300 rounded p-2 mt-2"
          rows="4"
          placeholder="Write the main subject here..."
        />
      </p>

      <p className="mb-4">
        It is certified that this work has been completed in confirmation to the
        requirement and specification and satisfactory compliance of queries
        raised during the site visit of SVNIT officials. The work is completed
        satisfactorily.
      </p>

      <p className="mb-4">Thanking You</p>

      {/* Signature Block */}
      {/* <div className="my-8">
        <div className="flex justify-between">
          <div>
            <img
              src={formData.signature}
              alt="Digital Signature"
              className="h-16"
            />
          </div>
          <div>
            <img
              src={formData.signature}
              alt="Digital Signature"
              className="h-16"
            />
          </div>
        </div>
      </div>

      <p className="mb-4 text-center">
        <strong>Forwarded through:</strong>
      </p> */}

      {/* Department Head Signature */}
      {/* <div className="flex justify-between mt-10">
        <div>
          <p>
            <strong>DRCC Regi. No:</strong> {formData.drccNumber}
          </p>
          <p className="mt-4 text-sm">Copy of Dean R & C</p>
        </div>
        <div>
          <img src={formData.signature} alt="Head Signature" className="h-16" />
        </div>
      </div> */}
      {/* Add Submit Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Letter</span>
            </>
          )}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-cyan-900 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default FinalLetter;

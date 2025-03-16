import React from "react";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { SiGoogleforms } from "react-icons/si";
import { FaCircleNotch } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useState } from "react";
// import { use } from "react";
import styles from "./form.module.css";
import ProjectTable from "../../pages/ProjectTable";

function FindForms() {
  //date, forms, formstatus, projectstatus
  const [dateopen, setDateopen] = useState(false);
  const [formopen, setFormopen] = useState(false);
  const [formstatusopen, setFormstatusopen] = useState(false);
  const [projectstatusopen, setProjectstatusopen] = useState(false);
  const [dateMode, setDateMode] = useState("");
  const [fdate, setfdate] = useState(null);
  const [ldate, setldate] = useState(null);

  return (
    <div className="px-4 lg:px-10">
      <h2 className="font-semibold text-lg mt-16">Find forms:</h2>
      <div className="grid grid-cols-4 gap-3 mt-4 lg:w-[60%]">
        <div className="relative">
          <div
            className={`border border-black p-1 rounded-xl bg-[#cfd7e0] px-2 flex items-center `}
            onClick={() => {
              setDateopen(!dateopen);
            }}
          >
            <BsCalendarDateFill className="mr-2" />
            Date
            <IoMdArrowDropdown className="ml-auto" size={18} />
          </div>
          <div>
            {dateopen && (
              <div
                className={`${styles.dropdown} absolute top-10 left-0 border-black rounded-xl border-[1px]  w-[100%]  flex flex-col justify-center items-center`}
              >
                {["10-days", "1-month", "6-months", "by-date"].map(
                  (value, index) => (
                    <div
                      key={index}
                      className={`text-center w-full ${
                        index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                      } ${styles.filter}`}
                      onClick={() => setDateMode(value)}
                    >
                      {value}
                    </div>
                  )
                )}
                {dateMode === "by-date" && (
                  <div className={`${styles.date}`}>
                    <div>
                      <label htmlFor="fdate" className={`block mb-1`}>
                        From:
                      </label>
                      <input
                        type="date"
                        id="fdate"
                        name="fdate"
                        value={fdate}
                        onChange={(e) => setfdate(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="ldate" className="block mb-1">
                        To:
                      </label>
                      <input
                        type="date"
                        id="ldate"
                        name="ldate"
                        value={ldate}
                        onChange={(e) => setldate(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* <div className="relative">
          <div
            className="border border-black p-1 rounded-xl bg-[#cfd7e0] px-2 flex items-center "
            onClick={() => {
              setFormstatusopen(!formstatusopen);
            }}
          >
            <FaCircleNotch className="mr-2" />
            Form Status
            <IoMdArrowDropdown className="ml-auto" size={18} />
          </div>
          <div>
            {formstatusopen && (
              <div className="absolute top-10 left-0 border-black rounded-xl border-[1px]  w-[100%]  flex flex-col justify-center items-center">
                {["Accepted", "In-progress", "Rejected"].map((value, index) => (
                  <div
                    key={index}
                    className={`text-center w-full ${
                      index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                    } ${styles.filter}`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}
        <div className="relative">
          <div
            className="border border-black p-1 rounded-xl bg-[#cfd7e0] px-2 flex items-center "
            onClick={() => {
              setProjectstatusopen(!projectstatusopen);
            }}
          >
            <IoCheckmarkDoneCircle className="mr-2" />
            Project Status
            <IoMdArrowDropdown className="ml-auto" size={18} />
          </div>
          <div>
            {projectstatusopen && (
              <div className="absolute top-10 left-0 border-black rounded-xl border-[1px]  w-[100%]  flex flex-col justify-center items-center">
                {["Completed", "Ongoing", "Rejected"].map((value, index) => (
                  <div
                    key={index}
                    className={`text-center w-full ${
                      index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                    } ${styles.filter}`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <div
            className="border border-black p-1 rounded-xl w-[130%] bg-[#cfd7e0] px-2 flex items-center "
            onClick={() => {
              setFormopen(!formopen);
            }}
          >
            <SiGoogleforms className="mr-2" />
            Department
            <IoMdArrowDropdown className="ml-auto" size={18} />
          </div>
          <div>
            {formopen && (
              <div className="absolute top-10 left-0 border-black rounded-xl border-[1px]  w-[160%]  flex flex-col justify-center items-center">
                {[
                  "Computer Science And Engineering",
                  "Department of Mathematics",
                  "Civil Engineering",
                  "Chemical Engineering",

                  "Electronics and Communication",
                  "Electrical Engineering",
                  "Mechanical Engineering",
                ].map((value, index) => (
                  <div
                    key={index}
                    className={`text-center w-full ${
                      index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                    } ${styles.filter}`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ProjectTable />
    </div>
  );
}

export default FindForms;

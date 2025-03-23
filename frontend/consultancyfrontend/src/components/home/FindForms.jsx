import React from "react";
import { BsCalendarDateFill } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { SiGoogleforms } from "react-icons/si";
import { FaCircleNotch } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiConnectors";
import { useSelector } from "react-redux";
import styles from "./form.module.css";
import ProjectTable from "../../pages/ProjectTable";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { z } from "zod";

// Define your filter schema
const filterSchema = z
  .object({
    date: z.enum([
      "recent10",
      "10days",
      "1mon",
      "3mon",
      "6mon",
      "byDate",
      "all",
    ]),
    projectStatus: z.enum(["completed", "ongoing", "rejected", "all"]),
    dept: z.string(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      // Check if the date is "byDate" and validate if startDate and endDate are provided
      if (data.date === "byDate") {
        if (!data.startDate || !data.endDate) {
          return false;
        }
      }
      return true;
    },
    {
      message: "startDate and endDate are required when date is 'byDate'",
      path: ["startDate", "endDate"],
    }
  );

function FindForms() {
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useSelector((state) => state.auth);

  // Filter state
  const [dateOpen, setDateOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formStatusOpen, setFormStatusOpen] = useState(false);
  const [projectStatusOpen, setProjectStatusOpen] = useState(false);

  // Filter values
  const [dateFilter, setDateFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data state
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Date mapping for API
  const dateMapping = {
    "10-days": "10days",
    "1-month": "1mon",
    "6-months": "6mon",
    "by-date": "byDate",
    all: "all",
  };

  // Apply filters
  const applyFilters = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare filter data
      const filterData = {
        date: dateMapping[dateFilter] || "all",
        projectStatus: projectStatusFilter.toLowerCase(),
        dept: deptFilter,
      };

      // Add start and end dates if using by-date filter
      if (dateFilter === "by-date" && startDate && endDate) {
        filterData.startDate = new Date(startDate);
        filterData.endDate = new Date(endDate);
      }

      // Validate with zod schema
      try {
        filterSchema.parse(filterData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        setError("Invalid filter data. Please check your selections.");
        setLoading(false);
        return;
      }
      console.log(filterData);
      // Call API with filter data
      const response = await apiConnector(
        "POST",
        `user/filters?page=${currentPage - 1}`,
        filterData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setData(response.data.data);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error applying filters:", error);
      setError("Failed to fetch filtered data. Please try again.");
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setDateFilter("all");
    setDeptFilter("all");
    setProjectStatusFilter("all");
    setStartDate("");
    setEndDate("");
  };

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDateOpen(false);
      setFormOpen(false);
      setFormStatusOpen(false);
      setProjectStatusOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fetch initial data on component mount and when page changes
  useEffect(() => {
    applyFilters();
  }, [currentPage]);

  // Prevent dropdown close when clicking inside
  const handleDropdownClick = (e, setter) => {
    e.stopPropagation();
    setter((prev) => !prev);
  };

  // Handle date filter selection
  const handleDateSelection = (value, e) => {
    e.stopPropagation();
    setDateFilter(value);
    if (value !== "by-date") {
      setStartDate("");
      setEndDate("");
    }
  };

  // Handle department selection
  const handleDeptSelection = (value, e) => {
    e.stopPropagation();
    setDeptFilter(value);
    setFormOpen(false);
  };

  // Handle project status selection
  const handleProjectStatusSelection = (value, e) => {
    e.stopPropagation();
    setProjectStatusFilter(value);
    setProjectStatusOpen(false);
  };

  // Get cursor style based on loading state
  const getCursorStyle = () => {
    return loading ? "cursor-wait" : "cursor-pointer";
  };

  return (
    <div className={`px-4 lg:px-10 ${loading ? "cursor-wait" : ""}`}>
      <div className="flex justify-between items-center mt-16">
        <h2 className="font-semibold text-lg">Find forms:</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2">
          {error}
        </div>
      )}
      <div className="flex justify-between flex-row-reverse">
        <div className="flex gap-3">
          <button
            onClick={resetFilters}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-3 py-1 bg-[#34357c] text-white rounded-md hover:bg-[#5551ac] transition disabled:bg-[#5551ac]"
            disabled={loading}
          >
            {loading ? "Filtering..." : "Apply"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 lg:w-[80%] ">
          {/* Date Filter */}
          <div className="relative">
            <div
              className={`border border-black p-1 rounded-xl bg-[#cfd7e0] px-2 flex items-center ${getCursorStyle()}`}
              onClick={(e) => handleDropdownClick(e, setDateOpen)}
            >
              <BsCalendarDateFill className="mr-2" />
              Date: {dateFilter}
              <IoMdArrowDropdown className="ml-auto" size={18} />
            </div>
            {dateOpen && (
              <div
                className={`${styles.dropdown} absolute top-10 left-0 z-10 border-black rounded-xl border-[1px] w-[100%] flex flex-col justify-center items-center bg-white shadow-lg`}
                onClick={(e) => e.stopPropagation()}
              >
                {["10-days", "1-month", "6-months", "by-date", "all"].map(
                  (value, index) => (
                    <div
                      key={index}
                      className={`text-center w-full ${
                        index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                      } ${styles.filter} ${
                        dateFilter === value ? "font-bold" : ""
                      }`}
                      onClick={(e) => handleDateSelection(value, e)}
                    >
                      {value}
                    </div>
                  )
                )}
                {dateFilter === "by-date" && (
                  <div className={`${styles.date} p-2 w-full`}>
                    <div className="mb-2">
                      <label htmlFor="startDate" className={`block mb-1`}>
                        From:
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block mb-1">
                        To:
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Project Status Filter */}
          <div className="relative">
            <div
              className={`border border-black p-1 rounded-xl bg-[#cfd7e0] px-2 flex items-center ${getCursorStyle()}`}
              onClick={(e) => handleDropdownClick(e, setProjectStatusOpen)}
            >
              <IoCheckmarkDoneCircle className="mr-2" />
              Status: {projectStatusFilter}
              <IoMdArrowDropdown className="ml-auto" size={18} />
            </div>
            {projectStatusOpen && (
              <div
                className="absolute top-10 left-0 z-10 border-black rounded-xl border-[1px] w-[100%] flex flex-col justify-center items-center bg-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {["all", "completed", "ongoing", "rejected"].map(
                  (value, index) => (
                    <div
                      key={index}
                      className={`text-center w-full ${
                        index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                      } ${styles.filter} ${
                        projectStatusFilter === value ? "font-bold" : ""
                      }`}
                      onClick={(e) => handleProjectStatusSelection(value, e)}
                    >
                      {value}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Department Filter */}
          <div className="relative">
            <div
              className={`border border-black p-1 rounded-xl bg-[#cfd7e0] px-2 flex items-center ${getCursorStyle()}`}
              onClick={(e) => handleDropdownClick(e, setFormOpen)}
            >
              <SiGoogleforms className="mr-2" />
              Dept: {deptFilter === "all" ? "all" : "..."}
              <IoMdArrowDropdown className="ml-auto" size={18} />
            </div>
            {formOpen && (
              <div
                className="absolute top-10 left-0 z-10 border-black rounded-xl border-[1px] w-[200%] flex flex-col justify-center items-center bg-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`text-center w-full bg-[#CFD7E0] ${
                    styles.filter
                  } ${deptFilter === "all" ? "font-bold" : ""}`}
                  onClick={(e) => handleDeptSelection("all", e)}
                >
                  All Departments
                </div>
                {["coed", "med", "ced", "ched", "eced", "eed", "mathd"].map(
                  (value, index) => (
                    <div
                      key={index}
                      className={`text-center w-full ${
                        index % 2 === 0 ? "bg-[#CFD7E0]" : "bg-[#d9d9d9]"
                      } ${styles.filter} ${
                        deptFilter === value ? "font-bold" : ""
                      }`}
                      onClick={(e) => handleDeptSelection(value, e)}
                    >
                      {value}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : data.length > 0 ? (
        <>
          <ProjectTable data={data} />

          <Pagination
            count={Math.ceil(total / 5)}
            page={currentPage}
            onChange={handlePageChange}
            className="flex justify-center w-full my-3"
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No projects found with the selected filters.
        </div>
      )}
    </div>
  );
}

export default FindForms;

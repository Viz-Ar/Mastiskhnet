import { useMemo, useState } from "react";

import {
  FaCube,
  FaDownload,
  FaEye,
  FaFilePdf,
  FaSearch,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../store/authStore";
import useMRIHistory from "../../../hooks/useMRIHistory";

const API_URL = "http://localhost:8000";

export default function Reports() {

  const navigate = useNavigate();

  const { user } = useAuthStore();

  const { history, loading } =
    useMRIHistory(user?.id);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [sort, setSort] =
    useState("Newest");

  const reports = useMemo(() => {

    let data = [...(history || [])];

    if (search) {

      data = data.filter((item) =>
        item.patient_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    if (status !== "All") {

      data = data.filter(
        (item) =>
          item.prediction_status === status
      );

    }

    data.sort((a, b) => {

      if (sort === "Newest") {

        return (
          new Date(b.created_at) -
          new Date(a.created_at)
        );

      }

      return (
        new Date(a.created_at) -
        new Date(b.created_at)
      );

    });

    return data;

  }, [history, search, status, sort]);



  function openPatient(scan) {

    navigate(
      `/doctor/dashboard/patients/${scan.id}`
    );

  }



  function openReport(scan) {

    if (!scan.report_url) {

      alert("Report not available.");

      return;

    }

    window.open(
      `${API_URL}${scan.report_url}`,
      "_blank"
    );

  }



  function downloadMask(scan) {

    if (!scan.mask_url) {

      alert("Mask not available.");

      return;

    }

    window.open(
      `${API_URL}${scan.mask_url}`,
      "_blank"
    );

  }



  function openMesh(scan) {

    if (!scan.mesh_url) {

      alert("3D model not available.");

      return;

    }

    window.open(
      `${API_URL}${scan.mesh_url}`,
      "_blank"
    );

  }



  if (loading) {

    return (

      <div className="rounded-2xl bg-white p-6">

        Loading reports...

      </div>

    );

  }



  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            MRI Reports

          </h1>

          <p className="mt-2 text-slate-500">

            {reports.length} reports available

          </p>

        </div>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-xl border border-slate-200 px-4"
          >

            <option>All</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Pending</option>
            <option>Failed</option>

          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="rounded-xl border border-slate-200 px-4"
          >

            <option>Newest</option>
            <option>Oldest</option>

          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="p-4 text-left">
                  Patient
                </th>

                <th className="p-4 text-left">
                  Tumor
                </th>

                <th className="p-4 text-left">
                  Confidence
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {reports.length === 0 && (

                <tr>

                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-500"
                  >

                    No reports found.

                  </td>

                </tr>

              )}

              {reports.map((scan) => (

                <tr
                  key={scan.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4">

                    <p className="font-semibold">

                      {scan.patient_name}

                    </p>

                    <p className="text-sm text-slate-500">

                      #{scan.patient_id}

                    </p>

                  </td>

                  <td className="p-4">

                    {scan.tumor_type || "-"}

                  </td>

                  <td className="p-4">

                    {scan.confidence
                      ? `${scan.confidence.toFixed(2)}%`
                      : "-"}

                  </td>

                  <td className="p-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                      ${
                        scan.prediction_status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : scan.prediction_status === "Processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : scan.prediction_status === "Failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >

                      {scan.prediction_status}

                    </span>

                  </td>

                  <td className="p-4">

                    {new Date(
                      scan.created_at
                    ).toLocaleDateString()}

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          openPatient(scan)
                        }
                        className="rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
                        title="Patient Details"
                      >

                        <FaEye />

                      </button>

                      <button
                        onClick={() =>
                          openReport(scan)
                        }
                        disabled={!scan.report_url}
                        className="rounded-lg bg-red-600 p-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Open PDF Report"
                      >

                        <FaFilePdf />

                      </button>

                      <button
                        onClick={() =>
                          downloadMask(scan)
                        }
                        disabled={!scan.mask_url}
                        className="rounded-lg bg-green-600 p-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Download Mask"
                      >

                        <FaDownload />

                      </button>

                      <button
                        onClick={() =>
                          openMesh(scan)
                        }
                        disabled={!scan.mesh_url}
                        className="rounded-lg bg-purple-600 p-3 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Open 3D Model"
                      >

                        <FaCube />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}
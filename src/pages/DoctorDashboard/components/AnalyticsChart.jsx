import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const data = [
  {
    month: "Jan",
    scans: 40,
  },
  {
    month: "Feb",
    scans: 65,
  },
  {
    month: "Mar",
    scans: 90,
  },
  {
    month: "Apr",
    scans: 120,
  },
  {
    month: "May",
    scans: 150,
  },
  {
    month: "Jun",
    scans: 190,
  },
];


export default function AnalyticsChart() {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >

      <h2
        className="
          mb-6
          text-xl
          font-bold
          text-slate-900
        "
      >
        MRI Analysis Overview
      </h2>


      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart data={data}>


          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
          />


          <XAxis
            dataKey="month"
            tick={{
              fill: "#64748b",
            }}
          />


          <YAxis
            tick={{
              fill: "#64748b",
            }}
          />


          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
            }}
            labelStyle={{
              color: "#0f172a",
              fontWeight: "600",
            }}
          />


          <Line
            type="monotone"
            dataKey="scans"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#2563eb",
            }}
            activeDot={{
              r: 7,
            }}
          />


        </LineChart>

      </ResponsiveContainer>


    </div>

  );
}
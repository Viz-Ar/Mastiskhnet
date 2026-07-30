import {
  FaBrain,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

export default function PredictionHeader({

  prediction,

}) {

  if (!prediction) {

    return (

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        Loading prediction...

      </div>

    );

  }

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            Brain Tumor Prediction

          </h1>

          <p className="mt-2 text-slate-500">

            AI Segmentation Result

          </p>

        </div>

        <span className="rounded-full bg-green-100 px-5 py-2 font-semibold text-green-700">

          {prediction.prediction_status}

        </span>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-5">

        <InfoCard
          icon={<FaUser />}
          title="Patient"
          value={prediction.patient_name}
        />

        <InfoCard
          icon={<FaBrain />}
          title="Tumor"
          value={prediction.tumor_type || "None"}
        />

        <InfoCard
          icon={<FaClock />}
          title="Processing"
          value={`${prediction.processing_time}s`}
        />

        <InfoCard
          icon={<FaCalendarAlt />}
          title="Date"
          value={new Date(
            prediction.created_at
          ).toLocaleDateString()}
        />

        <InfoCard
          icon={<FaCheckCircle />}
          title="Model"
          value={prediction.model_name}
        />

      </div>

    </div>

  );

}

function InfoCard({

  icon,

  title,

  value,

}) {

  return (

    <div className="rounded-xl bg-slate-50 p-5">

      <div className="mb-4 text-2xl text-blue-600">

        {icon}

      </div>

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <p className="mt-2 font-bold text-slate-900">

        {value}

      </p>

    </div>

  );

}
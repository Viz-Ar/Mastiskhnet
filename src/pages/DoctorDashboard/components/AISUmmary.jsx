import {
  FaBrain,
  FaCheckCircle,
} from "react-icons/fa";


export default function AISummary() {

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


      {/* Header */}

      <div className="flex items-center gap-4">


        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            text-white
            shadow-md
          "
        >

          <FaBrain size={25} />

        </div>



        <div>

          <h2
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            AI Segmentation Status
          </h2>


          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Attention U-Net 3D Model
          </p>


        </div>


      </div>




      {/* Metrics */}

      <div
        className="
          mt-6
          space-y-4
        "
      >


        {/* Detection */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-50
            p-3
          "
        >

          <span
            className="
              font-medium
              text-slate-700
            "
          >
            Tumor Detection
          </span>


          <FaCheckCircle
            className="
              text-green-500
            "
          />


        </div>





        {/* Accuracy */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-50
            p-3
          "
        >

          <span
            className="
              font-medium
              text-slate-700
            "
          >
            Model Accuracy
          </span>


          <span
            className="
              font-bold
              text-blue-600
            "
          >
            96.8%
          </span>


        </div>





        {/* Dice Score */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-50
            p-3
          "
        >

          <span
            className="
              font-medium
              text-slate-700
            "
          >
            Dice Score
          </span>


          <span
            className="
              font-bold
              text-blue-600
            "
          >
            0.86
          </span>


        </div>



      </div>


    </div>

  );
}
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../store/authStore";
import useMRIHistory from "../../../hooks/useMRIHistory";


export default function Patients() {


  const { user } = useAuthStore();

  const navigate = useNavigate();


  const {
    history,
    loading
  } = useMRIHistory(
    user?.id
  );



  if(loading){

    return (

      <div className="
        rounded-2xl
        bg-white
        p-6
        text-slate-600
      ">

        Loading patients...

      </div>

    );

  }



  // remove duplicate patients
  const uniquePatients = Array.from(
    new Map(
      (history ?? [])
      .map(item => [
        item.patient_id,
        item
      ])
    ).values()
  );



  return (

    <div className="space-y-6">


      <div>

        <h1 className="
          text-3xl
          font-bold
          text-slate-900
        ">

          Patients

        </h1>


        <p className="
          mt-2
          text-slate-500
        ">

          Manage your assigned MRI patients

        </p>


      </div>





      <div className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        overflow-hidden
      ">


      {
        uniquePatients.length === 0 ?


        (

          <div className="
            p-10
            text-center
            text-slate-500
          ">

            No patients found

          </div>

        )


        :

        (

        <table className="
          w-full
          text-left
        ">


          <thead className="
            border-b
            bg-slate-50
          ">

            <tr>


              <th className="p-4">
                Patient
              </th>


              <th className="p-4">
                Email
              </th>


              <th className="p-4">
                Latest Status
              </th>


              <th className="p-4">
                Tumor
              </th>


              <th className="p-4">
                Action
              </th>


            </tr>


          </thead>



          <tbody>


          {
            uniquePatients.map(
              (patient)=>(


              <tr
                key={patient.patient_id}
                className="
                  border-b
                  hover:bg-blue-50
                "
              >


                <td className="p-4">

                  <div>

                    <p className="
                      font-semibold
                      text-slate-900
                    ">

                      {patient.patient_name}

                    </p>


                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      ID #{patient.patient_id}

                    </p>


                  </div>

                </td>




                <td className="
                  p-4
                  text-slate-600
                ">

                  {patient.patient_email}

                </td>





                <td className="p-4">


                  <span
                  className="
                    rounded-full
                    bg-green-100
                    px-3
                    py-1
                    text-sm
                    font-medium
                    text-green-700
                  "
                  >

                    {patient.prediction_status}

                  </span>


                </td>





                <td className="
                  p-4
                  text-slate-700
                ">

                  {
                    patient.tumor_type
                    ??
                    "Pending"
                  }

                </td>





                <td className="p-4">


                  <button

                  onClick={()=>(
                    navigate(
                      `/doctor/dashboard/patients/${patient.patient_id}`
                    )
                  )}

                  className="
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    hover:bg-blue-700
                  "

                  >

                    View

                  </button>


                </td>



              </tr>


              )
            )
          }



          </tbody>


        </table>

        )


      }


      </div>


    </div>

  );

}
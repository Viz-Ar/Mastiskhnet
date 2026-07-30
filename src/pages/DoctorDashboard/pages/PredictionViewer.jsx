import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosInstance from "../../../api/axios";

import PredictionHeader from "../../../components/prediction/PredictionHeader";
import SliceViewer from "../../../components/prediction/SliceViewer";
import OverlayViewer from "../../../components/prediction/OverlayViewer";
import Viewer3D from "../../../components/prediction/Viewer3D";
import TumorStatistics from "../../../components/prediction/TumorStatistics";

export default function PredictionViewer() {

    const { id } = useParams();

    const [prediction, setPrediction] = useState(null);

    const [loading, setLoading] = useState(true);

    const [sliceIndex, setSliceIndex] = useState(0);

    useEffect(() => {

        async function loadPrediction() {

            try {

                const response = await axiosInstance.get(`/mri/${id}`);

                setPrediction(response.data);

                if (response.data?.total_slices) {

                    setSliceIndex(
                        Math.floor(response.data.total_slices / 2)
                    );

                }

            } catch (error) {

                console.error("Failed to load prediction", error);

            } finally {

                setLoading(false);

            }

        }

        loadPrediction();

    }, [id]);

    if (loading) {

        return (
            <div className="rounded-2xl bg-white p-10 text-center">
                Loading Prediction...
            </div>
        );

    }

    if (!prediction) {

        return (
            <div className="rounded-2xl bg-white p-10 text-center text-red-500">
                Prediction not found.
            </div>
        );

    }

    return (

        <div className="space-y-6">

            <PredictionHeader prediction={prediction} />

            <SliceViewer
                prediction={prediction}
                sliceIndex={sliceIndex}
                setSliceIndex={setSliceIndex}
            />

            <OverlayViewer
                scanId={prediction.id}
                sliceIndex={sliceIndex}
            />

            <Viewer3D scanId={prediction.id} />

            <TumorStatistics prediction={prediction} />

        </div>

    );

}
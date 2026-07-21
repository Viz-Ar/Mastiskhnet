"""
==========================================================
MastiskhNet Predictor

MRI
 |
Preprocessing
 |
Attention U-Net 3D
 |
Segmentation Mask

==========================================================
"""


from app.ml.model_loader import load_model

from app.ml.preprocess import prepare_input

from app.ml.inference import run_inference





def predict_brain_tumor(

        flair,

        t1,

        t1ce,

        t2,

        output_dir="outputs"

):


    print(
        "Preparing MRI volumes..."
    )


    input_tensor = prepare_input(

        flair,

        t1,

        t1ce,

        t2

    )



    print(
        "Loading model..."
    )


    model = load_model()



    print(
        "Running segmentation..."
    )


    mask = run_inference(

        input_tensor,

        model,

        output_dir

    )



    print(
        "Segmentation completed"
    )



    return {


        "mask": mask,


        "input": input_tensor


    }
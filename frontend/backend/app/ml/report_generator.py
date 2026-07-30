"""
==========================================================
MastiskhNet Medical Report Generator

Creates AI-assisted tumor analysis report
==========================================================
"""


from datetime import datetime



def generate_medical_report(
        statistics,
        voxel_spacing
):


    tumor_volume = 0

    tumor_classes = []



    for name, data in statistics.items():


        if name != "Background":


            volume = float(
                data["volume_mm3"]
            )


            if volume > 0:

                tumor_classes.append(name)


                tumor_volume += volume




    if tumor_volume > 0:

        finding = "Tumor detected"

    else:

        finding = "No tumor detected"




    report = {


        "system":

        "MastiskhNet 3D Attention U-Net",



        "generated_at":

        str(datetime.now()),



        "finding":

        finding,



        "tumor_volume_mm3":

        round(
            tumor_volume,
            2
        ),



        "tumor_volume_cm3":

        round(
            tumor_volume / 1000,
            2
        ),



        "detected_regions":

        tumor_classes,



        "voxel_spacing_mm":

        {

            "x":

            float(voxel_spacing[0]),


            "y":

            float(voxel_spacing[1]),


            "z":

            float(voxel_spacing[2])

        },



        "segmentation_statistics":

        statistics


    }


    return report
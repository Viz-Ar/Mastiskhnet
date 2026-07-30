from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet



def create_pdf_report(
        report,
        output="outputs/report.pdf"
):


    doc = SimpleDocTemplate(
        output
    )


    styles = getSampleStyleSheet()


    content=[]



    content.append(

        Paragraph(
            "MastiskhNet Brain Tumor Analysis Report",
            styles["Title"]
        )

    )


    content.append(
        Spacer(1,20)
    )


    for key,value in report.items():


        content.append(

            Paragraph(

                f"{key}: {value}",

                styles["Normal"]

            )

        )



    doc.build(
        content
    )


    return output
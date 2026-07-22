"""
==========================================================
MastiskhNet PDF Report Generator
==========================================================
"""

import os

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)


def generate_report(
    scan,
    statistics,
    output_dir
):
    """
    Generate PDF report for one MRI scan.

    Parameters
    ----------
    scan : MRIScan
        Database object

    statistics : dict
        Tumor statistics

    output_dir : str
        Folder where report will be saved

    Returns
    -------
    str
        Path to generated PDF
    """

    os.makedirs(output_dir, exist_ok=True)

    report_path = os.path.join(
        output_dir,
        "brain_tumor_report.pdf"
    )

    doc = SimpleDocTemplate(report_path)

    styles = getSampleStyleSheet()

    elements = []

    # =====================================
    # Title
    # =====================================

    elements.append(
        Paragraph(
            "<b>MastiskhNet Brain Tumor Analysis Report</b>",
            styles["Title"]
        )
    )

    elements.append(Spacer(1, 20))

    # =====================================
    # Scan Information
    # =====================================

    elements.append(
        Paragraph(
            f"<b>Scan ID:</b> {scan.id}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Patient ID:</b> {scan.patient_id}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Doctor ID:</b> {scan.doctor_id}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Status:</b> {scan.prediction_status}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 20))

    # =====================================
    # Tumor Statistics
    # =====================================

    elements.append(
        Paragraph(
            "<b>Tumor Statistics</b>",
            styles["Heading2"]
        )
    )

    elements.append(Spacer(1, 10))

    for tumor_type, values in statistics.items():

        elements.append(
            Paragraph(
                f"<b>{tumor_type}</b>",
                styles["Heading3"]
            )
        )

        elements.append(
            Paragraph(
                f"Voxel Count: {values['voxels']}",
                styles["Normal"]
            )
        )

        elements.append(
            Paragraph(
                f"Volume (mm³): {values['volume_mm3']:.2f}",
                styles["Normal"]
            )
        )

        elements.append(
            Paragraph(
                f"Volume (cm³): {values['volume_cm3']:.2f}",
                styles["Normal"]
            )
        )

        elements.append(
            Paragraph(
                f"Percentage: {values['percentage']:.2f}%",
                styles["Normal"]
            )
        )

        elements.append(Spacer(1, 10))

    doc.build(elements)

    return report_path
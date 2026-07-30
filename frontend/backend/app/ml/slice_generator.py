import os
import cv2
import numpy as np
import nibabel as nib


COLORS = {
    0: (0, 0, 0),
    1: (0, 0, 255),      # Necrotic
    2: (0, 255, 0),      # Edema
    4: (255, 0, 0),      # Enhancing
}


def normalize(slice_img):

    slice_img = slice_img.astype(np.float32)

    slice_img -= slice_img.min()

    if slice_img.max() > 0:
        slice_img /= slice_img.max()

    return (slice_img * 255).astype(np.uint8)


def color_mask(mask):

    h, w = mask.shape

    output = np.zeros((h, w, 3), dtype=np.uint8)

    for label, color in COLORS.items():
        output[mask == label] = color

    return output


def create_slice_images(
    flair_path,
    mask_path,
    output_dir,
):

    os.makedirs(output_dir, exist_ok=True)

    flair = nib.load(flair_path).get_fdata()

    mask = nib.load(mask_path).get_fdata()

    original_folder = os.path.join(output_dir, "original")

    segmentation_folder = os.path.join(output_dir, "segmentation")

    overlay_folder = os.path.join(output_dir, "overlay")

    os.makedirs(original_folder, exist_ok=True)

    os.makedirs(segmentation_folder, exist_ok=True)

    os.makedirs(overlay_folder, exist_ok=True)

    depth = flair.shape[2]

    for i in range(depth):

        img = normalize(flair[:, :, i])

        img_rgb = cv2.cvtColor(
            img,
            cv2.COLOR_GRAY2BGR
        )

        seg = mask[:, :, i].astype(np.uint8)

        seg_rgb = color_mask(seg)

        overlay = cv2.addWeighted(
            img_rgb,
            0.7,
            seg_rgb,
            0.3,
            0,
        )

        cv2.imwrite(
            os.path.join(
                original_folder,
                f"{i:03d}.png",
            ),
            img_rgb,
        )

        cv2.imwrite(
            os.path.join(
                segmentation_folder,
                f"{i:03d}.png",
            ),
            seg_rgb,
        )

        cv2.imwrite(
            os.path.join(
                overlay_folder,
                f"{i:03d}.png",
            ),
            overlay,
        )

    return {

        "original_folder": original_folder,

        "segmentation_folder": segmentation_folder,

        "overlay_folder": overlay_folder,

        "total_slices": depth,

    }
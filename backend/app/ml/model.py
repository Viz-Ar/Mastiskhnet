"""
MastiskhNet — 3D Attention U-Net for Brain Tumor Segmentation
================================================================

Standalone architecture definition, extracted from the training
notebook (Phase 5). Required to load `best_model.pth` /
`model.safetensors` weights — the checkpoint only stores weights,
not the class definition.

Usage:
    from model import AttentionUNet3D
    import torch

    model = AttentionUNet3D()
    model.load_state_dict(torch.load("best_model.pth", map_location="cpu"))
    model.eval()
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


# ==============================================================
# Model Configuration
# ==============================================================
# Central configuration for the 3D Attention U-Net.
# Changing values here automatically updates the architecture
# without modifying the rest of the code.

# Number of MRI modalities (BraTS2020: FLAIR, T1, T1CE, T2)
INPUT_CHANNELS = 4

# Number of segmentation classes
# 0 = Background, 1 = Necrotic/Non-enhancing Tumor,
# 2 = Edema, 3 = Enhancing Tumor
NUM_CLASSES = 4

# Base number of feature channels (progression: 32 -> 64 -> 128 -> 256 -> 512)
BASE_CHANNELS = 32


# ==============================================================
# Weight Initialization
# ==============================================================

def initialize_weights(model):
    """
    Initialize all trainable layers.

    Conv3D:      Kaiming Normal Initialization
    BatchNorm3D: Weight = 1, Bias = 0
    """
    for module in model.modules():

        if isinstance(module, nn.Conv3d):
            nn.init.kaiming_normal_(
                module.weight,
                mode="fan_out",
                nonlinearity="relu"
            )
            if module.bias is not None:
                nn.init.constant_(module.bias, 0)

        elif isinstance(module, nn.BatchNorm3d):
            nn.init.constant_(module.weight, 1)
            nn.init.constant_(module.bias, 0)


# ==============================================================
# Double Convolution Block
# ==============================================================

class DoubleConv(nn.Module):
    """
    Double Convolution Block: (Conv3D -> BatchNorm3D -> ReLU) x 2

    Extracts rich spatial features while preserving spatial
    dimensions of the input.
    """

    def __init__(self, in_channels, out_channels):
        super().__init__()

        self.double_conv = nn.Sequential(
            nn.Conv3d(
                in_channels=in_channels,
                out_channels=out_channels,
                kernel_size=3,
                padding=1,
                bias=False
            ),
            nn.BatchNorm3d(out_channels),
            nn.ReLU(inplace=True),

            nn.Conv3d(
                in_channels=out_channels,
                out_channels=out_channels,
                kernel_size=3,
                padding=1,
                bias=False
            ),
            nn.BatchNorm3d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)


# ==============================================================
# Attention Gate
# ==============================================================

class AttentionGate(nn.Module):
    """
    Additive Attention Gate for 3D Attention U-Net.

    Parameters
    ----------
    F_g : Channels of decoder feature map (gating signal)
    F_l : Channels of encoder skip feature
    F_int : Intermediate channels
    """

    def __init__(self, F_g, F_l, F_int):
        super().__init__()

        self.W_g = nn.Sequential(
            nn.Conv3d(F_g, F_int, kernel_size=1, bias=True),
            nn.BatchNorm3d(F_int)
        )

        self.W_x = nn.Sequential(
            nn.Conv3d(F_l, F_int, kernel_size=1, bias=True),
            nn.BatchNorm3d(F_int)
        )

        self.psi = nn.Sequential(
            nn.Conv3d(F_int, 1, kernel_size=1, bias=True),
            nn.BatchNorm3d(1),
            nn.Sigmoid()
        )

        self.relu = nn.ReLU(inplace=True)

    def forward(self, gating, skip):
        g = self.W_g(gating)
        x = self.W_x(skip)

        attention = self.relu(g + x)
        attention = self.psi(attention)

        refined_skip = skip * attention

        return refined_skip


# ==============================================================
# Encoder Block
# ==============================================================

class EncoderBlock(nn.Module):
    """
    Encoder Block: DoubleConv -> Skip Connection -> MaxPool3D

    Returns
    -------
    skip : Feature map before pooling.
    pooled : Downsampled feature map.
    """

    def __init__(self, in_channels, out_channels):
        super().__init__()

        self.conv = DoubleConv(
            in_channels=in_channels,
            out_channels=out_channels
        )

        self.pool = nn.MaxPool3d(kernel_size=2, stride=2)

    def forward(self, x):
        skip = self.conv(x)
        pooled = self.pool(skip)
        return skip, pooled


# ==============================================================
# Encoder
# ==============================================================

class Encoder(nn.Module):
    """
    Complete Encoder for the 3D Attention U-Net.

    Returns
    -------
    skip1 : Highest-resolution features
    skip2, skip3, skip4
    bottleneck : Deepest feature representation
    """

    def __init__(self):
        super().__init__()

        c1 = BASE_CHANNELS
        c2 = BASE_CHANNELS * 2
        c3 = BASE_CHANNELS * 4
        c4 = BASE_CHANNELS * 8
        c5 = BASE_CHANNELS * 16

        self.encoder1 = EncoderBlock(INPUT_CHANNELS, c1)
        self.encoder2 = EncoderBlock(c1, c2)
        self.encoder3 = EncoderBlock(c2, c3)
        self.encoder4 = EncoderBlock(c3, c4)

        self.bottleneck = DoubleConv(c4, c5)

    def forward(self, x):
        skip1, x = self.encoder1(x)
        skip2, x = self.encoder2(x)
        skip3, x = self.encoder3(x)
        skip4, x = self.encoder4(x)

        bottleneck = self.bottleneck(x)

        return skip1, skip2, skip3, skip4, bottleneck


# ==============================================================
# Attention Decoder Block
# ==============================================================

class AttentionDecoderBlock(nn.Module):
    """
    Decoder block with integrated Attention Gate.

    Workflow:
        Decoder Feature -> ConvTranspose3D -> Attention Gate
        -> Concatenate -> DoubleConv
    """

    def __init__(self, decoder_channels, encoder_channels, out_channels):
        super().__init__()

        self.up = nn.ConvTranspose3d(
            in_channels=decoder_channels,
            out_channels=out_channels,
            kernel_size=2,
            stride=2
        )

        self.attention = AttentionGate(
            F_g=out_channels,
            F_l=encoder_channels,
            F_int=out_channels // 2
        )

        self.conv = DoubleConv(
            in_channels=out_channels + encoder_channels,
            out_channels=out_channels
        )

    def forward(self, decoder_feature, encoder_feature):

        decoder_feature = self.up(decoder_feature)

        encoder_feature = self.attention(
            decoder_feature,
            encoder_feature
        )

        # Safety check for tensor size mismatches
        if decoder_feature.shape[2:] != encoder_feature.shape[2:]:
            decoder_feature = F.interpolate(
                decoder_feature,
                size=encoder_feature.shape[2:],
                mode="trilinear",
                align_corners=False
            )

        x = torch.cat([encoder_feature, decoder_feature], dim=1)
        x = self.conv(x)

        return x


# ==============================================================
# Final Attention U-Net
# ==============================================================

class AttentionUNet3D(nn.Module):
    """
    3D Attention U-Net for BraTS2020 Brain Tumor Segmentation.

    Input:  [B, 4, D, H, W]  (4 MRI modalities: FLAIR, T1, T1CE, T2)
    Output: [B, 4, D, H, W]  (4 classes: Background, Necrotic, Edema, Enhancing)
    """

    def __init__(self):
        super().__init__()

        c1 = BASE_CHANNELS
        c2 = BASE_CHANNELS * 2
        c3 = BASE_CHANNELS * 4
        c4 = BASE_CHANNELS * 8
        c5 = BASE_CHANNELS * 16

        # Encoder
        self.encoder = Encoder()

        # Decoder
        self.decoder4 = AttentionDecoderBlock(
            decoder_channels=c5, encoder_channels=c4, out_channels=c4
        )
        self.decoder3 = AttentionDecoderBlock(
            decoder_channels=c4, encoder_channels=c3, out_channels=c3
        )
        self.decoder2 = AttentionDecoderBlock(
            decoder_channels=c3, encoder_channels=c2, out_channels=c2
        )
        self.decoder1 = AttentionDecoderBlock(
            decoder_channels=c2, encoder_channels=c1, out_channels=c1
        )

        # Final segmentation layer
        self.final_conv = nn.Conv3d(c1, NUM_CLASSES, kernel_size=1)

        # Initialize weights
        initialize_weights(self)

    def forward(self, x):

        # Encoder
        skip1, skip2, skip3, skip4, bottleneck = self.encoder(x)

        # Decoder
        d4 = self.decoder4(bottleneck, skip4)
        d3 = self.decoder3(d4, skip3)
        d2 = self.decoder2(d3, skip2)
        d1 = self.decoder1(d2, skip1)

        # Output
        output = self.final_conv(d1)

        return output


if __name__ == "__main__":
    # Quick sanity check
    model = AttentionUNet3D()
    dummy_input = torch.randn(1, INPUT_CHANNELS, 128, 128, 128)
    output = model(dummy_input)
    print("Input shape :", dummy_input.shape)
    print("Output shape:", output.shape)
    print("Total params:", sum(p.numel() for p in model.parameters()))

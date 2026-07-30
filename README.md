# Brain Tumor MRI Analysis Platform

This repository contains a full-stack application for brain tumor MRI analysis. It includes a React/Vite frontend for medical staff and a Python/FastAPI backend for processing MRI uploads, generating predictions, and managing reports.

## Project Overview

- Upload and manage MRI scan data
- Review generated segmentation and prediction outputs
- Track patient and scan history
- Prepare reports for medical review

## Repository Structure

- frontend: React application for the user interface
- backend: FastAPI services, data models, and processing logic
- public and src: shared frontend assets and application source

## Development Notes

- Environment files such as .env are ignored to prevent secrets from being committed.
- Build artifacts such as dist, build, and coverage are ignored.
- Generated MRI image outputs under storage/mri_scans are ignored to keep the repository clean.

## Getting Started

1. Install frontend dependencies with npm install.
2. Install backend dependencies with pip install -r requirements.txt.
3. Start the frontend and backend services as needed for local development.

## Git Hygiene

The repository includes ignore rules for:

- environment files (.env, .env.local, etc.)
- build and cache output
- Python bytecode and virtual environment artifacts
- generated MRI scan images and related outputs

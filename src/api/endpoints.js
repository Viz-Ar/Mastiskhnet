const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  DOCTOR: {
    PROFILE: "/doctor/profile",
  },

  PATIENT: {
    LIST: "/patients",
  },

  MRI: {
    UPLOAD: "/mri/upload",
    ANALYZE: "/mri/analyze",
  },

  REPORT: {
    GENERATE: "/reports/generate",
  },

  CHAT: {
    SEND: "/chat",
  },
};

export default ENDPOINTS;
import { DrivingSide } from "@prisma/client";

// Helper functions to normalize enum values
const normalizeDrivingSide = (value: string): DrivingSide | null => {
  switch (value.toUpperCase()) {
    case "LHD":
      return "LHD";
    case "RHD":
      return "RHD";
    default:
      return null;
  }
};

  export default normalizeDrivingSide
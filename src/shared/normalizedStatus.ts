import { ProductStatus } from "@prisma/client";

const normalizeStatus = (value: string): ProductStatus | null => {
    switch (value.toLowerCase()) {
      case "commingsoon":
        return "commingSoon";
      case "live":
        return "live";
      case "sold":
        return "sold";
      case "unsold":
        return "unsold";
      default:
        return null;
    }
  };

  export default normalizeStatus;

// Usage:
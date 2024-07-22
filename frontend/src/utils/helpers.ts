// Convert bytes to a human-readable format
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Byte";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function determineRisk(file) {
  const highRiskKeywords = ["secret", "key", "password", "passport"];
  const mediumRiskKeywords = ["confidential", "private"];

  let riskLevel = "minor"; // default risk level
  const fileName = file.name.toLowerCase();

  if (file.shared) {
    riskLevel = "severe";
  } else {
    for (let keyword of highRiskKeywords) {
      if (fileName.includes(keyword)) {
        riskLevel = "severe";
        break;
      }
    }
    if (riskLevel !== "severe") {
      for (let keyword of mediumRiskKeywords) {
        if (fileName.includes(keyword)) {
          riskLevel = "major";
          break;
        }
      }
    }
  }

  return riskLevel;
}

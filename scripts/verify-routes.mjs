import { statSync } from "node:fs";

const artifacts = [
  "dist/index.html",
  "dist/work/job-opportunity-engine/index.html",
  "dist/work/response-flow-systems/index.html",
  "dist/work/personal-intelligence-refinery/index.html",
  "dist/work/ai-systems-reliability-lab/index.html",
  "dist/ai/index.html",
  "dist/enablement/index.html"
];

const failures = artifacts.flatMap((artifact) => {
  try {
    return statSync(artifact).size > 0 ? [] : [`empty artifact: ${artifact}`];
  } catch (error) {
    return error.code === "ENOENT" ? [`missing artifact: ${artifact}`] : [
      `unable to inspect artifact: ${artifact} (${error.message})`
    ];
  }
});

if (failures.length > 0) {
  console.error("Route artifact verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Route artifact verification passed.");
}

// export interface AnswerOption {
//   type: "multipleChoice" | "boolean";
//   options: (string | boolean)[];
// }

// export interface Answer {
//   [key: string]: AnswerOption;
// }

export interface Answer {
  freeOrOpenSourceSoftware: {
    type: string;
    options: boolean[];
  };
  commercialSupport: {
    type: string;
    options: boolean[];
  };
  typicalTaskDuration: {
    type: string;
    options: string[];
  };
  taskSubmissionRate: {
    type: string;
    options: string[];
  };
  microsoftWindowsComputeNodes: {
    type: string;
    options: boolean[];
  };
  supportForContainers: {
    type: string;
    options: boolean[];
  };
  arm64CPUSupport: {
    type: string;
    options: boolean[];
  };
  gpuSupport: {
    type: string;
    options: boolean[];
  };
  advancedResourceScheduling: {
    type: string;
    options: boolean[];
  };
  dataAwareScheduling: {
    type: string;
    options: boolean[];
  };
  onPremisesScheduler: {
    type: string;
    options: boolean[];
  };
  managedCloudResources: {
    type: string;
    options: boolean[];
  };
  supportCloudSpotCapacity: {
    type: string;
    options: boolean[];
  };
  managedCloudSolution: {
    type: string;
    options: boolean[];
  };
  cloudAWSIntegration: {
    type: string;
    options: boolean[];
  };
  integrationAWSECS: {
    type: string;
    options: boolean[];
  };
  advancedAWSEC2SpotFeatures: {
    type: string;
    options: boolean[];
  };
  cloudAzureIntegration: {
    type: string;
    options: boolean[];
  };
  cloudGCPIntegration: {
    type: string;
    options: boolean[];
  };
}

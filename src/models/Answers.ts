// export interface AnswerOption {
//   type: "multipleChoice" | "boolean";
//   options: (string | boolean)[];
// }

// export interface Answer {
//   [key: string]: AnswerOption;
// }

export interface Answer {
  typicalTaskDuration: {
    type: string;
    options: string[];
  };
  taskSubmissionRate: {
    type: string;
    options: string[];
  };
  managedCloudSolutionAWS: {
    type: string;
    options: boolean[];
  };
  microsoftWindowsComputeNodes: {
    type: string;
    options: boolean[];
  };
  runOutsideAWS: {
    type: string;
    options: boolean[];
  };
  supportForContainers: {
    type: string;
    options: boolean[];
  };
  integrationAWSECS: {
    type: string;
    options: boolean[];
  };
  supportForAmazonEC2Spot: {
    type: string;
    options: boolean[];
  };
  advancedFeaturesEC2Spot: {
    type: string;
    options: boolean[];
  };
  supportForEC2GravitonInstances: {
    type: string;
    options: boolean[];
  };
  cloudProviders: {
    type: string;
    options: string[];
  };
}

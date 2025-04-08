export interface SchedulerFeatures {
  typicalTaskDuration: number;
  taskSubmissionRate: number;
  managedCloudSolutionAWS: boolean;
  microsoftWindowsComputeNodes: boolean;
  runOutsideAWS: boolean;
  supportForContainers: boolean;
  integrationAWSECS: boolean;
  supportForAmazonEC2Spot: boolean;
  advancedFeaturesEC2Spot: boolean;
  supportForEC2GravitonInstances: boolean;
  cloudProviders: string[];
}

export interface Scheduler {
  name: string;
  product: string;
  owner: string;
  inScope: number;
  score: string;
  link: string;
  features: SchedulerFeatures;
}

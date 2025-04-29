export interface SchedulerFeatures {
  typicalTaskDuration: number;
  taskSubmissionRate: number;
  microsoftWindowsComputeNodes: boolean;
  supportForContainers: boolean;
  arm64CPUSupport: boolean;
  gpuSupport: boolean;
  advancedResourceScheduling: boolean;
  dataAwareScheduling: boolean;
  onPremisesScheduler: boolean;
  managedCloudResources: boolean;
  supportCloudSpotCapacity: boolean;
  managedCloudSolution: boolean;
  cloudAWSIntegration: boolean;
  integrationAWSECS: boolean;
  advancedAWSEC2SpotFeatures: boolean;
  cloudAzureIntegration: boolean;
  cloudGCPIntegration: boolean;
}

export interface Scheduler {
  name: string;
  product: string;
  owner: string;
  inScope: number;
  score: string;
  link: string;
  features: SchedulerFeatures;
  isMatch?: boolean;
}

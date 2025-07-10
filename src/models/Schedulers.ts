export interface SchedulerFeatures {
  freeSoftware: boolean;
  openSourceSoftware: boolean;
  commercialSupport: boolean;
  typicalTaskDuration: number;
  taskSubmissionRate: number;
  microsoftWindowsComputeNodes: boolean;
  supportForContainers: boolean;
  arm64CPUSupport: boolean;
  gpuSupport: boolean;
  dataEncrypted: boolean;
  advancedResourceScheduling: boolean;
  dataAwareScheduling: boolean;
  onPremisesScheduler: boolean;
  managedCloudResources: boolean;
  supportCloudSpotCapacity: boolean;
  managedCloudSolution: boolean;
  cloudAWSIntegration: boolean;
  IntegrationK8: boolean;
  advancedCapacityProvisioning: boolean;
  cloudAzureIntegration: boolean;
  cloudGCPIntegration: boolean;
  supportedCloudProviders: string[];
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

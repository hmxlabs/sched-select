export interface SchedulerFeatures {
  freeSoftware?: boolean | null | string;
  openSourceSoftware?: boolean | null | string;
  commercialSupport?: boolean | null | string;
  typicalTaskDuration?: number | null | string;
  taskSubmissionRate?: number | null | string;
  microsoftWindowsComputeNodes?: boolean | null | string;
  supportForContainers?: boolean | null | string;
  arm64CPUSupport?: boolean | null | string;
  gpuSupport?: boolean | null | string;
  dataEncrypted?: boolean | null | string;
  advancedResourceScheduling?: boolean | null | string;
  dataAwareScheduling?: boolean | null | string;
  onPremisesScheduler?: boolean | null | string;
  managedCloudResources?: boolean | null | string;
  supportCloudSpotCapacity?: boolean | null | string;
  managedCloudSolution?: boolean | null | string;
  cloudAWSIntegration?: boolean | null | string;
  IntegrationK8?: boolean | null | string;
  advancedCapacityProvisioning?: boolean | null | string;
  cloudAzureIntegration?: boolean | null | string;
  cloudGCPIntegration?: boolean | null | string;
  supportedCloudProviders?: string[] | null | string;
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
  unkownCount?: number;
  totalMatch?: number;
}

import { formatKey, filterSchedulers, scoreSchedulers } from '../helpers';
import { Scheduler } from '../../models/Schedulers';

describe('formatKey', () => {
  it('should format camelCase keys correctly', () => {
    expect(formatKey('freeSoftware')).toBe('Free Software');
    expect(formatKey('gpuSupport')).toBe('GPU Support');
  });

  it('should handle acronyms correctly', () => {
    expect(formatKey('cloudAWSIntegration')).toBe('Cloud AWS Integration');
    expect(formatKey('arm64CPUSupport')).toBe('ARM64 CPU Support');
  });

  it('should handle single words', () => {
    expect(formatKey('name')).toBe('Name');
    expect(formatKey('description')).toBe('Description');
  });
});

describe('filterSchedulers', () => {
  const mockSchedulers: Scheduler[] = [
    {
      name: 'Test Scheduler 1',
      product: 'Test',
      owner: 'Test Owner',
      inScope: 1,
      score: '100',
      link: 'https://test.com',
      features: {
        freeSoftware: true,
        gpuSupport: false,
      },
    },
    {
      name: 'Test Scheduler 2',
      product: 'Test',
      owner: 'Test Owner',
      inScope: 1,
      score: '100',
      link: 'https://test.com',
      features: {
        freeSoftware: false,
        gpuSupport: true,
      },
    },
  ];

  it('should filter schedulers based on boolean features', () => {
    const answers = { freeSoftware: 'yes' };
    const result = filterSchedulers(answers, mockSchedulers);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Scheduler 1');
  });

  it('should handle unknown features', () => {
    const answers = { unknownFeature: 'yes' };
    const result = filterSchedulers(answers, mockSchedulers);
    expect(result).toHaveLength(2);
  });
});

describe('scoreSchedulers', () => {
  const mockSchedulers: Scheduler[] = [
    {
      name: 'Test Scheduler',
      product: 'Test',
      owner: 'Test Owner',
      inScope: 1,
      score: '100',
      link: 'https://test.com',
      features: {
        freeSoftware: true,
        gpuSupport: false,
      },
    },
  ];

  it('should calculate scores correctly', () => {
    const answers = { freeSoftware: 'yes', gpuSupport: 'no' };
    const result = scoreSchedulers(answers, mockSchedulers);
    
    expect(result[0].totalMatch).toBe(2);
    expect(result[0].unknownCount).toBe(0);
  });

  it('should handle unknown features', () => {
    const answers = { unknownFeature: 'yes' };
    const result = scoreSchedulers(answers, mockSchedulers);
    
    expect(result[0].unknownCount).toBe(1);
    expect(result[0].unknownFeatures).toContain('Unknown Feature');
  });
});

#!/usr/bin/env python3
"""
Validates schedulers.json against the schema defined

All fields in the features section are treated as mandatory.
All fields in the details section are optional but generate a warning if missing.
Unknown fields generate an error.
"""

import json
import sys
from pathlib import Path
from typing import Any

# Define the expected schema based on TIBCO DataSynapse GridServer
REQUIRED_TOP_LEVEL_FIELDS = {
    "name": str,
    "product": str,
    "owner": str,
    "inScope": int,
    "score": str,
    "link": str,
    "description": str,
    "features": dict,
}

# Optional top-level fields
OPTIONAL_TOP_LEVEL_FIELDS = {
    "details": dict,
}

# All mandatory feature fields (based on TIBCO DataSynapse GridServer)
REQUIRED_FEATURE_FIELDS = {
    "freeSoftware": (bool, int),
    "openSourceSoftware": (bool, int),
    "commercialSupport": (bool, int),
    "typicalTaskDuration": (int, float),
    "taskSubmissionRate": (int, float),
    "microsoftWindowsComputeNodes": (bool, int),
    "supportForContainers": (bool, int),
    "arm64CPUSupport": (bool, int),
    "gpuSupport": (bool, int),
    "dataEncrypted": (bool, int),
    "advancedResourceScheduling": (bool, int),
    "dataAwareScheduling": (bool, int),
    "onPremisesScheduler": (bool, int),
    "managedCloudResources": (bool, int),
    "supportCloudSpotCapacity": (bool, int),
    "managedCloudSolution": (bool, int),
    "cloudAWSIntegration": (bool, int),
    "IntegrationK8": (bool, int),
    "advancedCapacityProvisioning": (bool, int),
    "cloudAzureIntegration": (bool, int),
    "cloudGCPIntegration": (bool, int),
    "supportedCloudProviders": list,
}

# Expected detail fields (optional but warned if missing)
EXPECTED_DETAIL_FIELDS = {
    "freeSoftware": str,
    "openSourceSoftware": str,
    "commercialSupport": str,
    "typicalTaskDuration": str,
    "taskSubmissionRate": str,
    "microsoftWindowsComputeNodes": str,
    "supportForContainers": str,
    "arm64CPUSupport": str,
    "gpuSupport": str,
    "dataEncrypted": str,
    "advancedResourceScheduling": str,
    "dataAwareScheduling": str,
    "onPremisesScheduler": str,
    "managedCloudResources": str,
    "supportCloudSpotCapacity": str,
    "managedCloudSolution": str,
    "cloudAWSIntegration": str,
    "IntegrationK8": str,
    "advancedCapacityProvisioning": str,
    "cloudAzureIntegration": str,
    "cloudGCPIntegration": str,
}


class ValidationResult:
    def __init__(self):
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def add_error(self, message: str):
        self.errors.append(message)

    def add_warning(self, message: str):
        self.warnings.append(message)

    @property
    def has_errors(self) -> bool:
        return len(self.errors) > 0

    @property
    def has_warnings(self) -> bool:
        return len(self.warnings) > 0


def validate_type(value: Any, expected_type: type | tuple) -> bool:
    """Check if value matches expected type(s)."""
    if isinstance(expected_type, tuple):
        return isinstance(value, expected_type)
    return isinstance(value, expected_type)


def validate_scheduler(scheduler: dict, index: int, result: ValidationResult):
    """Validate a single scheduler entry."""
    scheduler_name = scheduler.get("name", f"<unnamed at index {index}>")
    prefix = f"Scheduler '{scheduler_name}'"

    # Check for required top-level fields
    for field, expected_type in REQUIRED_TOP_LEVEL_FIELDS.items():
        if field not in scheduler:
            result.add_error(f"{prefix}: Missing required field '{field}'")
        elif not validate_type(scheduler[field], expected_type):
            result.add_error(
                f"{prefix}: Field '{field}' has wrong type. "
                f"Expected {expected_type.__name__}, got {type(scheduler[field]).__name__}"
            )

    # Check for unknown top-level fields
    all_known_fields = set(REQUIRED_TOP_LEVEL_FIELDS.keys()) | set(OPTIONAL_TOP_LEVEL_FIELDS.keys())
    for field in scheduler.keys():
        if field not in all_known_fields:
            result.add_error(f"{prefix}: Unknown top-level field '{field}'")

    # Validate features section
    if "features" in scheduler and isinstance(scheduler["features"], dict):
        features = scheduler["features"]

        # Check for required feature fields
        for field, expected_type in REQUIRED_FEATURE_FIELDS.items():
            if field not in features:
                result.add_error(f"{prefix}: Missing required feature '{field}'")
            elif not validate_type(features[field], expected_type):
                result.add_error(
                    f"{prefix}: Feature '{field}' has wrong type. "
                    f"Expected {expected_type}, got {type(features[field]).__name__}"
                )

        # Check for unknown feature fields
        for field in features.keys():
            if field not in REQUIRED_FEATURE_FIELDS:
                result.add_error(f"{prefix}: Unknown feature field '{field}'")

    # Validate details section (optional but warn if fields are missing)
    if "details" in scheduler:
        if not isinstance(scheduler["details"], dict):
            result.add_error(f"{prefix}: 'details' should be an object/dict")
        else:
            details = scheduler["details"]

            # Warn about missing detail fields
            for field in EXPECTED_DETAIL_FIELDS.keys():
                if field not in details:
                    result.add_warning(f"{prefix}: Missing detail field '{field}'")
                elif not isinstance(details[field], str):
                    result.add_error(
                        f"{prefix}: Detail '{field}' has wrong type. "
                        f"Expected str, got {type(details[field]).__name__}"
                    )

            # Check for unknown detail fields
            for field in details.keys():
                if field not in EXPECTED_DETAIL_FIELDS:
                    result.add_error(f"{prefix}: Unknown detail field '{field}'")
    else:
        # No details section - warn for all expected fields
        for field in EXPECTED_DETAIL_FIELDS.keys():
            result.add_warning(f"{prefix}: Missing detail field '{field}' (no details section)")


def validate_schedulers_file(file_path: Path) -> ValidationResult:
    """Validate the entire schedulers.json file."""
    result = ValidationResult()

    # Check file exists
    if not file_path.exists():
        result.add_error(f"File not found: {file_path}")
        return result

    # Parse JSON
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        result.add_error(f"Invalid JSON: {e}")
        return result

    # Check root is an array
    if not isinstance(data, list):
        result.add_error("Root element must be an array")
        return result

    # Validate each scheduler
    for index, scheduler in enumerate(data):
        if not isinstance(scheduler, dict):
            result.add_error(f"Scheduler at index {index} is not an object")
            continue
        validate_scheduler(scheduler, index, result)

    return result


def main():
    # Determine file path
    script_dir = Path(__file__).parent
    schedulers_file = script_dir / "src" / "db" / "schedulers.json"

    print(f"Validating: {schedulers_file}")
    print("=" * 60)

    result = validate_schedulers_file(schedulers_file)

    # Print errors
    if result.errors:
        print(f"\n❌ ERRORS ({len(result.errors)}):")
        print("-" * 40)
        for error in result.errors:
            print(f"  • {error}")

    # Print warnings
    if result.warnings:
        print(f"\n⚠️  WARNINGS ({len(result.warnings)}):")
        print("-" * 40)
        for warning in result.warnings:
            print(f"  • {warning}")

    # Summary
    print("\n" + "=" * 60)
    if result.has_errors:
        print(f"❌ Validation FAILED with {len(result.errors)} error(s) and {len(result.warnings)} warning(s)")
        sys.exit(1)
    elif result.has_warnings:
        print(f"✅ Validation PASSED with {len(result.warnings)} warning(s)")
        sys.exit(0)
    else:
        print("✅ Validation PASSED with no issues")
        sys.exit(0)


if __name__ == "__main__":
    main()

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box className="loading-overlay">
      <Box className="loading-spinner-container">
        <CircularProgress 
          size={size} 
          thickness={4}
          className="loading-spinner"
        />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;

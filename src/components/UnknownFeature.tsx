// components/UnknownFeaturesDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface UnknownFeaturesDialogProps {
  open: boolean;
  onClose: () => void;
  unknownFeatures: string[];
  unknownCount: number;
}

const styles = {
    closeButton: {
      position: 'absolute',
      right: 8,
      top: 8,
    }
}

const UnknownFeaturesDialog: React.FC<UnknownFeaturesDialogProps> = ({
  open,
  onClose,
  unknownFeatures,
  unknownCount,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>⚠️ Unknown Features</DialogTitle>
      <IconButton 
        onClick={onClose}
        sx={(theme) => (
          {
            ...styles.closeButton,
            color: theme.palette.grey[500],
          }
        )}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          The following feature{unknownCount > 1 ? 's are' : ' is'} not recognized:
        </Typography>
        <List>
          {unknownFeatures.map((feature, index) => (
            <ListItem key={index}>
              <ListItemText primary={`- ${feature}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UnknownFeaturesDialog;

import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { formatKey } from "../utils/helpers";
import { Scheduler } from "../models/Schedulers";

interface SchedulerInfoProps {
  selectedScheduler: Scheduler;
  setSelectedScheduler: (scheduler: Scheduler | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}


const SchedulerInfoComponent = ({
  selectedScheduler,
  setSelectedScheduler,
  dialogOpen,
  setDialogOpen,
}: SchedulerInfoProps) => {
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedScheduler(null);
  };
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{selectedScheduler.name} - Details</DialogTitle>
      <IconButton 
        onClick={handleCloseDialog}
        className="dialog-close-button"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {selectedScheduler.details &&
          Object.entries(selectedScheduler.details).map(([key, value]) =>
            value ? (
              <Box key={key} mb={2}>
                <Typography variant="subtitle1" mb={1}>
                  {formatKey(key)}
                </Typography>
                <Typography className="text-sm">
                  {value.split(/(https?:\/\/[^\s]+)/g).map((part, idx) =>
                    part.startsWith("http") ? (
                      <a
                        key={idx}
                        href={part}
                        target="_blank"
                        rel="noreferrer"
                        className="hyperlink"
                      >
                        {part}
                      </a>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </Typography>
              </Box>
            ) : null
          )}
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerInfoComponent;

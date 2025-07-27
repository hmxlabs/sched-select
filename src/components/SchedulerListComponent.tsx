import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import {
  Button,
  Box,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SchedulerInfoComponent from "./SchedulerInfo";
interface Scheduler {
  name: string;
  link: string;
  isMatch?: boolean;
  unknownCount?: number;
  details?: Record<string, string>;
}
interface SchedulerListProps {
  schedulers: Scheduler[];
  generateShareableLink?: () => void;
  resetForm?: () => void;
  compact?: boolean;
}

const CustomButton = styled(Button)(() => ({
  padding: "4px 10px !important",
}));

const SchedulerListComponent: React.FC<SchedulerListProps> = ({
  schedulers,
  generateShareableLink,
  resetForm,
  compact = false,
}) => {
  const [selectedScheduler, setSelectedScheduler] = useState<Scheduler | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDetails = (scheduler: Scheduler) => {
    setSelectedScheduler(scheduler);
    setDialogOpen(true);
  };

  const renderScheduler = (
    scheduler: Scheduler,
    index: number,
    isMatch: boolean,
    compact: boolean
  ) => (
    <Box key={`${isMatch ? "match" : "no-match"}-${index}`} mb={2}>
      <a
        className={`schedulerLink ${isMatch ? "match" : "no-match"}`}
        href={scheduler.link}
        target="_blank"
        rel="noreferrer"
      >
        {isMatch ? (
          <CheckCircleIcon className="match-indicator match" />
        ) : (
          <CancelIcon className="match-indicator no-match" />
        )}
        <span className="schedulerName">
          <strong>{scheduler.name}</strong>
        </span>
        {!compact && scheduler.details ? (
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOpenDetails(scheduler);
            }}
            size="small"
            aria-label="view details"
          >
            <InfoOutlinedIcon
              fontSize="small"
              sx={{ color: "white", fontSize: 15 }}
            />
          </IconButton>
        ) : null}
      </a>

      {scheduler.unknownCount && scheduler.unknownCount > 0 ? (
        <div className="unknownFields">
          ( ⚠️ {scheduler.unknownCount} unknown feature
          {scheduler.unknownCount > 1 ? "s" : ""} )
        </div>
      ) : null}
    </Box>
  );

  return !schedulers.length ? (
    <>
      <h3 className="submissionText">
        Unfortunately, no schedulers match your selection
      </h3>
      <Button className="reset-button" variant="contained" onClick={resetForm}>
        <RefreshIcon fontSize="large" />
      </Button>
    </>
  ) : (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="submissionContainer"
      >
        <div className="submissionBox">
          {!compact && <h3 className="submissionTitle">Results</h3>}

          <p className="sched-category">MATCHES</p>
          {schedulers
            .filter((s) => s.isMatch)
            .map((s, i) => renderScheduler(s, i, true, compact))}

          <p className="sched-category">NOT A MATCH</p>
          {schedulers
            .filter((s) => !s.isMatch)
            .map((s, i) => renderScheduler(s, i, false, compact))}

          {!compact && (
            <div className="buttonContainer">
              <CustomButton
                className="share-button"
                variant="contained"
                onClick={generateShareableLink}
              >
                <ShareIcon fontSize="small" />
                <span className="btn-text">Share Link</span>
              </CustomButton>
              <CustomButton
                className="reset-button"
                variant="contained"
                onClick={resetForm}
              >
                <RefreshIcon fontSize="small" />
                <span className="btn-text">Restart</span>
              </CustomButton>
            </div>
          )}
        </div>

        {/* Details Dialog */}
        {selectedScheduler && (
          <SchedulerInfoComponent
            selectedScheduler={selectedScheduler}
            setSelectedScheduler={setSelectedScheduler}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulerListComponent;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SchedulerInfoComponent from "./SchedulerInfo";
import UnknownFeaturesDialog from "./UnknownFeature";
import { Scheduler } from "../models/Schedulers";
interface SchedulerListProps {
  schedulers: Scheduler[];
  generateShareableLink?: () => void;
  resetForm?: () => void;
  compact?: boolean;
  currentQuestionKey?: string;
}

const SchedulerListComponent: React.FC<SchedulerListProps> = ({
  schedulers,
  generateShareableLink,
  resetForm,
  compact = false,
  currentQuestionKey,
}) => {
  const [selectedScheduler, setSelectedScheduler] = useState<Scheduler | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [unknownFeaturesDialogOpen, setUnknownFeaturesDialogOpen] = useState(false);


  const handleOpenUnknownFeaturesDialog = (scheduler: Scheduler) => {
    setSelectedScheduler(scheduler);
    setUnknownFeaturesDialogOpen(true);
  }
  const handleCloseUnknownFeaturesDialog = () => {
    setUnknownFeaturesDialogOpen(false);
    setSelectedScheduler(null);
  }

  const handleOpenDetails = (scheduler: Scheduler) => {
    setSelectedScheduler(scheduler);
    setDialogOpen(true);
  };

  
  const renderScheduler = (
    scheduler: Scheduler,
    index: number,
    isMatch: boolean,
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
        <Tooltip title={scheduler.description || "No description available"} placement="bottom" arrow enterDelay={300}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (scheduler.details) {
                handleOpenDetails(scheduler);
              }
            }}
            size="small"
            aria-label="view details"
            className="details-button"
          >
            <InfoOutlinedIcon
              fontSize="small"
              className="details-icon"
            />
          </IconButton>
        </Tooltip>
        {currentQuestionKey && scheduler.details && scheduler.details[currentQuestionKey] && (
          <Tooltip title={scheduler.details[currentQuestionKey]} placement="bottom" arrow enterDelay={300}>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              size="small"
              aria-label="question details"
              className="details-button"
            >
              <HelpOutlineIcon
                fontSize="small"
                className="details-icon"
              />
            </IconButton>
          </Tooltip>
        )}
      </a>

      {scheduler.unknownCount && scheduler.unknownCount > 0 && scheduler.unknownFeatures && scheduler.unknownFeatures.length > 0 ? (
        <Box onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpenUnknownFeaturesDialog(scheduler);
        }} className="unknownFields">
          ( ⚠️ {scheduler.unknownCount} unknown feature
          {scheduler.unknownCount > 1 ? "s" : ""} )
        </Box>
      ) : null
      }
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
      >
        <div className="submissionBox schedulerBox">
          {!compact && <h3 className="submissionTitle">Results</h3>}

          <p className="sched-category">MATCHES</p>
          {schedulers
            .filter((s) => s.isMatch)
            .map((s, i) => renderScheduler(s, i, true))}

          <p className="sched-category">NOT A MATCH</p>
          {schedulers
            .filter((s) => !s.isMatch)
            .map((s, i) => renderScheduler(s, i, false))}
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
        
        {/* Unknown Features Dialog */}
        <UnknownFeaturesDialog
            open={unknownFeaturesDialogOpen}
            onClose={handleCloseUnknownFeaturesDialog} 
            unknownFeatures={selectedScheduler?.unknownFeatures || []}
            unknownCount={selectedScheduler?.unknownCount || 0}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulerListComponent;

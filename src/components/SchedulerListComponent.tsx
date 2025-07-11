import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from '@mui/material/styles';
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface Scheduler {
  name: string;
  link: string;
  isMatch?: boolean;
}

interface SchedulerListProps {
  schedulers: Scheduler[];
  generateShareableLink?: () => void;
  resetForm?: () => void;
  compact?: boolean;
}


const CustomButton = styled(Button)(({ theme }) => ({
  padding: '4px 10px !important'
}));

const SchedulerListComponent: React.FC<SchedulerListProps> = ({
  schedulers,
  generateShareableLink,
  resetForm,
  compact = false,
}) => {
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
          {!compact ? (
            <h3 className="submissionTitle">Results</h3>
          ) : null}
          <p className="sched-category">MATCHES</p>
          {
            schedulers
            .filter((scheduler) => scheduler.isMatch)
            .map((scheduler, index) => (
              <a
                key={`match-${index}`}
                className="schedulerLink match"
                href={scheduler.link}
                target="_blank"
                rel="noreferrer"
              >
                <CheckCircleIcon className="match-indicator match" />
                {/* <span className="match-indicator match">✔</span> */}
                <span className="schedulerName">
                  <strong>{scheduler.name}</strong>
                  {/* <OpenInNewIcon className="icon icon-sm" /> */}
                </span>
              </a>
          ))}
          <p className="sched-category">NOT A MATCH</p>
          {
            schedulers
            .filter((scheduler) => !scheduler.isMatch)
            .map((scheduler, index) => (
              <a
                key={index}
                className="schedulerLink no-match"
                href={scheduler.link}
                target="_blank"
                rel="noreferrer"
              >
                <CancelIcon className="match-indicator no-match" />
                {/* <span className="match-indicator no-match">✘</span> */}
                <span className="schedulerName">
                  <strong>{scheduler.name}</strong>
                  {/* <OpenInNewIcon className="icon icon-sm" /> */}
                </span>
              </a>
          ))}
          {!compact && (
            <div className="buttonContainer">
              <CustomButton
                className="share-button"
                variant="contained"
                onClick={generateShareableLink}
              >
                <ShareIcon fontSize="small"  />
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
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulerListComponent;

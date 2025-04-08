import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Scheduler {
  name: string;
  link: string;
}

interface SchedulerListProps {
  schedulers: Scheduler[];
  generateShareableLink?: () => void;
  resetForm?: () => void;
}

const SchedulerListComponent: React.FC<SchedulerListProps> = ({
  schedulers,
  generateShareableLink,
  resetForm,
}) => {
  return !schedulers.length ? (
    <>
      <h3 className="submissionText">
        Unfortunately, no schedulers match your selection
      </h3>
      <Button
          sx={{
            mt: 4,
            backgroundColor: "#fff",
            color: "#2591eb",
            "&:hover": { backgroundColor: "#2591eb", color: "#fff" },
          }}
          variant="contained"
          onClick={resetForm}
        >
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
        <h2 className="submissionTitle">Matching Schedulers:</h2>
        <div className="submissionBox">
          {schedulers.map((scheduler, index) => (
            <a
              key={index}
              className="schedulerLink"
              href={scheduler.link}
              target="_blank"
              rel="noreferrer"
            >
              <span className="schedulerName">
                <strong>{scheduler.name}</strong>
                <OpenInNewIcon sx={{ fontSize: 13 }} className="icon" />
              </span>
            </a>
          ))}
        </div>
        <div className="buttonContainer">
          <Button
            sx={{
              mt: 4,
              backgroundColor: "#fff",
              color: "#2591eb",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { backgroundColor: "#2591eb", color: "#fff" },
            }}
            variant="contained"
            onClick={generateShareableLink}
          >
            <ContentCopyIcon fontSize="small" />
            Share Link
          </Button>
          <Button
            sx={{
              mt: 4,
              backgroundColor: "#fff",
              color: "#2591eb",
              "&:hover": { backgroundColor: "#2591eb", color: "#fff" },
            }}
            variant="contained"
            onClick={resetForm}
          >
            <RefreshIcon fontSize="large" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulerListComponent;

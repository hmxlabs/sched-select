import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./Form.module.css";

interface Scheduler {
  name: string;
  link: string;
}

interface SchedulerListProps {
  schedulers: Scheduler[];
}

const SchedulerListComponent: React.FC<SchedulerListProps> = ({
  schedulers,
}) => {
  return !schedulers.length ? (
    <h3 className={styles.submissionText}>Unfortunately, no schedulers match your selection</h3>
  ) : (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.submissionContainer}
      >
        <h2 className={styles.submissionTitle}>Matching Schedulers:</h2>
        <div className={styles.submissionBox}>
          {schedulers.map((scheduler, index) => (
            <a
              key={index}
              style={{ textDecoration: "none", color: "inherit" }}
              href={scheduler.link}
              target="_blank"
            >
              <p className={styles.submissionText}>
                <strong>{scheduler.name}</strong>
              </p>
            </a>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulerListComponent;

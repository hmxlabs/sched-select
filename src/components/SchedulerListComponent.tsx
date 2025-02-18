import React from "react";

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
    <h3>Unfortunately, no schedulers match your selection</h3>
  ) : (
    <div>
      <h3>Matching Schedulers:</h3>
      <ul>
        {schedulers.map((scheduler, index) => (
          <li key={index}>
            <a
              style={{ textDecoration: "none", color: "inherit" }}
              href={scheduler.link}
              target="_blank"
            >
              {scheduler.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulerListComponent;

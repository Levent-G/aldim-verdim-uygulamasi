import { useCaptainContext } from "../../context/CaptainContext";

export const useFoundWeek = (weekId) => {
  const { weeks } = useCaptainContext();

  // ID karşılaştırmasında her iki tarafın da number olduğundan emin ol
  const numericWeekId = Number(weekId);
  const foundWeek = weeks.find((w) => Number(w?.weekId) === numericWeekId);

  const isFinished = Boolean(foundWeek?.isFinished);
  const foundUsers = foundWeek?.users || {};

  return {
    foundWeek: foundWeek,
    isFinished: isFinished || false,
    foundUsers: foundUsers || {},
  };
};

import { StatusCard, StatusCardTypes } from "./StatusCard";

export const StatusCardLoading = () => {
  return (
    <StatusCard
      type={StatusCardTypes.LOADING}
      title={"Loading..."}
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
    />
  );
};

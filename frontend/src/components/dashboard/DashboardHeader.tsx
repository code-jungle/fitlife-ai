import BaseHeader from "@/components/ui/BaseHeader";

const DashboardHeader = () => {
  return (
    <BaseHeader 
      variant="dashboard"
      showLogout={true}
    />
  );
};

export default DashboardHeader;
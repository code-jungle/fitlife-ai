import BaseHeader from "@/components/ui/BaseHeader";

interface StandardHeaderProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
}

const StandardHeader = ({ title, showBackButton = true, backPath = "/dashboard" }: StandardHeaderProps) => {
  return (
    <BaseHeader 
      variant="standard"
      title={title}
      showBackButton={showBackButton}
      backPath={backPath}
    />
  );
};

export default StandardHeader;
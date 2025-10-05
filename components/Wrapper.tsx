import { cn } from "@/lib/utils";

const Wrapper = ({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) => {
  return (
    <div
      className={cn(
        "max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4 gap-4 w-full",
        classname
      )}
    >
      {children}
    </div>
  );
};

export default Wrapper
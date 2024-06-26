import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface HintProps {
  children: React.ReactNode;
  description: string;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
}

export default function Hint({
  children,
  description,
  side = "bottom",
  sideOffset = 0,
}: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          className="text-sm max-w-[220px] break-words"
        > {/* break-words rompe las palabras si son muy grandes */}
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

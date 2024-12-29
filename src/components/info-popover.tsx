import { ReactNode } from "react";
import { InfoIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type InfoPopoverProps = {
  content: ReactNode;
}

export function InfoPopover({ content }: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0">
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Mais informações</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="text-sm">{content}</div>
      </PopoverContent>
    </Popover>
  );
}

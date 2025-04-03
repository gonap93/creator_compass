"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";
import { IndustryDate } from "../../lib/data/industryDates";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  industryDates?: IndustryDate[];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  industryDates = [],
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "w-full p-3",
        className
      )}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center h-10",
        caption_label: "text-base font-medium text-foreground",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent/50"
        ),
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground w-10 font-normal text-[0.8rem] uppercase",
        row: "flex w-full mt-2",
        cell: "text-center text-sm relative w-10 h-10 p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal hover:bg-accent/50 rounded-none",
          "aria-selected:opacity-100 aria-selected:bg-primary/10 aria-selected:text-primary aria-selected:hover:bg-primary/20"
        ),
        day_selected: 
          "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary",
        day_today: "bg-accent/5 text-accent-foreground font-semibold",
        day_outside: "text-muted-foreground/50 opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiers={{
        hasEvent: (date) =>
          industryDates.some(
            (event) => new Date(event.date).toDateString() === date.toDateString()
          ),
      }}
      numberOfMonths={1}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar }; 
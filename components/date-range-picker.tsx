"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { GrCalendar, GrUpdate } from "react-icons/gr";

interface CalendarDateRangePickerProps {
  className?: string;
  date: DateRange;
  setDate: SelectRangeEventHandler;
  updateFn: () => void;
}

export function CalendarDateRangePicker({
  className,
  date,
  setDate,
  updateFn,
}: CalendarDateRangePickerProps) {
  const disabledAttButton = !date || !date.from || !date.to;

  return (
    <div className="flex items-center">
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full md:w-[260px] justify-start text-left font-normal rounded-e-none border-primary",
                !date && "text-muted-foreground"
              )}
            >
              <GrCalendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button
        onClick={updateFn}
        disabled={disabledAttButton}
        className="rounded-s-none"
      >
        <GrUpdate />
      </Button>
    </div>
  );
}

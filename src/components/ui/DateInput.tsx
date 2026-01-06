import React from "react"
import { DayPicker } from "react-day-picker"
import { format, parse } from "date-fns"
import "react-day-picker/dist/style.css"
import { Input } from "./input"

type CustomDatePickerProps = {
    value: string
    onChange: (iso: string) => void
    required?: boolean
}

export const DateInput = ({ value, onChange, required }: CustomDatePickerProps) => {
    const [open, setOpen] = React.useState(false)
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 640)

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 640)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const selectedDate = value
        ? parse(value, "yyyy-MM-dd", new Date())
        : undefined

    const handleSelect = (date?: Date) => {
        if (!date) return
        onChange(format(date, "yyyy-MM-dd"))
        setOpen(false)
    }
    return (
        <div className="relative w-full">
            <Input
                value={selectedDate ? format(selectedDate, "dd-MM-yyyy") : ""}
                placeholder="DD-MM-YYYY"
                required={required}
                onFocus={() => setOpen(true)}
                readOnly
            />

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/50 sm:bg-transparent"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-1 pointer-events-none sm:pointer-events-auto">
                        <div className="pointer-events-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-3 max-h-[80vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleSelect}
                                showOutsideDays
                                captionLayout={isDesktop ? "dropdown" : undefined}
                                classNames={{
                                    months: "flex flex-col",
                                    month: "space-y-2",
                                    caption:
                                        "flex flex-wrap items-center justify-between mb-2 gap-1",
                                    caption_label:
                                        isDesktop ? "hidden" : "text-sm font-medium dark:text-slate-200",
                                    dropdown:
                                        "bg-transparent text-slate-700 dark:text-slate-200 text-sm p-1 border-none outline-none cursor-pointer",
                                    nav:
                                        "flex justify-between w-full",
                                    nav_button:
                                        "h-7 w-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-200",
                                    table: "w-full border-collapse",
                                    head_row: "grid grid-cols-7",
                                    head_cell:
                                        "text-xs text-slate-500 dark:text-slate-400 text-center",
                                    row: "grid grid-cols-7",
                                    cell: "text-center",
                                    day:
                                        "h-8 w-8 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100",
                                    day_selected:
                                        "bg-primary-500 text-white font-bold hover:bg-primary-600 dark:text-slate-900",
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

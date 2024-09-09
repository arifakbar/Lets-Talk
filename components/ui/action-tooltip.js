"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export default function ActionTooltip({ label, children, side, align }) {
    return <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align} >
                <p className="font-semibold text-sm capitalize" >{label.toLowerCase()}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}
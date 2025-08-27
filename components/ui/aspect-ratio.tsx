"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import * as React from "react";
import { cn } from "./utils"; // Optional: if you want to merge classNames

interface AspectRatioProps extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {
  className?: string;
}

function AspectRatio({ className, ...props }: AspectRatioProps) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" className={cn(className)} {...props} />;
}

export { AspectRatio };

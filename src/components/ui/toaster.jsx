import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast.jsx"

function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastPrimitive.Provider>
            {toasts.map(function ({ id, title, description, variant, ...props }) {
                return (
                    <ToastPrimitive.Root
                        key={id}
                        {...props}
                        className={cn(
                            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
                            variant === "success" && "bg-green-500 text-white",
                            variant === "destructive" && "bg-red-500 text-white",
                            variant === "warning" && "bg-yellow-500 text-black",
                            variant === "default" && "bg-white text-black"
                        )}
                    >
                        <div className="grid gap-1">
                            {title && (
                                <ToastPrimitive.Title className="text-sm font-semibold">
                                    {title}
                                </ToastPrimitive.Title>
                            )}
                            {description && (
                                <ToastPrimitive.Description className="text-sm opacity-90">
                                    {description}
                                </ToastPrimitive.Description>
                            )}
                        </div>
                        <ToastPrimitive.Close className="absolute top-2 right-2">
                            <span>×</span>
                        </ToastPrimitive.Close>
                    </ToastPrimitive.Root>
                )
            })}
            <ToastPrimitive.Viewport className="fixed bottom-0 z-[100] flex flex-col p-4 gap-2 md:bottom-4 md:right-4 md:max-w-[420px]" />
        </ToastPrimitive.Provider>
    )
}

export { Toaster }
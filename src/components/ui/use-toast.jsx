import { useState, useEffect } from 'react'
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000

const toastVariants = {
    default: "bg-white text-black border",
    success: "bg-green-500 text-white",
    destructive: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black"
}

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }
        case "DISMISS_TOAST": {
            const { toastId } = action

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId ? { ...t, open: false } : t
                ),
            }
        }
        case "REMOVE_TOAST":
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
    }
}

const listeners = []

let memoryState = { toasts: [] }

function dispatch(action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

function toast({ ...props }) {
    const id = genId()

    const update = (props) =>
        dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
        })

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            variant: props.variant || "default",
            onOpenChange: (open) => {
                if (!open) dismiss()
            },
        },
    })

    return {
        id,
        dismiss,
        update,
    }
}

function Toast({ children, className, variant = "default", ...props }) {
    return (
        <div
            className={cn(
                "p-4 rounded-md text-sm shadow-lg",
                toastVariants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function useToast() {
    const [state, setState] = useState(memoryState)

    useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [])

    return {
        ...state,
        toast,
        dismiss: (toastId) => dispatch({ type: "REMOVE_TOAST", toastId }),
    }
}

function genId() {
    return Math.random().toString(36).substring(2, 9)
}

export { toast, useToast, Toast }
import { toast } from "sonner"
import { X } from "lucide-react"

type ToastType = "success" | "error"

export function showToast(message: string, type: ToastType = "success") {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-4 px-5 py-4 border rounded-2xl w-full max-w-md bg-gradient-to-br from-white to-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.1)] ${
        type === "success" ? "border-green-600" : "border-red-600"
      }`}
    >
      <div
        className="flex items-center justify-center rounded-full w-6 h-6 shrink-0 text-white text-xs font-black"
        style={{
          backgroundColor: type === "success" ? "#16a34a" : "#dc2626",
        }}
      >
        {type === "success" ? "✓" : "✕"}
      </div>
      <span className="flex-1 text-base text-gray-900 font-satoshi-medium">
        {message}
      </span>
      <button
        // onClick={() => toast.dismiss(t.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5 cursor-pointer" />
      </button>
    </div>
  ))
}

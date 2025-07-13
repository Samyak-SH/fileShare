export function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "error" | "success";
  onClose: () => void;
}) {
  const bg =
    type === "error"
      ? "bg-black border border-red-500 text-red-500"
      : type === "success"
      ? "bg-black border border-green-500 text-green-500"
      : "bg-black border border-white text-white";
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg ${bg} flex items-center gap-4`}
      role="alert"
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white hover:text-gray-300"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
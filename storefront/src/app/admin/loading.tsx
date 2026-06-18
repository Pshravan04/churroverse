export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

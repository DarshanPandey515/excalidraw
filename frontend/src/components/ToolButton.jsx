export const ToolButton = ({ active, onClick, title, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
      active
        ? 'bg-[#6965db] text-white shadow-sm'
        : 'text-neutral-600 hover:bg-neutral-200/70'
    }`}
  >
    {children}
  </button>
);
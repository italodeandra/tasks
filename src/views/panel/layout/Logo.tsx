export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="157"
      height="140"
      viewBox="0 0 157 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M134 70C134 105.346 105.346 134 70 134C34.6538 134 6 105.346 6 70C6 34.6538 34.6538 6 70 6C105.346 6 134 34.6538 134 70Z"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="13 26"
        className="stroke-slate-600 dark:stroke-slate-300"
      />
      <path
        d="M36 56L70.5 86L135.5 30"
        stroke="#14B8A6"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  );
}

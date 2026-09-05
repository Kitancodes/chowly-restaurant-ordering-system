function Header({ role, onRoleChange }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0D0D0D]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <h1 className="text-base font-medium tracking-wide sm:text-lg">
            The Yellow Chilli
            <span className="ml-2 text-sm font-normal text-amber-300">
              . Victoria Island
            </span>
          </h1>
          <p className="text-xs tracking-wider text-white/50">
            Table 07</p>
        </div>

        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => onRoleChange("customer")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:px-5 sm:text-sm ${
              role === "customer"
                ? "bg-amber-500 text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => onRoleChange("waiter")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:px-5 sm:text-sm ${
              role === "waiter"
                ? "bg-amber-500 text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            Waiter
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
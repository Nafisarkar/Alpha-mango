function StatusBar() {
  return (
    <div className="h-6 w-full bg-sidebar border-t text-[10px] flex items-center justify-end text-muted-foreground select-none">
      <div className="flex items-center gap-0 h-full">
        <div className="px-3 h-full flex items-center border-l">
          <span>v0.1.0</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;

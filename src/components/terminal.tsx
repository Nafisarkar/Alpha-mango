import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Get color from style to match the rest of the application
    const style = getComputedStyle(document.documentElement);
    const bgColor = style.getPropertyValue("--background").trim() || "#09090b";
    const fgColor = style.getPropertyValue("--foreground").trim() || "#fafafa";
    const selectionColor =
      style.getPropertyValue("--accent").trim() || "rgba(255, 255, 255, 0.3)";
    const cursorColor = style.getPropertyValue("--primary").trim() || fgColor;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 12,
      fontFamily: '"Geist Mono", monospace',
      theme: {
        background: bgColor,
        foreground: fgColor,
        cursor: cursorColor,
        selectionBackground: selectionColor,
        black: "#000000",
        red: style.getPropertyValue("--destructive").trim() || "#ef4444",
        green: style.getPropertyValue("--primary").trim() || "#22c55e",
        yellow: style.getPropertyValue("--chart-2").trim() || "#eab308",
        blue: style.getPropertyValue("--chart-4").trim() || "#3b82f6",
        magenta: style.getPropertyValue("--chart-3").trim() || "#d946ef",
        cyan: style.getPropertyValue("--chart-1").trim() || "#06b6d4",
        white: "#fafafa",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);

    // Use a small timeout to ensure the container is rendered for FitAddon
    setTimeout(() => {
      fitAddon.fit();
    }, 100);

    // term.writeln("\x1b[32mWelcome to alpha-mango-sh\x1b[0m");
    term.write("\r\n\x1b[34m$ \x1b[0m");

    let input = "";
    term.onData((data) => {
      if (data === "\r") {
        term.write("\r\n");
        if (input.trim() === "clear") {
          term.clear();
        } else if (input.trim() !== "") {
          term.writeln(`Executed: ${input}`);
        }
        term.write("\x1b[34m$ \x1b[0m");
        input = "";
      } else if (data === "\x7f") {
        // Backspace
        if (input.length > 0) {
          input = input.slice(0, -1);
          term.write("\b \b");
        }
      } else {
        input += data;
        term.write(data);
      }
    });

    xtermRef.current = term;

    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default Terminal;

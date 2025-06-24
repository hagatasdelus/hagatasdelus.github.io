import { Sun, Moon } from "./ThemeIcons.tsx";

export default function ThemeToggle() {
  return (
    <div>
      <input type="checkbox" id="theme-toggle" className="hidden" />
      <label
        htmlFor="theme-toggle"
        className="cursor-pointer flex-center text-gray-500 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
      >
        <span id="theme-icon" className="relative inline-block w-6 h-6">
          <span id="sun-icon" className="absolute inset-0">
            <Sun />
            <audio id="theme-sound">
              <source src="/sounds/todark.mp3" type="audio/mp3" />
            </audio>
          </span>
          <span id="moon-icon" className="absolute inset-0 hidden">
            <Moon />
            <audio id="theme-sound">
              <source src="/sounds/tolight.mp3" type="audio/mp3" />
            </audio>
          </span>
        </span>
      </label>
    </div>
  );
}

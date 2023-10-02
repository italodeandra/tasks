"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function useModeToggle() {
    function disableTransitionsTemporarily() {
        document.documentElement.classList.add("[&_*]:!transition-none");
        window.setTimeout(function () {
            document.documentElement.classList.remove("[&_*]:!transition-none");
        }, 0);
    }
    function toggleMode() {
        disableTransitionsTemporarily();
        var darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        var isSystemDarkMode = darkModeMediaQuery.matches;
        var isDarkMode = document.documentElement.classList.toggle("dark");
        if (isDarkMode === isSystemDarkMode) {
            delete window.localStorage.isDarkMode;
        }
        else {
            window.localStorage.isDarkMode = isDarkMode;
        }
    }
    return toggleMode;
}
exports.default = useModeToggle;

import { Moon, Sun, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeSwitcher = () => {
  const { theme, colorBlindMode, toggleTheme, setColorBlindMode } = useTheme();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9"
      >
        {theme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Eye className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setColorBlindMode("none")}>
            Normal Vision
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorBlindMode("protanopia")}>
            Protanopia
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorBlindMode("deuteranopia")}>
            Deuteranopia
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorBlindMode("tritanopia")}>
            Tritanopia
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
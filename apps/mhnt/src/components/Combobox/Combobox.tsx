"use client";

import { Button } from "@shared/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/ui/components/command";
import { FormControl } from "@shared/ui/components/form";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/components/popover";
import { GetComponentProps } from "@shared/ui/lib/types";
import { cn } from "@shared/ui/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ComboboxProps extends GetComponentProps<typeof Button> {
  value: string;
  onValueSelect: (_: string) => void;
  options: string[];
  searchEnabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export const Combobox = (props: ComboboxProps) => {
  const {
    children,
    disabled,
    value,
    onValueSelect,
    options,
    searchEnabled = true,
    placeholder = "Select value",
    isLoading = false,
    ...rest
  } = props;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredOptions = useMemo(() => {
    if (debouncedSearchValue.trim()) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(debouncedSearchValue.trim().toLowerCase())
      );
      return filtered.slice(0, 200);
    }

    return options.length > 500 ? options.slice(0, 100) : options;
  }, [options, debouncedSearchValue]);

  const hasManyOptions = useMemo(() => {
    return options.length > 500;
  }, [options.length]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 150);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      onValueSelect(option);
      setSearchValue("");
      setDebouncedSearchValue("");
      closeBtnRef.current?.click();
    },
    [onValueSelect]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="flat"
            role="combobox"
            className={cn(
              "[&_svg]:size-4 px-3 font-normal justify-start relative h-auto bg-secondary border-2 border-border py-2"
            )}
            disabled={disabled || isLoading}
            {...rest}
          >
            <span
              className={cn(
                "",
                !value.length && "text-primary/50 text-sm py-1",
                isLoading && "text-primary text-sm py-1"
              )}
            >
              {isLoading ? "loading..." : value.length ? value : placeholder}
            </span>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {searchEnabled ? (
            <CommandInput
              placeholder={
                hasManyOptions
                  ? `Search ${options.length} values...`
                  : "Search values..."
              }
              className="h-9"
              value={searchValue}
              onValueChange={setSearchValue}
            />
          ) : null}
          <CommandList className="max-h-60 overflow-auto">
            <CommandEmpty>
              {hasManyOptions && !debouncedSearchValue.trim()
                ? `Type to search ${options.length} values`
                : "No values found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  value={option}
                  key={option}
                  onSelect={handleOptionSelect}
                >
                  {option}
                  <Check
                    className={cn(
                      "ml-auto",
                      option === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {hasManyOptions && !debouncedSearchValue.trim() && (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center border-t">
                {`Showing first 100 cities. Type to search all ${options.length} cities.`}
              </div>
            )}
          </CommandList>
        </Command>
        <PopoverClose btnRef={closeBtnRef} />
      </PopoverContent>
    </Popover>
  );
};

"use client";

import { RadioGroup, RadioGroupItem } from "@shared/ui/components/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@shared/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/components/select";
import { Input } from "@shared/ui/components/input";
import { useEffect, useState, useTransition } from "react";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { ErrorBlock } from "./ErrorBlock";
import { toast } from "@shared/ui/components/sonner";
import { updateDraft } from "@/actions/updateDraft";
import { Lot, Sex } from "@shared/db";
import { lotDraftSchema } from "@/lib/schemas/lotDraftSchema";
import { formatErrorMessage } from "@/lib/utils/createActionResponse";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/components/popover";
import { Calendar } from "@shared/ui/components/calendar";
import { cn } from "@shared/ui/lib/utils";

interface LotFormProps {
  isOnChain: boolean;
  lotData: Lot;
}

const ZERO_DATE = new Date(0);

const DEFAULT_NICKNAME_OPTIONS: string[] = [];
const DEFAULT_NICKAME_PLACEHOLDER = "Select nickname";

export const LotForm = ({ lotData, isOnChain }: LotFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nicknameOptions, setNicknameOptions] = useState<string[]>(
    DEFAULT_NICKNAME_OPTIONS
  );

  const {
    name: modelName,
    email: modelEmail,
    birthDate,
    bustSizeMM,
    waistSizeMM,
    hipsSizeMM,
    feetSizeMM,
    nickname,
    sex,
    passportCitizenship,
    locationCountry,
    locationCity,
    canTravel,
    hasAgency,
    googleDriveLink,
  } = lotData;

  const form = useForm<z.infer<typeof lotDraftSchema>>({
    disabled: isPending || lotData.isConfirmationEmailSent || isOnChain,
    mode: "onSubmit",
    resolver: zodResolver(lotDraftSchema),
    defaultValues: {
      sex: sex ?? "",
      nickname: nickname ?? "",
      name: modelName ?? "",
      email: modelEmail ?? "",
      birthDate: birthDate ?? ZERO_DATE,
      bustSizeMM: bustSizeMM ?? 0,
      waistSizeMM: waistSizeMM ?? 0,
      hipsSizeMM: hipsSizeMM ?? 0,
      feetSizeMM: feetSizeMM ?? 0,
      passportCitizenship: passportCitizenship ?? "",
      locationCountry: locationCountry ?? "",
      locationCity: locationCity ?? "",
      canTravel: typeof canTravel === "boolean" ? canTravel : "",
      hasAgency: typeof hasAgency === "boolean" ? hasAgency : "",
      googleDriveLink: googleDriveLink ?? "",
    },
  });

  const formSexValue = form.watch("sex");

  useEffect(() => {
    form.resetField("nickname");
    const dbOptions = JSON.parse(lotData.nicknameOptionsJson) as {
      [Sex.MALE]: string[];
      [Sex.FEMALE]: string[];
    };
    setNicknameOptions(
      formSexValue === "" ? DEFAULT_NICKNAME_OPTIONS : dbOptions[formSexValue]
    );
  }, [formSexValue]);

  const onSubmit = async ({
    name,
    email,
    birthDate,
    bustSizeMM,
    waistSizeMM,
    hipsSizeMM,
    feetSizeMM,
    nickname,
    sex,
    passportCitizenship,
    locationCountry,
    locationCity,
    canTravel,
    hasAgency,
    googleDriveLink,
  }: z.infer<typeof lotDraftSchema>) => {
    try {
      setErrorMessage(null);
      startTransition(async () => {
        const result = await updateDraft({
          lotId: lotData.id,
          updateData: {
            name: name !== "" ? name : null,
            email: email !== "" ? email : null,
            birthDate:
              birthDate.getTime() !== ZERO_DATE.getTime() ? birthDate : null,
            bustSizeMM: bustSizeMM !== 0 ? bustSizeMM : null,
            waistSizeMM: waistSizeMM !== 0 ? waistSizeMM : null,
            hipsSizeMM: hipsSizeMM !== 0 ? hipsSizeMM : null,
            feetSizeMM: feetSizeMM !== 0 ? feetSizeMM : null,
            nickname: nickname !== "" ? nickname : null,
            sex: sex !== "" ? sex : null,
            passportCitizenship:
              passportCitizenship !== "" ? passportCitizenship : null,
            locationCountry: locationCountry !== "" ? locationCountry : null,
            locationCity: locationCity !== "" ? locationCity : null,
            canTravel: canTravel !== "" ? canTravel : null,
            hasAgency: hasAgency !== "" ? hasAgency : null,
            googleDriveLink: googleDriveLink !== "" ? googleDriveLink : null,
          },
        });
        if (!result.success) {
          toast(result.errorMessage);
          return;
        }
        toast("Success");
      });
    } catch (error) {
      setErrorMessage(formatErrorMessage(error));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>{"model name"}</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="Enter model name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>{"model email"}</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
                  placeholder={"Enter model email for invitation"}
                  aria-invalid={!!form.formState.errors.email || !!errorMessage}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setErrorMessage(null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"date of birth"}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"flat"}
                      className={cn(
                        "relative pl-3 py-2 h-auto text-lg font-normal bg-secondary border-2"
                      )}
                    >
                      <span className="w-full text-start">
                        {field.value
                          ? field.value.toLocaleDateString()
                          : "Pick a date"}
                      </span>
                      <CalendarIcon className="absolute ml-auto right-2 top-1/2 -translate-y-1/2" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor={field.name}>{"sex"}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex justify-center items-center"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <FormItem className="flex items-center gap-1.5">
                      <FormControl>
                        <RadioGroupItem
                          value={Sex.FEMALE}
                          id={`sex-${Sex.FEMALE}`}
                        />
                      </FormControl>
                      <FormLabel
                        className="font-mono font-light text-lg px-0"
                        htmlFor={`sex-${Sex.FEMALE}`}
                      >
                        {"female"}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-1.5">
                      <FormControl>
                        <RadioGroupItem
                          value={Sex.MALE}
                          id={`sex-${Sex.MALE}`}
                        />
                      </FormControl>
                      <FormLabel
                        className="font-mono font-light text-lg px-0"
                        htmlFor={`sex-${Sex.MALE}`}
                      >
                        {"male"}
                      </FormLabel>
                    </FormItem>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                {"nickname (auto-generated options)"}
              </FormLabel>
              <FormControl>
                <Select
                  {...field}
                  disabled={form.getValues("sex") === ""}
                  onValueChange={(value: string) => {
                    form.setValue("nickname", value);
                    form.clearErrors("nickname");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={DEFAULT_NICKAME_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    {nicknameOptions.map((each) => (
                      <SelectItem key={each} value={each}>
                        {each}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
          <FormField
            control={form.control}
            name="bustSizeMM"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>{"bust (in mm)"}</FormLabel>
                <FormControl>
                  <Input
                    className="w-24"
                    id={field.name}
                    type="number"
                    min={0}
                    aria-invalid={!!form.formState.errors.name}
                    placeholder="Value"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waistSizeMM"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>{"waist (in mm)"}</FormLabel>
                <FormControl>
                  <Input
                    className="w-24"
                    id={field.name}
                    type="number"
                    min={0}
                    aria-invalid={!!form.formState.errors.name}
                    placeholder="Value"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hipsSizeMM"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>{"hips (in mm)"}</FormLabel>
                <FormControl>
                  <Input
                    className="w-24"
                    id={field.name}
                    type="number"
                    min={0}
                    aria-invalid={!!form.formState.errors.name}
                    placeholder="Value"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="feetSizeMM"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>{"feet (in mm)"}</FormLabel>
                <FormControl>
                  <Input
                    className="w-24"
                    id={field.name}
                    type="number"
                    min={0}
                    aria-invalid={!!form.formState.errors.name}
                    placeholder="Value"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <ErrorBlock message={errorMessage} />
        <div className="w-full flex justify-end items-center">
          <Button
            type="submit"
            variant="secondary"
            disabled={
              !form.formState.isDirty ||
              isPending ||
              !!Object.keys(form.formState.errors).length ||
              isOnChain
            }
          >
            {isPending ? (
              <LoaderCircle className="py-1 animate-spin h-8 w-8" />
            ) : (
              "Save draft"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

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
import { Input } from "@shared/ui/components/input";
import {
  useEffect,
  useState,
  useTransition,
  useMemo,
  useCallback,
  memo,
} from "react";
import { LoaderCircle } from "lucide-react";
import { ErrorBlock } from "./ErrorBlock";
import { toast } from "@shared/ui/components/sonner";
import { updateDraft } from "@/actions/updateDraft";
import { Lot, Sex } from "@shared/db";
import { lotDraftSchema } from "@/lib/schemas/lotDraftSchema";
import { Heading } from "@shared/ui/components/Heading";
import { COUNTRIES_LIST, Country } from "@/lib/dictionaries/countriesList";
import { useCityOptions } from "@/lib/hooks/useCityOptions";
import { Combobox } from "../Combobox/Combobox";
import { DatePicker } from "../DatePicker/DatePicker";

interface LotFormProps {
  isOnChain: boolean;
  lotData: Lot;
}

const ZERO_DATE = new Date(0);
const DEFAULT_EMPTY_OPTIONS: string[] = [];
const DEFAULT_NICKAME_PLACEHOLDER = "Select nickname";

export const LotForm = memo(function LotForm({
  lotData,
  isOnChain,
}: LotFormProps) {
  const [isTransitionPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nicknameOptions, setNicknameOptions] = useState<string[]>(
    DEFAULT_EMPTY_OPTIONS
  );

  const parsedNicknameOptions = useMemo(() => {
    try {
      return JSON.parse(lotData.nicknameOptionsJson) as {
        [Sex.MALE]: string[];
        [Sex.FEMALE]: string[];
      };
    } catch (error) {
      console.error("Failed to parse nickname options:", error);
      return { [Sex.MALE]: [], [Sex.FEMALE]: [] };
    }
  }, [lotData.nicknameOptionsJson]);

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

  const defaultValues = useMemo(
    () =>
      ({
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
      }) as z.infer<typeof lotDraftSchema>,
    [
      sex,
      nickname,
      modelName,
      modelEmail,
      birthDate,
      bustSizeMM,
      waistSizeMM,
      hipsSizeMM,
      feetSizeMM,
      passportCitizenship,
      locationCountry,
      locationCity,
      canTravel,
      hasAgency,
      googleDriveLink,
    ]
  );

  const form = useForm<z.infer<typeof lotDraftSchema>>({
    disabled:
      isTransitionPending || lotData.isConfirmationEmailSent || isOnChain,
    mode: "onSubmit",
    resolver: zodResolver(lotDraftSchema),
    defaultValues,
  });

  const formSexValue = form.watch("sex");

  useEffect(() => {
    form.setValue("nickname", formSexValue !== sex ? "" : (nickname ?? ""), {
      shouldDirty: true,
    });

    const newOptions =
      formSexValue === ""
        ? DEFAULT_EMPTY_OPTIONS
        : parsedNicknameOptions[formSexValue] || DEFAULT_EMPTY_OPTIONS;

    setNicknameOptions(newOptions);
  }, [formSexValue, sex, nickname, parsedNicknameOptions, form]);

  const formLocationCountryValue = form.watch("locationCountry");

  const {
    data: citiesResponse,
    isLoading: isCitiesLoading,
    isPending: isCitiesPending,
    isError: isCitiesError,
  } = useCityOptions(formLocationCountryValue as Country);

  const citiesOptions = useMemo(() => {
    return citiesResponse?.success
      ? citiesResponse.data
      : DEFAULT_EMPTY_OPTIONS;
  }, [citiesResponse]);

  const isCitiesDisabled = useMemo(() => {
    return (
      isCitiesPending ||
      isCitiesLoading ||
      isCitiesError ||
      !citiesResponse?.success
    );
  }, [
    isCitiesPending,
    isCitiesLoading,
    isCitiesError,
    citiesResponse?.success,
  ]);

  const onSubmit = useCallback(
    async ({
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
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
      }
    },
    [lotData.id]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage(null);
      return e;
    },
    []
  );

  const handleNicknameChange = useCallback(
    (value: string) => {
      form.setValue("nickname", value, { shouldDirty: true });
      form.clearErrors("nickname");
    },
    [form]
  );

  const handlePassportCitizenshipChange = useCallback(
    (value: string) => {
      form.setValue("passportCitizenship", value, { shouldDirty: true });
      form.clearErrors("passportCitizenship");
    },
    [form]
  );

  const handleLocationCountryChange = useCallback(
    (value: string) => {
      const currentCountry = form.getValues("locationCountry");
      if (currentCountry !== value) {
        form.setValue("locationCountry", value, { shouldDirty: true });
        form.setValue("locationCity", "", { shouldDirty: true });
        form.clearErrors("locationCountry");
        form.clearErrors("locationCity");
      }
    },
    [form]
  );

  const handleLocationCityChange = useCallback(
    (value: string) => {
      const currentCity = form.getValues("locationCity");
      if (currentCity !== value) {
        form.setValue("locationCity", value, { shouldDirty: true });
        form.clearErrors("locationCity");
      }
    },
    [form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <Heading className="my-3" variant="card" tag={"h3"}>
          {"Personal Info"}
        </Heading>

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
                    handleEmailChange(e);
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
              <DatePicker value={field.value} onValueSelect={field.onChange} />
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleNicknameChange(
                      sex === form.getValues("sex") ? (nickname ?? "") : ""
                    );
                  }}
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
                <Combobox
                  value={field.value}
                  onValueSelect={handleNicknameChange}
                  options={nicknameOptions}
                  searchEnabled={false}
                  placeholder={DEFAULT_NICKAME_PLACEHOLDER}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passportCitizenship"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor={field.name}>
                {"country of citizenship"}
              </FormLabel>
              <Combobox
                value={field.value}
                onValueSelect={handlePassportCitizenshipChange}
                options={COUNTRIES_LIST as unknown as string[]}
                placeholder="Select"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>{"location (country)"}</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueSelect={handleLocationCountryChange}
                  options={COUNTRIES_LIST as unknown as string[]}
                  placeholder="Select country"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationCity"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{"location (city)"}</FormLabel>
              <Combobox
                value={field.value}
                onValueSelect={handleLocationCityChange}
                options={citiesOptions}
                disabled={isCitiesDisabled}
                placeholder="Select city"
                isLoading={isCitiesLoading}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Heading className="my-3" variant="card" tag={"h3"}>
          {"Measurements"}
        </Heading>

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

        <Heading className="my-3" variant="card" tag={"h3"}>
          {"Polaroids & Book"}
        </Heading>

        <FormField
          control={form.control}
          name="googleDriveLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>{"Google Drive link"}</FormLabel>
              <FormControl>
                <Input
                  id={field.name}
                  aria-invalid={!!form.formState.errors.name}
                  placeholder="https://drive.google.com/drive/your-link"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ErrorBlock message={errorMessage} />

        <div className="w-full flex justify-end items-center">
          <Button
            type="submit"
            variant="secondary"
            disabled={
              !form.formState.isDirty ||
              isTransitionPending ||
              !!Object.keys(form.formState.errors).length ||
              isOnChain
            }
          >
            {isTransitionPending ? (
              <LoaderCircle className="py-1 animate-spin h-8 w-8" />
            ) : (
              "Save draft"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});

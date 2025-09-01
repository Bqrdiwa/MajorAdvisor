import {
  Button,
  cn,
  Input,
  RadioGroup,
  useRadio,
  VisuallyHidden,
  type RadioProps,
} from "@heroui/react";
import { buttonStyle, inputStyle } from "../../../components/Styles";
import { useMemo } from "react";

interface InputProps {
  loading: boolean;
  back: () => void;
  formData?: Record<string, any> | null; // <-- allow null/undefined
}

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    getBaseProps,
    getInputProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between tap-highlight-transparent",
        "max-w-[300px] cursor-pointer bg-secondary/20 p-3",
        "data-[selected=true]:bg-secondary data-[selected=true]:text-content1"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div {...getLabelWrapperProps()}>
        {children && <span>{children}</span>}
      </div>
    </Component>
  );
};

export default function Transcript({ loading, formData, back }: InputProps) {
  const STAGE_INPUTS = useMemo(() => {
    if (formData?.trackId === "Math") {
      return [
        { label: "ریاضیات", name: "Mathematics" },
        { label: "فیزیک", name: "Physics" },
        { label: "شیمی", name: "Chemistry" },
      ];
    } else if (formData?.trackId === "Humanities") {
      return [
        { label: "ادبیات و علوم انسانی", name: "PersianLiteratureSpec" },
        { label: "ریاضی و آمار", name: "Mathematics" },
        { label: "فلسفه و منطق", name: "LogicPhilosophy" },
        { label: "تاریخ و جغرافیا", name: "HistoryGeography" },
        { label: "علوم اجتماعی (جامعه شناسی)", name: "Sociology" },
        { label: "روانشناسی", name: "Psychology" },
        { label: "اقتصاد", name: "ArabicSpec" },
        { label: "زبان عربی", name: "Economics" },
      ];
    } else {
      return [
        { label: "زیست‌شناسی", name: "Biology" },
        { label: "شیمی", name: "Chemistry" },
        { label: "ریاضیات", name: "Mathematics" },
        { label: "فیزیک", name: "Physics" },
        { label: "زمین شناسی", name: "Geology" },
      ];
    }
  }, [formData?.trackId]);

  return (
    <>
      <h3 className="col-span-2">پذیرش در رشته‌های بدون آزمون</h3>
      <RadioGroup
        isRequired
        className="w-full"
        defaultValue={
          formData?.eligibility?.noExam_DayEvening?.toString() ?? undefined
        }
        errorMessage="تعیین کنید که روزانه هستید یا نوبت دوم"
        orientation="horizontal"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="روزانه / نوبت دوم"
        name="eligibility.noExam_DayEvening"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        defaultValue={
          formData?.eligibility?.noExam_VirtualSelf?.toString() ?? undefined
        }
        className="w-full"
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        orientation="horizontal"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="مجازی / پردیس خودگردان"
        name="eligibility.noExam_VirtualSelf"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        defaultValue={
          formData?.eligibility?.noExam_PayameNoor_NonProfit?.toString() ??
          undefined
        }
        className="w-full"
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        orientation="horizontal"
        name="eligibility.noExam_PayameNoor_NonProfit"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="پیام نور / غیرانتفاعی"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        defaultValue={
          formData?.eligibility?.noExam_Azad?.toString() ?? undefined
        }
        className="w-full"
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        orientation="horizontal"
        name="eligibility.noExam_Azad"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="دانشگاه آزاد اسلامی"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <h3 className="col-span-2">پذیرش در رشته‌های با آزمون</h3>

      <RadioGroup
        defaultValue={
          formData?.eligibility?.exam_DayEvening?.toString() ?? undefined
        }
        className="w-full"
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        orientation="horizontal"
        name="eligibility.exam_DayEvening"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="روزانه / نوبت دوم"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        className="w-full"
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        defaultValue={
          formData?.eligibility?.exam_VirtualSelf_Azad?.toString() ?? undefined
        }
        orientation="horizontal"
        name="eligibility.exam_VirtualSelf_Azad"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="مجازی / پردیس خودگردان"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        defaultValue={
          formData?.eligibility?.exam_PayameNoor_NonProfit?.toString() ??
          undefined
        }
        className="w-full"
        orientation="horizontal"
        name="eligibility.exam_PayameNoor_NonProfit"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="پیام نور / غیرانتفاعی"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        defaultValue={
          formData?.eligibility?.exam_Azad_Except4Majors?.toString() ??
          undefined
        }
        className="w-full"
        orientation="horizontal"
        name="eligibility.exam_Azad_Except4Majors"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="دانشگاه آزاد اسلامی"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        isRequired
        errorMessage="گزینه را انتخاب کنید"
        defaultValue={
          formData?.eligibility?.exam_ShahidRajai?.toString() ?? undefined
        }
        className="w-full"
        orientation="horizontal"
        name="eligibility.exam_ShahidRajai"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="دانشگاه شهید رجایی"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <RadioGroup
        isRequired
        defaultValue={
          formData?.eligibility?.exam_Behyari?.toString() ?? undefined
        }
        errorMessage="گزینه را انتخاب کنید"
        orientation="horizontal"
        className="w-full"
        name="eligibility.exam_Behyari"
        classNames={{
          wrapper: "grid grid-cols-2 gap-[1px] rounded-xl overflow-hidden",
          label: "pr-4",
        }}
        label="رشته‌های بهیاری"
      >
        <CustomRadio value="true">مجاز</CustomRadio>
        <CustomRadio value="false">غیر مجاز</CustomRadio>
      </RadioGroup>

      <h3 className="mt-4 col-span-2">درصدهای آزمون سراسری مرحله اول</h3>
      <div className="grid gap-3 grid-col-1 lg:grid-cols-3 col-span-2 w-full">
        {STAGE_INPUTS.map((stage) => {
          const lessons:
            | { subjectId: string; percentage: number }[]
            | undefined = formData?.stage1Scores;

          const defaultValue =
            lessons
              ?.find((lesson) => lesson.subjectId === stage.name)
              ?.percentage?.toString() ?? undefined;

          return (
            <Input
              key={stage.name}
              dir="ltr"
              variant="bordered"
              defaultValue={defaultValue}
              classNames={inputStyle}
              label={stage.label}
              name={`stage1Scores.${stage.name}`}
              placeholder={`درصد درس ${stage.label} را وارد کنید`}
              labelPlacement="outside"
              errorMessage={`درصد درس ${stage.label} را وارد کنید`}
              size="lg"
            />
          );
        })}
      </div>

      <h3 className="mt-4 col-span-2">درصدهای آزمون سراسری مرحله دوم</h3>
      <div className="grid gap-3 grid-col-1 lg:grid-cols-3 col-span-2 w-full">
        {STAGE_INPUTS.map((stage) => {
          const lessons:
            | { subjectId: string; percentage: number }[]
            | undefined = formData?.stage2Scores;

          const defaultValue =
            lessons
              ?.find((lesson) => lesson.subjectId === stage.name)
              ?.percentage?.toString() ?? undefined;

          return (
            <Input
              key={stage.name}
              variant="bordered"
              defaultValue={defaultValue}
              dir="ltr"
              classNames={inputStyle}
              label={stage.label}
              name={`stage2Scores.${stage.name}`}
              placeholder={`درصد درس ${stage.label} را وارد کنید`}
              labelPlacement="outside"
              errorMessage={`درصد درس ${stage.label} را وارد کنید`}
              size="lg"
            />
          );
        })}
      </div>

      <div className="flex col-span-2 justify-between">
        <Button
          isDisabled={loading}
          type="button"
          name="back"
          className={buttonStyle}
          onPress={back}
          color="primary"
          variant="light"
        >
          قبلی
        </Button>
        <Button
          isLoading={loading}
          type="submit"
          className={buttonStyle + "justify-self-end"}
          color="primary"
        >
          بعدی
        </Button>
      </div>
    </>
  );
}

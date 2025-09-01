import { Button, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import {
  buttonStyle,
  inputStyle,
  selectStyle,
} from "../../../components/Styles";

import { Quata, TRACKS } from "../../../api/Setting";
import { useEffect, useState } from "react";
interface InputProps {
  loading: boolean;
  formData: Record<string, any>;
  back: () => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
export default function Education({
  loading,
  back,
  formData,
  setFormData,
}: InputProps) {
  const [isAttended, setIsAttended] = useState(false);
  useEffect(() => {
    setIsAttended(formData.notAttended1404);
  }, [formData.notAttended1404]);
  return (
    <>
      <Select
        isRequired
        variant="bordered"
        classNames={selectStyle}
        defaultSelectedKeys={formData.trackId ? [formData.trackId] : undefined}
        label="گروه ازمایشی"
        popoverProps={{ classNames: { content: "rounded-md" } }}
        name="trackId"
        errorMessage="گروه آزمایشی خود را انتخاب کنید."
        placeholder="تجربی, ریاضی..."
        labelPlacement="outside"
        size="lg"
      >
        {TRACKS.map((province) => (
          <SelectItem key={province.value}>{province.label}</SelectItem>
        ))}
      </Select>
      <Select
        isRequired
        defaultSelectedKeys={formData.quota ? [formData.quota] : undefined}
        variant="bordered"
        classNames={selectStyle}
        label="سهمیه"
        popoverProps={{ classNames: { content: "rounded-md" } }}
        name="quota"
        errorMessage="سهمیه خود را انتخاب کنید"
        placeholder="سهمیه خود را انتخاب کنید"
        labelPlacement="outside"
        size="lg"
      >
        {Quata.map((q) => (
          <SelectItem key={q.value}>{q.label}</SelectItem>
        ))}
      </Select>
      <Input
        isRequired
        variant="bordered"
        classNames={inputStyle}
        defaultValue={
          formData.academicGpaTotal ? formData.academicGpaTotal : undefined
        }
        label="نمره کل سابقه تحصیلی"
        name="academicGpaTotal"
        placeholder="نمره را وارد کنید "
        labelPlacement="outside"
        errorMessage="نمره را وارد کنید "
        size="lg"
      />
      <div className="col-span-2 mb-5">
        <Checkbox
          name="notAttended1404"
          defaultSelected={formData.notAttended1404}
          onValueChange={(value: boolean) => {
            setFormData((prev) => ({
              ...prev,
              notAttended1404: value,
            }));
            setIsAttended(value);
          }}
        >
          در آزمون سراسری ۱۴۰۴ شرکت نکرده‌ام و متقاضی انتخاب رشته بر اساس سوابق
          تحصیلی هستم.
        </Checkbox>
      </div>
      <Input
        isRequired
        variant="bordered"
        type="text"
        classNames={inputStyle}
        isDisabled={isAttended}
        label="نمره کل آزمون اختصاصی"
        defaultValue={
          formData.examTotalSpecial ? formData.examTotalSpecial : undefined
        }
        name="examTotalSpecial"
        placeholder="نمره را وارد کنید "
        labelPlacement="outside"
        errorMessage="نمره را وارد کنید "
        size="lg"
      />
      <Input
        variant="bordered"
        classNames={inputStyle}
        label="نمره کل نهایی"
        defaultValue={
          formData.examFinalTotal ? formData.examFinalTotal : undefined
        }
        name="examFinalTotal"
        isRequired
        placeholder="نمره را وارد کنید "
        isDisabled={isAttended}
        labelPlacement="outside"
        errorMessage="نمره را وارد کنید "
        size="lg"
      />
      <Input
        variant="bordered"
        classNames={inputStyle}
        defaultValue={
          formData.finalQuotaScore ? formData.finalQuotaScore : undefined
        }
        isRequired
        isDisabled={isAttended}
        label="تراز کل در سهمیه نهایی"
        name="finalQuotaScore"
        placeholder="تراز را وارد کنید مثلا (۸۷۹۵)"
        labelPlacement="outside"
        errorMessage="تراز را وارد کنید مثلا (۸۷۹۵)"
        size="lg"
      />
      <Input
        variant="bordered"
        isRequired
        isDisabled={isAttended}
        classNames={inputStyle}
        label="رتبه کل در سهمیه نهایی"
        defaultValue={
          formData.finalQuotaRank ? formData.finalQuotaRank : undefined
        }
        name="finalQuotaRank"
        placeholder="رتبه را وارد کنید مثلا (۴۳۲۳)"
        labelPlacement="outside"
        errorMessage="رتبه را وارد کنید مثلا (۴۳۲۳)"
        size="lg"
      />

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

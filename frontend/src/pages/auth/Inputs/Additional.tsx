import { useEffect, useState } from "react";
import apiClient from "../../../api/ApiClient";
import {
  Checkbox,
  Select,
  SelectItem,
  Divider,
  Button,
  Chip,
} from "@heroui/react";
import { buttonStyle, selectStyle } from "../../../components/Styles";
import { Minus } from "../../../components/Icons";

interface InputProps {
  loading: boolean;
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function Additional({
  loading,
  formData,
  setFormData,
}: InputProps) {
  const [preferences, setPreferences] = useState({ majors: [] as string[] });
  const [ploading, setPloading] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const [selectedMajors, setSelectedMajors] = useState<string[]>(formData.preferences);

  const fetchPreferences = async () => {
    setPloading(true);
    try {
      const res = await apiClient.get("/metadata/majors");
      setPreferences(res.data);
    } finally {
      setPloading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access") && formData.trackId) {
      fetchPreferences();
    }
  }, [formData.trackId]);

  return (
    <>
      {/* checkboxes */}
      <div className="col-span-2 mb-5">
        <Checkbox
          defaultSelected={formData?.interests?.interest_Art28}
          onValueChange={(value: boolean) => {
            setFormData((prev) => ({
              ...prev,
              interests: { ...prev.interests, interest_Art28: value },
            }));
          }}
          name="interests.interest_Art28"
        >
          علاقه‌مند به رشته‌هایی هستم که پایان تحصیل در ماده ۲۸ شرکت کنم.
        </Checkbox>
      </div>
      <div className="col-span-2 mb-5">
        <Checkbox
          defaultSelected={formData?.interests?.interest_PrivateClinic}
          onValueChange={(value: boolean) => {
            setFormData((prev) => ({
              ...prev,
              interests: { ...prev, interest_PrivateClinic: value },
            }));
          }}
          name="interests.interest_PrivateClinic"
        >
          علاقه‌مند به رشته‌هایی هستم که پایان تحصیل بتوانم مطب بزنم.
        </Checkbox>
      </div>
      <div className="col-span-2 mb-5">
        <Checkbox
          defaultSelected={formData?.interests?.interest_PrivateLab}
          onValueChange={(value: boolean) => {
            setFormData((prev) => ({
              ...prev,
              interests: { ...prev.interests, interest_PrivateLab: value },
            }));
          }}
          name="interests.interest_PrivateLab"
        >
          علاقه‌مند به رشته‌هایی هستم که پایان تحصیل بتوانم آزمایشگاه بزنم.
        </Checkbox>
      </div>
      <div className="col-span-2 mb-5">
        <Checkbox
          onValueChange={(value: boolean) => {
            setFormData((prev) => ({
              ...prev,
              interests: { ...prev.interests, interest_HiddenCapacity: value },
            }));
          }}
          defaultSelected={formData?.interests?.interest_HiddenCapacity}
          name="interests.interest_HiddenCapacity"
        >
          علاقه‌مند به رشته‌هایی هستم که دارای ظرفیت پنهان هستند.
        </Checkbox>
      </div>
      <div className="col-span-2 mb-5">
        <Checkbox
          defaultSelected={formData?.interests?.interest_MedDentPharmPara_Online}
          onValueChange={(value: boolean) => {
            setFormData((prev) => ({
              ...prev,
              interests: { ...prev.interests, interest_MedDentPharmPara_Online: value },
            }));
          }}
          name="interests.interest_MedDentPharmPara_Online"
        >
          علاقه‌مند به رشته‌های تحصیلی پزشکی، دندان‌پزشکی، داروسازی و پیراپزشکی
          آنلاین هستم (۲ سال غیر حضوری)
        </Checkbox>
      </div>

      {/* select */}
      <div className="col-span-2 w-full max-w-full">
        <Select
          selectionMode="multiple"
          isLoading={ploading}
          variant="bordered"
          classNames={selectStyle}
          name="preferences"
          label="رشته‌های مورد علاقه"
          listboxProps={{ emptyContent: "رشته ای پیدا نشد" }}
          placeholder="رشته ها مثلا (پزشکی, مهندسی کامپیوتر...)"
          labelPlacement="outside"
          errorMessage="رشته های بیشتری انتخاب کنید"
          size="lg"
          selectedKeys={selectedMajors}
          onSelectionChange={(keys) =>
            setSelectedMajors(Array.from(keys) as string[])
          }
        >
          {preferences.majors.map((major) => (
            <SelectItem key={major}>{major}</SelectItem>
          ))}
        </Select>

        {/* selected items with remove buttons */}
        {selectedMajors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedMajors.map((major) => (
              <Chip
                key={major}
                variant="faded"
                color="primary"
                startContent={<Minus />}
                onPress={() =>
                  setSelectedMajors((prev) => prev.filter((m) => m !== major))
                }
                as={Button}
              >
                <span>{major}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      <Divider className="mt-10" />

      {/* final checkbox + submit */}
      <div className="items-center pb-20 gap-5 col-span-2 flex flex-col mt-10 w-full">
        <Checkbox
          isSelected={isAttended}
          onValueChange={setIsAttended}
          name="interests.interest_MedDentPharmPara_Online"
        >
          قوانین را مطالعه کرده و می‌پذیرم.
        </Checkbox>

        <Button
          isLoading={loading}
          isDisabled={!isAttended}
          type="submit"
          className={buttonStyle + " justify-self-end max-w-full w-sm"}
          color="primary"
        >
          ثبت نهایی اطلاعات
        </Button>
      </div>
    </>
  );
}

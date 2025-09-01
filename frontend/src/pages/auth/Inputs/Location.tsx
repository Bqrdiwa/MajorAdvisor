import { Button, Select, SelectItem } from "@heroui/react";
import { buttonStyle, selectStyle } from "../../../components/Styles";

import { GENDERS, GET_CITY_ENDPOINT, PROVINCES } from "../../../api/Setting";
import { useEffect, useState, type ChangeEvent } from "react";
import apiClient from "../../../api/ApiClient";
interface InputProps {
  loading: boolean;
  canLogin: boolean;
  formData: Record<string, any>;
  back: () => void;
}
interface CityResponse {
  id: number;
  name: string;
}
export default function Location({
  loading,
  back,
  canLogin,
  formData,
}: InputProps) {
  const [cloading, setCloading] = useState(false);
  const [citys, setCitys] = useState<CityResponse[]>([]);
  const [data, setData] = useState(formData);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const fetchCitys = async () => {
    setCloading(true);
    try {
      const res = await apiClient.get(GET_CITY_ENDPOINT(PROVINCES.filter((province) => data.province == province.value)[0]?.label));
      if (res.status == 200) {
        setCitys(res.data);
      }
    } finally {
      setCloading(false);
    }
  };
  useEffect(() => {
    console.log(PROVINCES.filter((province) => data.province == province.value)[0]?.label)
    data.province && fetchCitys();
  }, [data.province]);
  useEffect(()=>{
    setData(formData)
  },[formData])
  return (
    <>
      <Select
        isRequired
        variant="bordered"
        classNames={selectStyle}
        onChange={handleChange}
        label="استان"
        selectedKeys={[data.province]}
        popoverProps={{ classNames: { content: "rounded-md" } }}
        name="province"
        errorMessage="استان محل زندگی خود را وارد کنید."
        placeholder="استان محل زندگی خود را وارد کنید."
        labelPlacement="outside"
        size="lg"
      >
        {PROVINCES.map((province) => (
          <SelectItem key={province.value}>{province.label}</SelectItem>
        ))}
      </Select>
      <Select
        isRequired
        onChange={handleChange}
        isDisabled={data.province == "" && data.city == ""}
        selectedKeys={[data.city]}
        isLoading={cloading}
        variant="bordered"
        listboxProps={{ emptyContent: "شهری پیدا نشد" }}
        classNames={selectStyle}
        label="شهر"
        popoverProps={{ classNames: { content: "rounded-md" } }}
        name="city"
        errorMessage="شهر محل زندگی خود را وارد کنید."
        placeholder="شهر محل زندگی خود را وارد کنید."
        labelPlacement="outside"
        size="lg"
      >
        {citys.map((city) => (
          <SelectItem key={city.name}>{city.name}</SelectItem>
        ))}
      </Select>
      <Select
        isRequired
        variant="bordered"
        onChange={handleChange}
        classNames={selectStyle}
        selectedKeys={[data.gender]}
        label="جنسیت"
        popoverProps={{ classNames: { content: "rounded-md" } }}
        name="gender"
        errorMessage="جنسیت خود را وارد کنید"
        placeholder="مرد, زن"
        labelPlacement="outside"
        size="lg"
      >
        {GENDERS.map((province) => (
          <SelectItem key={province.value}>{province.label}</SelectItem>
        ))}
      </Select>
      <div className="flex col-span-2 justify-between">
        {canLogin ? (
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
        ) : (
          <div />
        )}

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

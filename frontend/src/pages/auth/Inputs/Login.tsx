import { Button, Input, Link } from "@heroui/react";
import { buttonStyle, inputStyle } from "../../../components/Styles";
import { Link as RouterLink } from "react-router-dom";

interface SignInProps {
  loading: boolean;  formData: Record<string,any>
}

export default function Login({ loading }: SignInProps) {
  return (
    <>
      <Input
        variant="bordered"
        isRequired
        classNames={inputStyle}
        label="شماره تلفن"
        type="tel"
        autoComplete="tel"
        errorMessage="شماره تلفن خود را وارد کنید"
        name="phone"
        placeholder="شماره تلفن خود را وارد کنید"
        labelPlacement="outside"
        size="lg"
      />
      <Input
        variant="bordered"
        isRequired
        classNames={inputStyle}
        label="کد ملی"
        name="nationalId"
        placeholder=" کد ملی ۱۰ رقمی خود را وارد کنید"
        labelPlacement="outside"
        errorMessage=" کد ملی ۱۰ رقمی خود را وارد کنید"
        size="lg"
      />
      <div className="grid col-span-2 mt-10 w-full">
        <Link
          isBlock
          className="text-blue-500 w-fit"
          as={RouterLink}
          to="#signup"
        >
          برای ثبت نام از این بخش وارد شوید
        </Link>
        <Button
          isLoading={loading}
          type="submit"
          className={buttonStyle + "justify-self-end"}
          color="primary"
        >
          ورود
        </Button>
      </div>
    </>
  );
}

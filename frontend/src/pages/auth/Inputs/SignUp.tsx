import { Button, Input, Link } from "@heroui/react";
import { buttonStyle, inputStyle } from "../../../components/Styles";
import { Link as RouterLink } from "react-router-dom";
interface SignUpProps {
  loading: boolean;
  formData: Record<string, any>;
}

export default function SignUp({ loading }: SignUpProps) {
  return (
    <>
      <Input
        isRequired
        variant="bordered"
        classNames={inputStyle}
        label="نام"
        name="firstName"
        placeholder="نام خود را وارد کنید مثلا(مریم)"
        labelPlacement="outside"
        errorMessage="نام خود را وارد کنید مثلا(مریم)"
        size="lg"
      />
      <Input
        variant="bordered"
        isRequired
        classNames={inputStyle}
        label="نام خانوادگی"
        name="lastName"
        placeholder="نام خانوادگی خود را وارد کنید مثلا(شکرهی)"
        labelPlacement="outside"
        errorMessage="نام خانوادگی خود را وارد کنید مثلا(شکرهی)"
        size="lg"
      />
      <Input
        variant="bordered"
        isRequired
        classNames={inputStyle}
        lang="en"
        label="کد ملی"
        name="nationalId"
        placeholder=" کد ملی ۱۰ رقمی خود را وارد کنید"
        labelPlacement="outside"
        errorMessage=" کد ملی ۱۰ رقمی خود را وارد کنید"
        size="lg"
      />
      <Input
        variant="bordered"
        lang="en"
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
      <div className="grid col-span-2 mt-10 w-full">
        <Link
          isBlock
          className="text-blue-500 w-fit"
          as={RouterLink}
          to="#login"
        >
          برای ورود از این بخش وارد شوید
        </Link>
        <Button
          isLoading={loading}
          type="submit"
          className={buttonStyle + "justify-self-end"}
          color="primary"
        >
          ثبت نام
        </Button>
      </div>
    </>
  );
}

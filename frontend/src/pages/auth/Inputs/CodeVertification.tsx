  import { Button, InputOtp } from "@heroui/react";
  import { buttonStyle } from "../../../components/Styles";
  interface InputProps {
    loading: boolean;
    formData: Record<string, any>;
    back: () => void;
  }
  export default function CodeVertification({ loading, back }: InputProps) {
    return (
      <>
        <div className="flex justify-center w-full col-span-2">
          <InputOtp
            dir="ltr"
            isRequired
            lang="en"
            classNames={{ errorMessage: "text-right" }}
            name="code"
            length={4}
            color="secondary"
            errorMessage="کد تایید ارسال شده به شماره همراه خود را وارد کنید."
            label="کد تایید"
          />
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
            className={buttonStyle}
            color="primary"
          >
            تایید
          </Button>
        </div>
      </>
    );
  }

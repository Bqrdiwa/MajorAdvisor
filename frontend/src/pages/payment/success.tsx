import { Button } from "@heroui/react";
import { Check } from "../../components/Icons";
import { Link } from "react-router-dom";

export default function SuccessPayment() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="bg-content1 text-center max-w-sm p-6 flex flex-col gap-10 rounded-3xl">
        <div className="flex  items-center flex-col gap-5 text-xl font-bold">
          <div className="w-20 h-20 rounded-full text-success border-success border-2 flex items-center justify-center">
            <Check className="w-10" />
          </div>
          <h1>پرداخت شما موفق بود</h1>
        </div>
        <p>
          پرداخت با موفقیت انجام شد. لطفاً تعهدنامه خود را آپلود کنید تا بتوانید
          از امکانات انتخاب رشته استفاده کنید.
        </p>

        <Button as={Link} to="/" color="primary">
          متوجه شدم
        </Button>
      </div>
    </div>
  );
}

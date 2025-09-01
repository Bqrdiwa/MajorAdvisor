import { Button } from "@heroui/react";
import { X } from "../../components/Icons";
import { Link } from "react-router-dom";

export default function DangerPayment() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="bg-content1 text-center max-w-sm p-6 flex flex-col gap-10 rounded-3xl">
        <div className="flex  items-center flex-col gap-5 text-xl font-bold">
          <div className="w-20 h-20 rounded-full text-danger border-danger border-2 flex items-center justify-center">
            <X className="w-10" />
          </div>
          <h1>پرداخت شما ناموفق بود</h1>
        </div>
        <p>
          کاربر گرامی، در صورتی که مبلغ از حساب شما کسر شده باشد، حداکثر تا ۷۲
          ساعت آینده به حساب شما بازگردانده خواهد شد. در غیر این صورت، لطفاً
          برای پیگیری موضوع با مدیریت سایت تماس بگیرید.
        </p>
        <Button as={Link} to="/" color="primary">
          متوجه شدم
        </Button>
      </div>
    </div>
  );
}

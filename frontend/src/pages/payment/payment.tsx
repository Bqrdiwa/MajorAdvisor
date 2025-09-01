import { Alert, Button, Divider } from "@heroui/react";
import WaveLayout from "../../layouts/waveLayout";
import { buttonStyle } from "../../components/Styles";
import apiClient from "../../api/ApiClient";
import { useState } from "react";

export default function Payment() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/payment");
      if (res.data.url) {
        // redirect to external payment gateway
        window.location.href = res.data.url;
        // or if you want new tab: window.open(res.data.url, "_blank");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:p-8">
      <WaveLayout>
        <div className="bg-secondary/5 flex flex-col lg:rounded-3xl lg:m-6 p-6">
          <h1 className="w-sm text-xl font-bold text-secondary">نحوه پرداخت</h1>
          <p className="mb-5">
            نتایج انتخاب رشته‌ی نهایی نیازمند پرداخت هزینه می‌باشد.
          </p>
          <Alert color="secondary">
            پس از پرداخت باید حتما تعهد نامه بارگزاری شود و ما پس از تحلیل
            کارنامه شما پس از ۷۲ ساعت انتخاب رشته شما را تحویل شما میدهیم.
          </Alert>

          <Divider className="my-5" />
          <div className="flex w-full justify-between">
            <p className="font-semibold text-lg">قابل پرداخت</p>
            <p>۱۵,۰۰۰,۰۰۰ تومان</p>
          </div>
          <Button
            isLoading={loading}
            onPress={handlePayment}
            className={buttonStyle + " w-fit mt-10 mx-auto"}
            color="primary"
          >
            پرداخت صورت حساب
          </Button>
        </div>
      </WaveLayout>
    </div>
  );
}

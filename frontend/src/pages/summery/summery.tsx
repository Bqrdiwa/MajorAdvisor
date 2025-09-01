import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/ApiClient";
import { Button, Divider, Image, Skeleton } from "@heroui/react";
import Group51 from "../../assets/Group 51.svg";
import Group52 from "../../assets/Group 52.svg";
import { buttonStyle } from "../../components/Styles";

interface PreferredMajor {
  percent: number;
  preferredMajor: string;
}
export default function Summery() {
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [preferredMajors, setPreferredMajors] = useState<PreferredMajor[]>();
  const fetchSummery = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/ai/summary");
      setPreferredMajors(res.data?.preferredMajors);
    } catch {
      nav("/");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSummery();
  }, []);
  return (
    <div className="lg:rounded-3xl w-full relative flex flex-col bg-secondary/5  max-w-full">
      <div className="flex h-20 mb-5 mt-5 justify-between">
        <div className="flex p-6 items-center gap-2">
          <Image src={Group51} classNames={{wrapper:"hidden"}}/>
          <h1 className="font-bold text-lg text-black">
            احتمال قبولی در رشته‌های مورد علاقه
          </h1>
        </div>
        <Image src={Group52} />
      </div>
      <div className="flex px-6 pb-6 flex-col gap-3">
        {loading ? (
          <>
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </>
        ) : preferredMajors && preferredMajors?.length > 0 ? (
          preferredMajors.map((major, index) => (
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 text-center rounded-full border-1 border-primary flex items-center justify-center font-bold">
                {("0" + (index + 1))
                  .toString()
                  .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)])}
              </div>
              <p className="font-normal flex-1 text-sm">
                شما با احتمال{" "}
                <span className="text-black font-bold">
                  {major.percent
                    .toString()
                    .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)])}
                </span>
                ٪ یکی از کد رشته‌های رشته‌ی{" "}
                <span className="text-black font-bold">
                  {major.preferredMajor}
                </span>{" "}
                را قبول می‌شوید.
              </p>
            </div>
          ))
        ) : (
          <p className="py-10 text-default-500 italic">
            در دریافت اطلاعات انتخاب رشته شما مشکلی پیش آمده, در حال بررسی
            هستیم...
          </p>
        )}
        <Divider className="mt-6" />
        <Button as={Link} to="/payment" disabled={loading} color="primary" className={buttonStyle + "w-fit mx-auto"}>
          انجام انتخاب رشته نهایی
        </Button>
        
      </div>
    </div>
  );
}

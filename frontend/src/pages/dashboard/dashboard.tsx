import { Button, Image } from "@heroui/react";
import Shot from "../../assets/523shots_so 1.png";
import Vector1 from "../../assets/Vector 6.svg";
import Vector2 from "../../assets/Vector 7.svg";
import Vector3 from "../../assets/Rectangle 14.svg";
import { Check } from "../../components/Icons";
import { buttonStyle } from "../../components/Styles";
import { useSession } from "../../api/SessionContext";
import { Link as RouterLink } from "react-router-dom";

const STEP = [
  {
    label: "تکمیل اطلاعات",
    disableArr: ["Nothing"],
    buttonendpoint: "/profile",
    Key: "Nothing",
    CKey: "CompleteInformation",
    desc: "مدل هوش‌مصنوعی با اطلاعات تحصیلی شما نتایج دقیقی را ارائه می‌دهد.",
  },
  {
    disableArr: ["Nothing", "CompleteInformation"],
    label: "پرداخت",
    buttonendpoint: "/payment",
    CKey: "Paid",
    Key: "CompleteInformation",
    desc: "نتایج انتخاب رشته‌ی نهایی نیازمند پرداخت هزینه می‌باشد.",
  },
  {
    disableArr: ["Nothing", "CompleteInformation", "Paid"],
    label: "ارسال تعهدنامه",
    Key: "Paid",
    buttonendpoint: "/commitment",
    CKey: "SentEvidence",
    desc: "لازم است که تعهدنامه در سامانه بارگزاری شود. پس از بارگزاری، تعهدنامه باید از طریق پست برای پرگار ارسال شود.",
  },
  {
    label: "نمایش نتایج نهایی",
    buttonendpoint: "#",
    disableArr: ["Nothing", "CompleteInformation", "Paid", "SentEvidence"],
    key: "SentEvidence",
    CKey: "Final",
    desc: "پس از حداقل ۷۲ ساعت از تایید تعهدنامه، نتایج انتخاب رشته در بخش تاریخچه انتخاب رشته به نمایش درخواهد آمد.",
  },
];

export default function Dashboard() {
  const { session } = useSession();
  return (
    <div className="bg-content1/64 flex-1 px-6 lg:px-20 relative">
      <div className=" absolute hidden lg:flex top-0 left-0 w-full justify-between">
        <Image className="rounded-none" src={Vector2} />
        <Image className="rounded-none" src={Vector3} />
        <Image className="rounded-none" src={Vector1} />
      </div>
      <div className="flex flex-col w-full justify-between h-full ">
        <div className="flex lg:flex-col h-fit">
          <div className=" text-default-400 hidden lg:flex h-full lg:flex-row flex-col lg:w-full p-14 py-5 pt-12 items-center">
            {STEP.map((step, index) => (
              <>
                <div
                  className={
                    "w-10 h-10 flex items-center justify-center rounded-full " +
                    (!step.disableArr.includes(session?.state || "")
                      ? "bg-success "
                      : index == 0
                      ? " text-blue-700 rounded-full border-1 border-blue-500"
                      : STEP[index - 1].CKey == session?.state
                      ? " text-blue-700 rounded-full border-1 border-blue-500"
                      : " border-1 border-default-300 rounded-full")
                  }
                >
                  {!step.disableArr.includes(session?.state || "") ? (
                    <Check className="w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index != STEP.length - 1 && (
                  <div
                    className={
                      "flex-1 h-[2px] " +
                      (step.CKey == session?.state
                        ? "bg-gradient-to-l from-green-500 to-blue-500"
                        : "bg-default-300")
                    }
                  ></div>
                )}
              </>
            ))}
          </div>
          <div className="flex w-full pt-20 lg:pt-0 lg:flex-row flex-col justify-between">
            {STEP.map((step, index) => (
              <div className="flex gap-5">
                <div className="lg:hidden flex flex-col items-center">
                  <div
                    className={
                      "w-10 h-10 flex items-center justify-center rounded-full " +
                      (!step.disableArr.includes(session?.state || "")
                        ? "bg-success "
                        : index == 0
                        ? " text-blue-700 rounded-full border-1 border-blue-500"
                        : STEP[index - 1].CKey == session?.state
                        ? " text-blue-700 rounded-full border-1 border-blue-500"
                        : " border-1 border-default-300 rounded-full")
                    }
                  >
                    {!step.disableArr.includes(session?.state || "") ? (
                      <Check className="w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index != STEP.length - 1 && (
                    <div
                      className={
                        "flex-1 w-[2px] h-full " +
                        (step.CKey == session?.state
                          ? "bg-gradient-to-b from-green-500 to-blue-500"
                          : "bg-default-300")
                      }
                    ></div>
                  )}
                </div>{" "}
                <div className="flex w-40 h-[300px] lg:h-fit items-center text-center flex-col gap-2">
                  {session?.state == "Paid" &&
                  session?.evidenceStatus !== null &&
                  step.CKey == "SentEvidence" ? (
                    session?.evidenceStatus == "NotSeen" ? (
                      <p className="text-warning-500">در انتظار تایید</p>
                    ) : session.evidenceStatus == "Rejected" ? (
                      <p className="text-danger-500">
                        رد شده, دوباره بارگزاری کنید
                      </p>
                    ) : (
                      ""
                    )
                  ) : (
                    <h2 className="text-black">{step.label}</h2>
                  )}

                  <p className="font-light">{step.desc}</p>
                  {step.label &&
                    session?.state == step.Key &&
                    (session?.evidenceStatus ? (
                      <div>
                        <Button
                          as={RouterLink}
                          to={step.buttonendpoint}
                          className={buttonStyle}
                          color="primary"
                        >
                          بارگزاری مجدد
                        </Button>
                      </div>
                    ) : (
                      <Button
                        as={RouterLink}
                        to={step.buttonendpoint}
                        className={buttonStyle}
                        color="primary"
                      >
                        {step.label}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-fit hidden lg:flex  w-full">
          <Image
            classNames={{
              wrapper: "!max-w-full w-full",
              img: "max-w-full w-full",
            }}
            className="max-w-full w-full"
            src={Shot}
          />
        </div>
      </div>
    </div>
  );
}

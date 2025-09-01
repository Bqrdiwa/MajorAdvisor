import { useEffect, useState } from "react";
import WaveLayout from "./waveLayout";
import HighlightedText from "../components/HighlightedText";
import { Button, Image } from "@heroui/react";
import Logo from "../assets/logo.png";
import { APPLICATION_TITLE } from "../api/Setting";
import { Outlet, useNavigate } from "react-router-dom";

export default function QuestionLayer() {
  const [question, setQuestion] = useState<null | "signup" | "ai" | "edit">(
    null
  );

  const nav = useNavigate();


  useEffect(() => {
    if (!question) return;

    switch (question) {
      case "ai":
        nav("/choice");
        break;
      case "edit":
        nav("/profile");
        break;
      case "signup":
        localStorage.removeItem("access");
        nav("/auth#signup");
        break;
    }
  }, [question, nav]);


  // Shared content (no repetition)
  const renderContent = () => (
    <div className="w-screen p-8 pargarX flex h-screen items-center justify-center">
      <WaveLayout className="w-full flex-col h-full flex ">
        <div className="flex flex-col items-center gap-10 p-10 h-full w-full">
          <HighlightedText>
            <h1 className="text-2xl text-primary">چی کار کنیم؟</h1>
          </HighlightedText>

          <div className="flex gap-5 w-fit max-w-full flex-col items-center">
            <div className="flex p-10 flex-1 w-full justify-center border-2 rounded-2xl border-primary">
              <Image
                src={Logo}
                classNames={{
                  wrapper: "max-h-full object-cover !max-w-full",
                }}
                className="w-full"
                alt={`لوگوی ${APPLICATION_TITLE}`}
              />
            </div>

            <div className="flex-wrap flex gap-2">
              <Button
                onPress={() => setQuestion("ai")}
                size="lg"
                color="primary"
                variant="ghost"
              >
                انتخاب رشته ۱۴۰۴
              </Button>
              <Button
                onPress={() => setQuestion("signup")}
                size="lg"
                color="primary"
                variant="ghost"
              >
                ثبت نام جدید
              </Button>
              <Button
                onPress={() => setQuestion("edit")}
                size="lg"
                color="primary"
                variant="ghost"
              >
                ویرایش اطلاعات کاربری
              </Button>
            </div>
          </div>
        </div>
      </WaveLayout>
    </div>
  );

  if (!question) return renderContent();
  return question ? <Outlet /> : renderContent();
}

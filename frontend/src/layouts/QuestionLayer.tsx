import { useEffect, useState } from "react";
import HighlightedText from "../components/HighlightedText";
import {
  Button,
  ButtonGroup,
  Image,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import Logo from "../assets/logo.png";
import { APPLICATION_TITLE } from "../api/Setting";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Vector1 from "../assets/Vector 6.svg";
import Vector2 from "../assets/Vector 7.svg";
import Vector3 from "../assets/Rectangle 14.svg";

export default function QuestionLayer() {
  const [question, setQuestion] = useState<
    null | "signup" | "ai" | "edit" | "done"
  >(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const nav = useNavigate();
  const location = useLocation();
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
    onOpenChange();
  }, [question, nav]);

  // Open modal once on mount
  useEffect(() => {
    !question && onOpen();
  }, [onOpen, location.pathname]);
  const handleOpenChange = () => {
    setQuestion("done");
    
  };
  return (
    <>
      <Modal hideCloseButton isOpen={isOpen} onOpenChange={handleOpenChange}>
        <ModalContent className="max-w-3xl relative pargarX">
          <div className=" absolute flex top-0 left-0 w-full justify-between">
            <Image className="rounded-none" src={Vector2} />
            <Image className="rounded-none hidden sm:block" src={Vector3} />
            <Image className="rounded-none" src={Vector1} />
          </div>
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
              <ButtonGroup className="hidden sm:flex">
                <Button
                  onPress={() => setQuestion("ai")}
                  size="lg"
                  color="primary"
                  variant="ghost"
                >
                  نمایش درصد احتمال قبولی ها
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
                  ورود و ویرایش اطلاعات کاربری
                </Button>
              </ButtonGroup>
              <div className="flex-wrap w-full sm:hidden flex gap-2">
                <Button
                  fullWidth
                  onPress={() => setQuestion("ai")}
                  size="lg"
                  color="primary"
                  variant="ghost"
                >
                  انتخاب رشته ۱۴۰۴
                </Button>
                <Button
                  fullWidth
                  onPress={() => setQuestion("signup")}
                  size="lg"
                  color="primary"
                  variant="ghost"
                >
                  ثبت نام جدید
                </Button>
                <Button
                  fullWidth
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
        </ModalContent>
      </Modal>
      <Outlet />
    </>
  );
}

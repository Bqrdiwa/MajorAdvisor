import { Button, Image } from "@heroui/react";
import PargarXIcon from "../assets/logo.png";
import SideBarNavigarRect from "../assets/side-bar-nav.png";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "../api/SessionContext";

const items = [
  { label: "داشبورد", endpoint: "/", disableArr: [] },
  { label: "مشخصات کاربری", endpoint: "/profile", disableArr: [] },
  {
    label: "انتخاب رشته ۱۴۰۴",
    endpoint: "/choice",
    disableArr: ["Nothing"],
  },
  {
    label: "بارگزاری تعهدنامه",
    endpoint: "/commitment",
    disableArr: ["Nothing", "CompleteInformation"],
  },
  {
    label: "تاریخچه انتخاب رشته",
    endpoint: "/history",
    disableArr: ["Nothing", "CompleteInformation", "Paid", "SentEvidence"],
  },
];
export default function SideBar({ close = true }: { close?: boolean }) {
  const location = useLocation();
  const { session } = useSession();
  console.log(session);
  return (
    session?.role =="USER" && 
    <div
      className={
        "h-full lg:flex max-w-10/12 overflow-hidden w-100 relative  bg-content1 " +
        (close ? "hidden" : "")
      }
    >
      <div className="flex h-fit w-full pt-8 justify-center">
        <Image src={PargarXIcon} />
      </div>

      <div className="absolute top-1/2 w-full  flex  -translate-y-1/2">
        <Image
          className="pointer-events-none select-none"
          src={SideBarNavigarRect}
        />
        <div className="absolute flex pr-[8px] items-center py-25 top-0 h-full flex-col justify-around">
          <Button
            variant="light"
            as={RouterLink}
            to="/"
            className="z-10"
            isIconOnly
          >
            <Image className="w-7" src={"/icons/category.svg"} />
          </Button>
          <Button
            variant="light"
            as={RouterLink}
            to="/profile"
            className="z-10"
            isIconOnly
          >
            <Image className="w-7" src={"/icons/user.svg"} />
          </Button>
          <Button
            as={RouterLink}
            to="/choice"
            isDisabled={["Nothing"].includes(session?.state || "")}
            variant="light"
            className="z-10"
            isIconOnly
          >
            <Image className="w-7" src={"/icons/note.svg"} />
          </Button>
          <Button
            as={RouterLink}
            to="/commitment"
            isDisabled={["Nothing", "CompleteInformation"].includes(
              session?.state || ""
            )}
            variant="light"
            className="z-10"
            isIconOnly
          >
            <Image className="w-7" src={"/icons/direct-send.svg"} />
          </Button>
          <Button
            as={RouterLink}
            to="/history"
            isDisabled={[
              "Nothing",
              "CompleteInformation",
              "Paid",
              "SentEvidence",
            ].includes(session?.state || "")}
            variant="light"
            className="z-10"
            isIconOnly
          >
            <Image className="w-7" src={"/icons/directbox-default.svg"} />
          </Button>
        </div>
        <AnimatePresence>
          <div className="flex flex-1 py-25 top-0 pr-3 flex-col justify-around">
            {items.map((item) => (
              <div
                className={
                  "w-full  duration-200 justify-between items-center flex " +
                  (item.endpoint == location.pathname ? "text-brown " : " ") +
                  (item.disableArr.includes(session?.state || "")
                    ? "text-brown/30 !cursor-default"
                    : "cursor-pointer hover:text-brown/90")
                }
              >
                <Link
                  isDisabled={item.disableArr.includes(session?.state || "")}
                  className="cursor-[inherit]"
                  as={RouterLink}
                  to={item.endpoint}
                >
                  {item.label}
                </Link>
                {item.endpoint == location.pathname && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    exit={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="h-[calc(100%_+_8px)] w-[6px] rounded-r-full bg-brown"
                  />
                )}
              </div>
            ))}
          </div>{" "}
        </AnimatePresence>
      </div>
    </div>
  );
}

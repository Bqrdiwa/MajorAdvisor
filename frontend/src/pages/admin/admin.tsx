import {
  Alert,
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  Skeleton,
  Slider,
  Switch,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import UserTable, { stateDict } from "./userListTable";
import { useEffect, useState } from "react";
import { ChevronRight, Menu } from "../../components/Icons";

import { Reorder } from "framer-motion";
import apiClient from "../../api/ApiClient";
import { buttonStyle } from "../../components/Styles";

const DraggableChoices = ({
  userData,
  type = "interestsBased",
  setUserData,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  type?: "interestsBased" | "allMajors";
  interests: {
    code: string;
    priority: number;
    probabilityPercent: number;
    university: string;
    majorName: string;
  }[];
}) => {
  const [items, setItems] = useState<
    {
      code: string;
      priority: number;
      probabilityPercent: number;
      university: string;
      majorName: string;
    }[]
  >(userData[type].items);
  useEffect(() => {
    setItems(userData[type].items);
  }, [userData]);
  return (
    <div className="bg-content1 rounded-2xl">
      {userData[type].items.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={userData[type].items.map((i) => i.code)}
          onReorder={(newOrder) => {
            const reordered = newOrder.map((code) =>
              userData[type].items.find((i) => i.code === code)
            );
            setUserData({
              ...userData,
              [type]: {
                ...userData[type],
                items: reordered.map((item, index) => {
                  const newItem = { ...item };
                  newItem.priority = index + 2;
                  return newItem;
                }),
              },
            });
          }}
          className="flex flex-col gap-3 relative"
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.code}
              value={item.code}
              drag="y"
              onDragEnd={(_event: any, info: any) => {
                // if user drags more than 100px above container, remove it
                if (info.point.y < -100) {
                  setUserData({
                    ...userData,
                    [type]: {
                      ...userData[type],
                      items: userData[type].items.filter(
                        (i) => i.code !== item.code
                      ),
                    },
                  });
                }
              }}
              className="p-4 rounded-lg cursor-grab gap-3 justify-between flex"
            >
              <div className="flex gap-2">
                <div className="text-default-500">
                  <Menu />
                </div>
                {item.majorName + " " + item.university + ` (${item.code})`}
              </div>
              <Chip className="relative overflow-hidden">
                <div
                  className="bg-secondary/40 z-0 h-full absolute top-0 left-0"
                  style={{ width: item.probabilityPercent + "%" }}
                ></div>
                <p className="z-2">{item.probabilityPercent}</p>
              </Chip>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <p className="italic text-sm text-center">
          برای این کاربر انتخاب رشته ای انجام نشده
        </p>
      )}
    </div>
  );
};

interface FieldResult {
  results: {
    majorName: string;
    code: string;
    university: string;
  }[];
}

const FieldSearchAutoComplete = ({
  setUserData,
  userData,
  type = "interestsBased",
}: {
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  type?: "interestsBased" | "allMajors";
  userData: UserData | undefined;
}) => {
  const [fields, setFields] = useState<FieldResult | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<undefined | string>(undefined);
  const [sliderValue, setSliderValue] = useState(20);
  const { isOpen, onClose, onOpenChange } = useDisclosure();
  const fetchFields = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/admin/selections/search", {
        params: { Q: query },
      });
      setFields(res.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFields();
  }, [query]);

  const handleSelectionChange = (newKey: string) => {
    if (!newKey || !userData) return;
    if (selected) {
      setSelected(undefined);
    }
    {
      if (userData[type].items.filter((item) => item.code == newKey).length > 0)
        setUserData({
          ...userData,
          [type]: {
            ...userData[type], // keep other properties of this section
            items: [
              ...(userData[type]?.items.filter((i) => i.code !== newKey) ?? []),
            ], // append new item safely
          },
        });
      else {
        setSelected(newKey);
        onOpenChange();
      }
    }
  };
  return (
    <>
      <Modal
        onOpenChange={onOpenChange}
        onClose={onClose}
        isOpen={isOpen}
        hideCloseButton
      >
        <ModalContent>
          <ModalBody>
            <div className="px-6 flex flex-col items-center gap-5 py-10">
              {fields &&
              fields?.results?.filter((field) => field.code == selected)
                ?.length > 0
                ? fields?.results?.filter((field) => field.code == selected)[0]
                    .majorName +
                  " " +
                  fields?.results?.filter((field) => field.code == selected)[0]
                    .university
                : "رشته مورد نظر"}
              <Slider
                color="foreground"
                value={sliderValue}
                classNames={{ track: "bg-primary" }}
                onChange={(e) => setSliderValue(e as number)}
                label="درصد"
                maxValue={100}
                minValue={0}
                step={1}
              />
              <Button
                onPress={() => {
                  setUserData((prev) => {
                    if (!prev || !selected) return prev;

                    // If already exists, don't add again
                    if (
                      prev[type].items.some((item) => item.code === selected)
                    ) {
                      return prev;
                    }

                    // Shift all existing priorities
                    const shiftedItems = prev[type].items.map((item) => ({
                      ...item,
                      priority: item.priority + 1,
                    }));

                    // Find the selected field data
                    const field = fields?.results.find(
                      (f) => f.code === selected
                    );
                    if (!field) return prev;

                    // Create new item
                    const newItem = {
                      code: selected,
                      priority: 1,
                      probabilityPercent: sliderValue,
                      university: field.university,
                      majorName: field.majorName,
                    };

                    return {
                      ...prev,
                      [type]: {
                        ...prev[type],
                        items: [newItem, ...shiftedItems],
                      },
                    };
                  });
                  onClose();
                }}
              >
                اضافه کردن
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Autocomplete
        isLoading={loading}
        placeholder="رشته مورد نظر را انتخاب کنید"
        listboxProps={{ emptyContent: "رشته ای پیدا نشد" }}
        value={selected}
        inputValue={query}
        selectedKey={null}
        onSelectionChange={(e) => handleSelectionChange(e as string)}
        onInputChange={(e) => setQuery(e)}
      >
        {(fields?.results ?? []).map((field) => (
          <AutocompleteItem key={field.code}>
            <div className="flex justify-between">
              <p>
                {field.majorName} {field.university} ({field.code})
              </p>
              <Chip
                color={
                  userData &&
                  userData[type].items.filter((item) => item.code == field.code)
                    .length > 0
                    ? "danger"
                    : "primary"
                }
                variant="flat"
              >
                {userData &&
                userData[type].items.filter((item) => item.code == field.code)
                  .length > 0
                  ? "حذف"
                  : "اضافه"}
              </Chip>
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </>
  );
};
interface UserData {
  allMajors: {
    finalizedAt: string;
    isFinalized: boolean;
    items: {
      code: string;
      priority: number;
      probabilityPercent: number;
      university: string;
      majorName: string;
    }[];
  };
  interestsBased: {
    finalizedAt: string;
    isFinalized: boolean;
    items: {
      code: string;
      priority: number;
      probabilityPercent: number;
      university: string;
      majorName: string;
    }[];
  };
  preferencesMajorst: string[];
}
export default function AdminPanel() {
  const [selected, setSelected] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [evidenceData, setEvidenceData] = useState<any>();
  const [eviLoading, EviLoading] = useState(true);
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();
  const [rejectReason, setRejectReason] = useState("");
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await apiClient(`/admin/results/${selected.studentId}`);
      const data: any = res.data;
      data.interestsBased.items = (data.interestsBased?.items ?? []).map(
        (i: any) => ({
          ...i,
          code: i.majorCode,
        })
      );

      // Normalize allMajors
      data.allMajors.items = (data.allMajors?.items ?? []).map((i: any) => ({
        ...i,
        code: i.majorCode,
      }));
      console.log(data);
      setUserData(data);
    } finally {
      setLoading(false);
    }
  };
  const fetchEvidenceData = async () => {
    EviLoading(true);
    try {
      const res = await apiClient.get(`/admin/evidence/${selected.studentId}/`);
      setEvidenceData(res.data);
    } finally {
      EviLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchEvidenceData();
  }, [selected]);

  const handleSubmit = async (type: "interestsBased" | "allMajors") => {
    if (userData) {
      setLoading(true);
      try {
        await apiClient.post(`/admin/selections/${selected.studentId}`, {
          type: type,
          ...userData[type],
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEvidence = async (type: boolean, rejectReason?: string) => {
    EviLoading(true);
    try {
       await apiClient.post(
        `/admin/evidence/${selected.studentId}/${type ? "approve" : "reject"}`,
        {
          reason: rejectReason,
        }
      );
    } finally {
      fetchEvidenceData();
      fetchEvidenceData();
    }
  };

  return (
    <div className="p-8">
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalContent>
          <ModalBody className="p-6 flex flex-col gap-4">
            <h3 className="font-bold">علت رد تعهد‌نامه</h3>
            <Textarea
              placeholder="دلیل رد را وارد کنید..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="flat" onPress={onRejectClose}>
                انصراف
              </Button>
              <Button
                color="danger"
                isDisabled={!rejectReason.trim()}
                onPress={() => {
                  handleEvidence(false, rejectReason);
                  setRejectReason("");
                  onRejectClose();
                }}
              >
                رد کردن
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {selected ? (
        <Tabs color="primary" defaultSelectedKey={"1"}>
          <Tab onClick={() => setSelected(null)} title={<ChevronRight />}></Tab>
          <Tab key={"1"} title="اطلاعات کاربری">
            <div className="flex p-6 lg:flex-row flex-col overflow-hidden gap-10 h-full bg-content1 rounded-2xl">
              <div className=" gap-3 grow grid ">
                <div className="flex gap-2">
                  <h2>نام و نام خانوادگی:</h2>
                  <h3 className="text-default-500">
                    {selected.firstName + " " + selected.lastName + " "}
                  </h3>
                  <h3
                    className={
                      "text-default-500 " +
                      (selected.state === "CompleteInformation"
                        ? "text-success"
                        : selected.state === "Paid"
                        ? "text-warning"
                        : selected.state === "SentEvidence"
                        ? "text-secondary"
                        : selected.state === "Final"
                        ? "text-primary"
                        : "")
                    }
                  >
                    {stateDict[selected.state]}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <h2>شماره تماس:</h2>
                  <h3 className="text-default-500">{selected.phone}</h3>
                </div>
                <div className="flex gap-2">
                  <h2>کد ملی:</h2>
                  <h3 className="text-default-500">{selected.nationalId}</h3>
                </div>
                <div className="flex justify-between">
                  <p className="flex gap-2">
                    وضعیت تعهد نامه:{" "}
                    {!eviLoading ? (
                      evidenceData?.status ? (
                        evidenceData.status === "NotSeen" ? (
                          <p className="text-warning-500">در انتظار تایید</p>
                        ) : evidenceData.status === "Rejected" ? (
                          <p className="text-danger-500">رد شده</p>
                        ) : evidenceData.status === "Approved" ? (
                          <p className="text-default-500">تایید شده</p>
                        ) : (
                          <p className="text-default-500">آپلود نشده</p>
                        )
                      ) : (
                        <p className="text-default-500">آپلود نشده</p>
                      )
                    ) : <Skeleton className="w-16 h-8 rounded-md" />}
                  </p>
                  <p className="text-default-500 justify-self-end">
                    {new Date(selected.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>
              {evidenceData?.link !== null && (
                <div className="flex-1 flex flex-col gap-5 lg:!max-w-1/3 max-h-[80vh]">
                  <Image
                    classNames={{
                      wrapper: "flex-1 w-full min-h-[50px]",
                    }}
                    src={evidenceData?.link}
                  />
                  <div className="flex w-full gap-5">
                    <Button
                      onPress={() => {
                        handleEvidence(true);
                      }}
                      fullWidth
                      color="success"
                    >
                      تایید تعهد نامه
                    </Button>
                    <Button onPress={onRejectOpen} fullWidth color="danger">
                      رد تعهد نامه
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Tab>
          <Tab isDisabled={loading} title="انتخاب رشته بر اساس علاقه مندی ها">
            <div className="bg-content1 p-6 flex flex-col gap-6 rounded-2xl">
              <Alert>
                علاقه‌مندی های کاربر:{" "}
                {userData?.preferencesMajorst.map((i, idx) =>
                  idx == userData.preferencesMajorst.length - 1 ? i : i + ", "
                )}
              </Alert>
              {userData && (
                <>
                  <FieldSearchAutoComplete
                    type="interestsBased"
                    userData={userData}
                    setUserData={setUserData}
                  />
                  <DraggableChoices
                    userData={userData}
                    setUserData={setUserData}
                    interests={userData.interestsBased.items}
                  />
                  <Divider />
                  <div className="flex flex-col gap-5">
                    <Switch
                      isSelected={userData.interestsBased.isFinalized}
                      onValueChange={(v) => {
                        setUserData({
                          ...userData,
                          interestsBased: {
                            ...userData.interestsBased,
                            isFinalized: v,
                          },
                        });
                      }}
                    >
                      نهایی کردن
                    </Switch>
                    <Button
                      isLoading={loading}
                      color="primary"
                      onPress={() => handleSubmit("interestsBased")}
                      className={buttonStyle}
                    >
                      ثبت اطلاعات
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Tab>
          <Tab isDisabled={loading} title="انتخاب رشته کلی">
            <div className="bg-content1 p-6 flex flex-col gap-6 rounded-2xl">
              {userData && (
                <>
                  <FieldSearchAutoComplete
                    type="allMajors"
                    userData={userData}
                    setUserData={setUserData}
                  />
                  <DraggableChoices
                    type="allMajors"
                    userData={userData}
                    setUserData={setUserData}
                    interests={userData.interestsBased.items}
                  />
                  <Divider />
                  <div className="flex gap-5 flex-col">
                    <Switch
                      isSelected={userData?.allMajors.isFinalized}
                      onValueChange={(v) => {
                        setUserData({
                          ...userData,
                          allMajors: { ...userData.allMajors, isFinalized: v },
                        });
                      }}
                    >
                      نهایی کردن
                    </Switch>
                    <Button
                      onPress={() => handleSubmit("allMajors")}
                      color="primary"
                      className={buttonStyle}
                      isLoading={loading}
                    >
                      ثبت اطلاعات
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Tab>
        </Tabs>
      ) : (
        <UserTable setSelected={setSelected} />
      )}
    </div>
  );
}

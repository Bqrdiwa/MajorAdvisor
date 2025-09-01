import { useEffect, useState } from "react";
import WaveLayout from "../../layouts/waveLayout";
import apiClient from "../../api/ApiClient";
import {
  Button,
  Skeleton,
  Modal,
  ModalContent,
  Image,
  Alert,
} from "@heroui/react";
import { buttonStyle } from "../../components/Styles";
interface ResponseData {
  message: string;
  link: null | string;
  uploadedAt: string | null;
  fileName: string | null;
  status: "NotSeen" | "Approved" | "Rejected";
  sizeBytes: number | null;
  rejectReason: boolean | null;
}

export default function Commitment() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResponseData>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchCommitment = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/evidence");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitment();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setModalOpen(true);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await apiClient.post("/evidence", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchCommitment();
      setModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="lg:p-8 h-full ">
      <WaveLayout>
        <div className="lg:m-6 h-full  p-6 bg-secondary/5 lg:rounded-3xl">
          <h1 className="w-sm text-xl font-bold text-secondary">
            بارگزاری تعهدنامه
          </h1>
          <p className="mb-10">
            نتایج انتخاب رشته‌ی نهایی نیازمند بارگزاری تعهدنامه می‌باشد.
          </p>

          {loading ? (
            <div className="flex gap-5">
              <div className="flex flex-col flex-1 w-2/3 justify-between">
                <div className="flex flex-col w-full gap-2">
                  <Skeleton className="h-18 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <Skeleton className="h-100 w-1/3  rounded-lg" />
            </div>
          ) : data && data.link ? (
            <div className="flex flex-col-reverse lg:flex-row justify-between gap-10">
              <div className="flex flex-col gap-10 flex-1 justify-between">
                <div>
                  <Alert
                    classNames={{ base: "h-full" }}
                    className="h-fit mt-5"
                    color="secondary"
                  >
                    تعهد نامه شما اپلود شد پس از تایید تعهد نامه حداکثر تا ۷۲
                    ساعت اینده نتیجه انتخاب رشته شما به دست شما میرسد
                  </Alert>
                </div>
                <div className="flex gap-2">
                  <p>وضعیت تایید تعهدنامه:</p>
                  <p
                    className={
                      data.status == "NotSeen"
                        ? "text-warning-600"
                        : data.status == "Approved"
                        ? "text-success-500"
                        : "text-danger-500"
                    }
                  >
                    {data.rejectReason || data.status == "NotSeen"
                      ? "در انتظار تایید"
                      : data.status == "Approved"
                      ? "تایید شده"
                      : "رد شده"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:max-w-1/3 gap-2">
                <Image
                  classNames={{ wrapper: "!max-w-full" }}
                  src={data.link}
                  alt="تعهدنامه"
                  className="rounded-lg max-h-[400px] object-contain w-full"
                />
                <Button
                  color="primary"
                  className={buttonStyle + " w-full rounded-md relative"}
                >
                  <input
                    className="w-full h-full absolute z-10 opacity-0 cursor-pointer"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  آپلود تعهدنامه
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Button
                color="primary"
                className={buttonStyle + " w-fit relative"}
              >
                <input
                  className="w-full h-full absolute z-10 opacity-0 cursor-pointer"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                آپلود تعهدنامه
              </Button>
            </div>
          )}

          <Modal
            hideCloseButton
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedFile(null);
            }}
          >
            <ModalContent>
              <div className="flex flex-col items-center">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="پیش‌نمایش تعهدنامه"
                    classNames={{
                      wrapper: "!rounded-b-0",
                      img: "!rounded-b-0",
                    }}
                  />
                )}
                <div className="p-6 w-full">
                  <Button
                    color="primary"
                    className={buttonStyle + "w-full"}
                    onPress={handleConfirmUpload}
                    isLoading={uploading}
                  >
                    تایید عکس
                  </Button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </div>
      </WaveLayout>
    </div>
  );
}

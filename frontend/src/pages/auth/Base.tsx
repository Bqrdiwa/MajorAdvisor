import { Tooltip, useDisclosure } from "@heroui/react";
import HeadSection from "./states/Header";
import BaseState from "./states/BaseState";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignUp from "./Inputs/SignUp";
import CodeVertification from "./Inputs/CodeVertification";
import Login from "./Inputs/Login";
import Location from "./Inputs/Location";
import HighlightedText from "../../components/HighlightedText";
import Education from "./Inputs/Education";
import Transcript from "./Inputs/Transcript";
import Additional from "./Inputs/Additional";
import apiClient from "../../api/ApiClient";
import WaveLayout from "../../layouts/waveLayout";
import SummerModal from "../summery/summeryModal";
type Payload = {
  [key: string]: any;
};
interface Step {
  endpoint: string;
  component: ({
    loading,
    formData,
    canLogin,
    setFormData,
    back,
  }: {
    loading: boolean;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    canLogin: boolean;
    back: () => void;
    formData: Record<string, any>;
  }) => ReactElement;
  heading?: ReactNode;
  payload: Record<string, any>;
  title: string;
  description: string;
}
const CodeVertificationStep: Step = {
  endpoint: "/student/code-verification",
  component: CodeVertification,
  payload: {
    nationalId: "",
    phone: "",
    code: "",
  },
  title: "کد تایید",
  description: `کد تایید ارسال شده به شماره خود را وارد کنید.`,
};
const SignUpSteps: Step[] = [
  {
    endpoint: "/student/signup",
    component: SignUp,
    payload: {
      firstName: "",
      lastName: "",
      nationalId: "",
      phone: "",
    },
    title: "ثبت نام",
    description: "از این بخش در سامانه پرگار ثبت نام کنید.",
  },
  CodeVertificationStep,
];

const LoginSteps: Step[] = [
  {
    endpoint: "/student/login",
    component: Login,
    payload: {
      nationalId: "",
      phone: "",
    },
    title: "ورود",
    description: "از این بخش وارد سامانه پرگار شوید.",
  },
];

const CommonSteps: Step[] = [
  {
    endpoint: "/student/location",
    component: Location,
    heading: (
      <div className="text-center z-1 flex flex-1 flex-col mb-16 mt-6 items-center justify-center">
        <HighlightedText>
          <h1 className="font-semibold mb-2 text-2xl">
            تکمیل <span className="text-secondary">اطلاعات</span>
          </h1>
        </HighlightedText>
        <HighlightedText>
          <h2>
            با تکمیل اطلاعات زیر سیستم هوشمند ما می‌تونه نتایج دقیقی بهت نشون
            بده
          </h2>
        </HighlightedText>
      </div>
    ),
    payload: {
      gender: "",
      province: "",
      city: "",
    },
    title: "اطلاعات هویتی",
    description: "اطلاعات هویتی خود را وارد کنید, استان, شهر...",
  },
  {
    endpoint: "/student/education",
    component: Education,
    payload: {
      trackId: "",
      quota: "",
      academicGpaTotal: undefined,
      notAttended1404: false,
      examTotalSpecial: null,
      examFinalTotal: null,
      finalQuotaScore: null,
      finalQuotaRank: null,
    },
    title: "اطلاعات تحصیلی",
    description: "اطلاعات تحصیلی خود را وارد کنید, گروه آزمایشی, نمره...",
  },
  {
    endpoint: "/student/transcript",
    component: Transcript,
    payload: {
      eligibility: {
        noExam_DayEvening: undefined,
        noExam_VirtualSelf: undefined,
        noExam_PayameNoor_NonProfit: undefined,
        noExam_Azad: undefined,
        exam_DayEvening: undefined,
        exam_VirtualSelf_Azad: undefined,
        exam_ShahidRajai: undefined,
        exam_PayameNoor_NonProfit: undefined,
        exam_Azad_Except4Majors: undefined,
        exam_Behyari: undefined,
      },
      stage1Scores: [],
      stage2Scores: [],
    },
    title: "اطلاعات کارنامه‌ای",
    description: "اطلاعات کارنامه کنکور خود را وارد کنید.",
  },
  {
    endpoint: "/student/additional",
    component: Additional,
    payload: {
      interests: {
        interest_Art28: false,
        interest_PrivateClinic: false,
        interest_PrivateLab: false,
        interest_HiddenCapacity: false,
        interest_MedDentPharmPara_Online: false,
      },
      preferences: [],
    },
    title: "علایق تحصیلی و شغلی",
    description: "رشته های مورد علاقه و علایق خود را برای آینده را وارد کنید.",
  },
];

export default function BaseAuth({
  bar = false,
  canLogin = true,
  getsummery = false,
}: {
  bar?: boolean;
  getsummery?: boolean;
  canLogin?: boolean;
}) {
  const nav = useNavigate();
  const [state, setState] = useState(localStorage.getItem("access") ? 1 : 0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const location = useLocation();
  const [ended, setEnded] = useState(false);
  const { isOpen, onOpenChange, onClose } = useDisclosure();
  const [formDisabled, setFormDisabled] = useState(false);
  const back = () => {
    setState((prev) => prev - 1);
  };
  const [loginSteps, setLoginSteps] = useState(LoginSteps);
  const Steps: Step[] = useMemo(() => {
    return location.hash == "#signup" && !localStorage.getItem("access")
      ? [...SignUpSteps, ...CommonSteps]
      : [...loginSteps, ...CommonSteps];
  }, [location.hash, loginSteps]);
  const containerRef = useRef<HTMLDivElement | null>(null); // add ref

  // scroll to top on state change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state]);
  const onSubmitActions = (data: any) => {
    if (data.token) {
      localStorage.setItem("access", data.token);
    }

    if (
      data.hasToVerifyPhone &&
      location.hash != "#signup" &&
      loginSteps.length == 1
    ) {
      setLoginSteps([...loginSteps, CodeVertificationStep]);
    }
    return true;
  };
  const step: Step | undefined = useMemo(() => {
    return Steps[state];
  }, [Steps, state]);
  const fetchProfileData = async (stepState: number) => {
    const step = Steps[stepState];
    setFormDisabled(true);
    try {
      const res = await apiClient.get(step.endpoint);
      if (res.status == 200) {
        const data: Record<string, any> = res.data;
        const valid: Record<string, any> = {};
        Object.entries(data).forEach(([key, value]) => {
          console.log(formData, key)
          if (Object.keys(step.payload).includes(key) && value) {
            valid[key] = value;
          }
        });
        if (valid) {
          setFormData(prev => ({ ...prev, ...valid}));
        }
      }
    } finally {
      setState(stepState);
      setFormDisabled(false);
    }
  };
  const next = () => {
    let add = 1;
    if(getsummery == false && location.hash != "#signup" && localStorage.getItem("access")){
      nav("/")
    }
    if (
      step != undefined &&
      step.title == "اطلاعات تحصیلی" &&
      formData.notAttended1404 == true
    ) {
      add = 2;
    }
    if (state + add >= Steps.length) {
      setEnded(true);
    } else {
      fetchProfileData(state + add);
    }
  };
  const updateFormData = (payload: Record<string, any>) => {
    console.log(payload)
    setFormData(prev => ({...prev,...payload}));
    next();
  };
  useEffect(() => {
    fetchProfileData(state);
  }, []);
  function updatePayload(step: { payload: Payload }, formData: Payload) {
    const updatedPayload: Payload = { ...step.payload };

    for (const key of Object.keys(step.payload)) {
      if (key in formData) {
        updatedPayload[key] = formData[key];
      }
    }
    return { ...step, payload: updatedPayload };
  }
  useEffect(() => {
    if (ended) {
      if (getsummery) {
        onOpenChange()

      } else {
        nav("/");
      }
    }
  }, [ended]);
  const activeStep = Steps[state];
  const StepComponent = activeStep.component;
  const updatedStep = updatePayload(activeStep, formData);

  return (
    <WaveLayout>
      <SummerModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <HeadSection />
      <div className="absolute hidden lg:flex top-7/12 -translate-y-1/2  gap-3 flex-col right-20">
        {bar &&
          Steps.map((step, idx) => (
            <Tooltip color="secondary" placement="left" content={step.title}>
              <div
                className={
                  "h-16 border-5 border-content2 rounded-full p-1 w-2 " +
                  (idx == state ? "bg-secondary" : "bg-default-200")
                }
              ></div>
            </Tooltip>
          ))}
      </div>
      <div
        dir="ltr"
        ref={containerRef}
        className="flex bg-content2 relative justify-center w-full overflow-y-auto h-full"
      >
        <div
          dir="rtl"
          className="flex max-w-[800px] my-auto w-full px-6 flex-1 mx-auto flex-col"
        >
          <BaseState
            isActive
            formData={formData}
            endpoint={step.endpoint}
            formDisabled={formDisabled && state == 1 && !formData.province}
            heading={step.heading}
            updateFormData={updateFormData}
            payload={updatedStep.payload}
            title={step.title}
            description={step.description}
            onSubmitActions={onSubmitActions}
          >
            {({ loading }) => (
              <StepComponent
                canLogin={canLogin}
                back={back}
                formData={formData}
                loading={loading || formDisabled}
                setFormData={setFormData}
              />
            )}
          </BaseState>
        </div>
      </div>
    </WaveLayout>
  );
}

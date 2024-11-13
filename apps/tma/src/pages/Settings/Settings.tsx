// apps/tma/src/pages/settings/Settings.tsx

import { Borders } from "@/components/Borders";
import { useCommonStore } from "@/components/StoreContext";
import { InitState } from "@/store/types";
import {
  Button,
  Field,
  Label,
  Radio,
  RadioGroup,
  Switch,
  SwitchProps,
} from "@headlessui/react";
import { useCloudStorage } from "@tma.js/sdk-react";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PrimarySwitch = ({ className, ...props }: SwitchProps) => (
  <Switch
    className={`group inline-flex h-[1.375rem] w-[5.625rem] items-center border-2 border-grayM transition data-[checked]:border-primaryM ${className}`}
    {...props}
  >
    <span className="w-10 h-3.5 translate-x-[2px] bg-grayM transition group-data-[checked]:translate-x-11 transition group-data-[checked]:bg-primaryM" />
  </Switch>
);

const GroupHeader = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
) => <span className="text-xl text-white" {...props} />;

const GroupItem = ({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="w-full pl-8 flex justify-between items-center relative py-6">
    <span className="text-xl text-white">{title}</span>
    <PrimarySwitch className="mr-8" checked={checked} onChange={onChange} />
    <Borders />
  </div>
);

const Settings = () => {
  //const cloudStorage = useCloudStorage();
  const navigate = useNavigate();
  const initState = useCommonStore((state) => state.initState);
  const setAppState = useCommonStore((state) => state.setAppState);
  const isEnableMusic = useCommonStore((state) => state.onMusic);
  const isEnableSound = useCommonStore((state) => state.onSound);
  const { t } = useTranslation();
  const referralCode = useCommonStore((state) => state.referralCode);

  const onContinueClick = () => {
      if (referralCode){
          console.log("referral code from settings = ", referralCode);
                setAppState({ initState: "referral" });
                }
    if (initState === "init") {
      console.log("change initState from settings = ", referralCode);
      setAppState({ initState: "langSetted" as InitState });
    }
    navigate("/");
  };

  const toggleMusic = () => {
    setAppState({ onMusic: !isEnableMusic });
  };

  const toggleSound = () => {
    setAppState({ onSound: !isEnableSound });
  };

  return (
    <div
      className="w-screen h-screen flex flex-col items-center bg-darkM bg-gradient-to-b pt-10"
      style={
        {
          "--tw-gradient-stops":
            "rgba(255, 255, 255, 0.09), rgba(0, 0, 0, 0.09)" as string,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col flex-grow w-full">
        <GroupItem
          title={t("music")}
          checked={isEnableMusic}
          onChange={toggleMusic}
        />
        <GroupItem
          title={t("soundEffects")}
          checked={isEnableSound}
          onChange={toggleSound}
        />
        <div className="w-full pl-8 flex justify-between items-center relative pb-6 pt-12">
          <GroupHeader>{t("language")}</GroupHeader>
          <Borders />
        </div>

        <LanguageRadio />
      </div>

      <div className="drop-shadow-ml pb-9 pr-8 self-end">
        <div className="p-0.5 flex justify-center items-center bg-darkGrayM clip-down-xl">
          <Button
            onClick={onContinueClick}
            className="text-3xl text-bold bg-white clip-down-xl px-16 py-4"
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
};
const languages = [
  { title: "English", id: "en" },
  { title: "Русский", id: "ru" },
];

function LanguageRadio() {
  const cloudStorage = useCloudStorage();
  const { i18n } = useTranslation();

  const changeLanguageHandler = (id: string) => {
    i18n.changeLanguage(id);
    cloudStorage.set("languageCode", id);
  };

  return (
    <RadioGroup
      value={languages.find(({ id }) => id === i18n.language)?.id}
      onChange={changeLanguageHandler}
      aria-label="Server size"
      className="flex flex-col gap-1 w-full pt-2.5"
    >
      {languages.map(({ title, id }) => (
        <Field
          key={id}
          className="flex items-center gap-6 bg-secondDark py-3 px-7"
        >
          <Radio
            value={id}
            className="group flex size-6 items-center justify-center bg-secondDark border-2 border-darkGrayM data-[checked]:border-primaryM"
          >
            <span className="invisible size-4 bg-primaryM group-data-[checked]:visible" />
          </Radio>
          <div className="flex flex-col">
            <Label className="text-white text-xl capitalize">{title}</Label>
            <Label className="text-grayM text-xs capitalize">{title}</Label>
          </div>
        </Field>
      ))}
    </RadioGroup>
  );
}
export default Settings;

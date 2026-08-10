import { useEffect } from "react";
import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FaLightbulb } from "react-icons/fa";

const setProfile = callable<[name: string], boolean>("set_profile");

const ICONS = {
  Steam: "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20viewBox%3D%220%200%20485.09%20485.09%22%3E%0A%3Cpath%20d%3D%22M9.9%20242.5c0%20128.4%20104.1%20232.5%20232.5%20232.5s232.5-104.1%20232.5-232.5S370.8%2010%20242.4%2010%209.9%20114.1%209.9%20242.5z%22%2F%3E%0A%3C%2Fsvg%3E",
  Xbox: "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20viewBox%3D%220%200%20485.09%20485.09%22%3E%0A%3Cpath%20d%3D%22M9.9%20242.5c0%20128.4%20104.1%20232.5%20232.5%20232.5s232.5-104.1%20232.5-232.5S370.8%2010%20242.4%2010%209.9%20114.1%209.9%20242.5z%22%2F%3E%0A%3C%2Fsvg%3E",
  Rainbow: "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20viewBox%3D%220%200%20485.09%20485.09%22%3E%0A%3C%2Fsvg%3E",
  White: "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20viewBox%3D%220%200%20485.09%20485.09%22%3E%0A%3C%2Fsvg%3E",
  Off: "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20viewBox%3D%220%200%20485.09%20485.09%22%3E%0A%3C%2Fsvg%3E",
} as const;

const PROFILES = [
  { name: "Steam", icon: ICONS.Steam },
  { name: "Xbox", icon: ICONS.Xbox },
  { name: "Rainbow", icon: ICONS.Rainbow },
  { name: "White", icon: ICONS.White },
  { name: "Off", icon: ICONS.Off },
];

function ProfileButton({ name, icon, onClick }: { name: string; icon: string; onClick: () => void }) {
  return (
    <ButtonItem layout="below" onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={icon} alt="" aria-hidden="true" style={{ width: "28px", height: "28px", objectFit: "contain", flexShrink: 0 }} />
        <span>{name}</span>
      </div>
    </ButtonItem>
  );
}

function Content() {
  useEffect(() => {
    setProfile("Steam").catch((error) => {
      console.error("OpenRGB Control: failed to apply Steam profile", error);
    });
  }, []);

  const apply = async (name: string) => {
    try {
      await setProfile(name);
      toaster.toast({ title: "RGB changed", body: name });
    } catch (error) {
      toaster.toast({ title: "OpenRGB error", body: String(error) });
    }
  };

  return (
    <PanelSection title="OpenRGB">
      {PROFILES.map((profile) => (
        <PanelSectionRow key={profile.name}>
          <ProfileButton name={profile.name} icon={profile.icon} onClick={() => apply(profile.name)} />
        </PanelSectionRow>
      ))}
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "RGB Control",
  titleView: <div className={staticClasses.Title}>OpenRGB Control</div>,
  content: <Content />,
  icon: <FaLightbulb />,
}));

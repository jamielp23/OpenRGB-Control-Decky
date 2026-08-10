import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FaLightbulb } from "react-icons/fa";

const setProfile = callable<[name: string], boolean>("set_profile");

const PROFILES = [
  { name: "Steam", icon: "🎮" },
  { name: "Xbox", icon: "🎮" },
  { name: "Rainbow", icon: "🌈" },
  { name: "White", icon: "⚪" },
  { name: "Off", icon: "⚫" },
];

function Content() {
  const apply = async (name: string) => {
    try {
      await setProfile(name);
      toaster.toast({
        title: "RGB changed",
        body: name,
      });
    } catch (error) {
      toaster.toast({
        title: "OpenRGB error",
        body: String(error),
      });
    }
  };

  return (
    <PanelSection title="OpenRGB">
      {PROFILES.map((profile) => (
        <PanelSectionRow key={profile.name}>
          <ButtonItem
            layout="below"
            onClick={() => apply(profile.name)}
          >
            {profile.icon} {profile.name}
          </ButtonItem>
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

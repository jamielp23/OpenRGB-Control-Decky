import asyncio
import os
import decky

PROFILES = {
    "Steam": "Steam.orp",
    "Xbox": "Xbox.orp",
    "Rainbow": "Rainbow.orp",
    "White": "White.orp",
    "Off": "Off.orp",
}

EFFECTS = {
    "Off",
    "Static",
    "Breathing",
    "Flashing",
    "Spectrum Cycle",
    "Rainbow",
    "Chase Fade",
    "Chase",
}


def clean_env():
    # Decky's Python runtime can inject temporary PyInstaller libraries.
    # Remove them before launching the system Flatpak/OpenRGB stack.
    env = os.environ.copy()
    env.pop("LD_LIBRARY_PATH", None)
    env.pop("LD_PRELOAD", None)
    return env


async def run_openrgb(*args: str):
    process = await asyncio.create_subprocess_exec(
        "/usr/bin/flatpak",
        "run",
        "org.openrgb.OpenRGB",
        *args,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        env=clean_env(),
    )
    stdout, stderr = await process.communicate()

    if process.returncode != 0:
        error = stderr.decode(errors="replace").strip()
        decky.logger.error(f"OpenRGB failed: {error}")
        raise RuntimeError(error or f"OpenRGB exited with code {process.returncode}")

    return stdout, stderr


class Plugin:
    async def set_profile(self, name: str) -> bool:
        if name not in PROFILES:
            raise ValueError(f"Unknown profile: {name}")

        await run_openrgb("--profile", PROFILES[name])
        decky.logger.info(f"Front Lights profile applied: {name}")
        return True

    async def apply_settings(
        self,
        profile: str,
        effect: str,
        color: str,
        brightness: int,
        speed: int,
    ) -> bool:
        if profile not in PROFILES:
            raise ValueError(f"Unknown profile: {profile}")
        if effect not in EFFECTS:
            raise ValueError(f"Unsupported effect: {effect}")
        if not isinstance(color, str) or len(color) != 6:
            raise ValueError("Color must be a 6-digit RGB hex value")
        int(color, 16)
        brightness = max(0, min(100, int(brightness)))
        speed = max(0, min(100, int(speed)))

        # Load the selected preset first, then override its mode settings.
        # OpenRGB's CLI supports mode, color, brightness and speed when the
        # selected hardware mode exposes those controls.
        args = ["--profile", PROFILES[profile], "--mode", effect]

        if effect not in {"Off", "Spectrum Cycle", "Rainbow", "Chase", "Chase Fade"}:
            args += ["--color", color]
        else:
            # OpenRGB accepts color for modes that expose mode-specific colors.
            # Passing it is harmless for modes that ignore color.
            args += ["--color", color]

        args += ["--brightness", str(brightness), "--speed", str(speed)]

        await run_openrgb(*args)
        decky.logger.info(
            f"Front Lights applied: profile={profile}, effect={effect}, "
            f"color={color}, brightness={brightness}, speed={speed}"
        )
        return True

    async def _main(self):
        decky.logger.info("Front Lights loaded")

    async def _unload(self):
        pass

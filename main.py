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


def clean_env():
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
        color: str,
        brightness: int,
        speed: int,
    ) -> bool:
        if profile not in {"Steam", "Xbox", "Rainbow", "White"}:
            raise ValueError(f"Unknown customization profile: {profile}")
        if not isinstance(color, str) or len(color) != 6:
            raise ValueError("Color must be a 6-digit RGB hex value")

        try:
            int(color, 16)
        except ValueError as exc:
            raise ValueError("Color must contain only hexadecimal characters") from exc

        brightness = max(0, min(100, int(brightness)))
        speed = max(0, min(100, int(speed)))

        args = [
            "--profile",
            PROFILES[profile],
            "--color",
            color,
            "--brightness",
            str(brightness),
            "--speed",
            str(speed),
        ]

        await run_openrgb(*args)
        decky.logger.info(
            f"Front Lights customization applied: profile={profile}, "
            f"color={color}, brightness={brightness}, speed={speed}"
        )
        return True

    async def _main(self):
        decky.logger.info("Front Lights loaded")

    async def _unload(self):
        pass

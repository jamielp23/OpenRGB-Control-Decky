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

class Plugin:
    async def set_profile(self, name: str) -> bool:
        if name not in PROFILES:
            raise ValueError(f"Unknown OpenRGB profile: {name}")

        profile = PROFILES[name]

        # Decky's Python runtime can inject temporary PyInstaller libraries
        # through LD_LIBRARY_PATH/LD_PRELOAD. Those libraries are incompatible
        # with SteamOS's system Flatpak/OpenSSL stack, so remove them before
        # launching the system Flatpak executable.
        env = os.environ.copy()
        env.pop("LD_LIBRARY_PATH", None)
        env.pop("LD_PRELOAD", None)

        process = await asyncio.create_subprocess_exec(
            "/usr/bin/flatpak",
            "run",
            "org.openrgb.OpenRGB",
            "--profile",
            profile,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
        )

        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            error = stderr.decode(errors="replace").strip()
            decky.logger.error(f"OpenRGB failed for {profile}: {error}")
            raise RuntimeError(error or f"OpenRGB exited with code {process.returncode}")

        decky.logger.info(f"OpenRGB profile applied: {profile}")
        return True

    async def _main(self):
        decky.logger.info("OpenRGB Control loaded")

    async def _unload(self):
        pass

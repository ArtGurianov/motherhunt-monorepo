import Image from "next/image";
import { CameraCornerSvgUrl, CameraMiddleSvgUrl } from "../Svg";

export const CameraBg = () => (
  <div className="fixed w-full h-full">
    <div className="relative h-full -w-full">
      <Image
        src={CameraCornerSvgUrl}
        alt="camera-corner-tl"
        width="0"
        height="0"
        sizes="100vh"
        className="fixed top-2 lg:top-8 left-2 lg:left-8 h-24 w-24"
        priority
      />
      <Image
        src={CameraCornerSvgUrl}
        alt="camera-corner-tr"
        width="0"
        height="0"
        sizes="100vh"
        className="rotate-90 fixed top-2 lg:top-8 right-2 lg:right-8 h-24 w-24"
        priority
      />
      <Image
        src={CameraCornerSvgUrl}
        alt="camera-corner-bl"
        width="0"
        height="0"
        sizes="100vh"
        className="-rotate-90 fixed bottom-2 lg:bottom-8 left-2 lg:left-8 h-24 w-24"
        priority
      />
      <Image
        src={CameraCornerSvgUrl}
        alt="camera-corner-br"
        width="0"
        height="0"
        sizes="100vh"
        className="rotate-180 fixed bottom-2 lg:bottom-8 right-2 lg:right-8 h-24 w-24"
        priority
      />
      <Image
        src={CameraMiddleSvgUrl}
        alt="camera-middle"
        width="0"
        height="0"
        sizes="100vh"
        className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-18 w-32"
        priority
      />
    </div>
  </div>
);

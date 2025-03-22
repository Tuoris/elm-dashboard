import { Component, createEffect, onMount, useContext } from "solid-js";
import { CarLiveDataContext } from "../../contexts/CarLiveDataContext";
import { updateAnimationProgress } from "../../helpers/animation.helpers";
import { INITIAL_ANIMATION_DURATION, INITIAL_ANIMATION_OPTIONS } from "../../constants/animation.constants";

const MAX_POWER = 170000;

const TEMPERATURE_RANGE = {
  lowest: -20,
  highest: 55,
};

export const EvDashboardPanel3: Component = () => {
  let speedSpan: SVGTSpanElement | undefined;
  let powerSpan: SVGTSpanElement | undefined;
  let socSpan: SVGTSpanElement | undefined;
  let batteryTemperatureSpan: SVGTSpanElement | undefined;
  let cellVoltageSpan: SVGTSpanElement | undefined;

  let powerNeedle: SVGPathElement | undefined;
  let dischargePath: SVGPathElement | undefined;
  let regenPath: SVGPathElement | undefined;
  let socPath25: SVGPathElement | undefined;
  let socPath50: SVGPathElement | undefined;
  let socPath75: SVGPathElement | undefined;
  let socPath100: SVGPathElement | undefined;
  let cellVoltagePath25: SVGPathElement | undefined;
  let cellVoltagePath50: SVGPathElement | undefined;
  let cellVoltagePath75: SVGPathElement | undefined;
  let cellVoltagePath100: SVGPathElement | undefined;
  let batteryTemperatureNeedle: SVGPathElement | undefined;
  let batteryTemperaturePath: SVGPathElement | undefined;
  let batteryTemperatureExcessSegment: SVGPathElement | undefined;

  let accelerationCircle: SVGCircleElement | undefined;
  let accelerationSpan: SVGTSpanElement | undefined;

  const carLiveData = useContext(CarLiveDataContext);

  onMount(() => {
    if (speedSpan) {
      speedSpan.innerHTML = "--";
    }

    if (powerSpan) {
      powerSpan.innerHTML = "--";
    }

    if (socSpan) {
      socSpan.innerHTML = "--";
    }

    if (batteryTemperatureSpan) {
      batteryTemperatureSpan.innerHTML = "--";
    }

    if (cellVoltageSpan) {
      cellVoltageSpan.innerHTML = "--";
    }

    const updateValues = () => {
      if (speedSpan) {
        speedSpan.innerHTML = carLiveData.vehicleSpeed.toFixed();
      }

      if (powerSpan) {
        const batteryPower = carLiveData.batteryPower / 1000;
        powerSpan.innerHTML = batteryPower.toFixed() + (batteryPower > 0 ? "" : " ");
      }

      if (socSpan) {
        socSpan.innerHTML = carLiveData.socValue.toFixed();
      }

      if (batteryTemperatureSpan) {
        const batteryTemperature = (carLiveData.batteryMaxT + carLiveData.batteryMinT) / 2;
        batteryTemperatureSpan.innerHTML = batteryTemperature.toFixed();
      }

      if (cellVoltageSpan) {
        const cellVoltage = (carLiveData.maxCellVoltageValue + carLiveData.minCellVoltageValue) / 2;
        cellVoltageSpan.innerHTML = cellVoltage.toFixed(2);
      }
      requestAnimationFrame(updateValues);
    };

    setTimeout(() => requestAnimationFrame(updateValues), INITIAL_ANIMATION_DURATION);

    if (dischargePath) {
      dischargePath.style.transformOrigin = "960px 540px";

      const keyFrames = [
        { transform: "rotate(-135deg)" },
        { transform: "rotate(-135deg)", offset: 0.5 },
        { transform: "rotate(45deg)" },
      ];

      const animationDischarge = dischargePath.animate(keyFrames, {
        ...INITIAL_ANIMATION_OPTIONS,
      });

      const updateAnimation = () => {
        const discharge = carLiveData.batteryPower;
        const relativeValue = (discharge + MAX_POWER) / (MAX_POWER * 2);

        updateAnimationProgress(animationDischarge, relativeValue);
        requestAnimationFrame(updateAnimation);
      };

      setTimeout(() => requestAnimationFrame(updateAnimation), INITIAL_ANIMATION_DURATION);
    }

    if (regenPath) {
      regenPath.style.transformOrigin = "960px 540px";

      const animationRegen = regenPath.animate(
        [
          { transform: "rotate(45deg)" },
          { transform: "rotate(-135deg)", offset: 0.5 },
          { transform: "rotate(-135deg)" },
        ],
        {
          ...INITIAL_ANIMATION_OPTIONS,
        }
      );

      const updateAnimation = () => {
        const regen = carLiveData.batteryPower;
        const relativeValue = (regen + MAX_POWER) / (MAX_POWER * 2);

        updateAnimationProgress(animationRegen, relativeValue);
        requestAnimationFrame(updateAnimation);
      };

      setTimeout(() => {
        requestAnimationFrame(updateAnimation);
      }, INITIAL_ANIMATION_DURATION);
    }

    if (powerNeedle) {
      powerNeedle.style.transformOrigin = "960px 540px";
      powerNeedle.style.transform = "rotate(-315deg)";

      const animationPowerNeedle = powerNeedle.animate(
        [{ transform: "rotate(-315deg)" }, { transform: "rotate(45deg)" }],
        INITIAL_ANIMATION_OPTIONS
      );

      const updateAnimation = () => {
        const relativeValue = (carLiveData.batteryPower + MAX_POWER) / (MAX_POWER * 2);

        updateAnimationProgress(animationPowerNeedle, relativeValue);
        requestAnimationFrame(updateAnimation);
      };

      setTimeout(() => {
        requestAnimationFrame(updateAnimation);
      }, INITIAL_ANIMATION_DURATION);
    }

    const relativeTemperatureValue = (value: number) =>
      (value - TEMPERATURE_RANGE.lowest) / (TEMPERATURE_RANGE.highest - TEMPERATURE_RANGE.lowest);

    if (batteryTemperatureNeedle) {
      batteryTemperatureNeedle.style.transformOrigin = "1556px 540px";

      const animationBatteryTemperatureNeedle = batteryTemperatureNeedle.animate(
        [{ transform: "rotate(-58deg)" }, { transform: "rotate(158deg)" }],
        INITIAL_ANIMATION_OPTIONS
      );

      const updateAnimation = () => {
        const relativeValue = relativeTemperatureValue((carLiveData.batteryMinT + carLiveData.batteryMaxT) / 2);

        updateAnimationProgress(animationBatteryTemperatureNeedle, relativeValue);
        requestAnimationFrame(updateAnimation);
      };

      setTimeout(() => {
        requestAnimationFrame(updateAnimation);
      }, INITIAL_ANIMATION_DURATION);
    }

    if (batteryTemperaturePath && batteryTemperatureExcessSegment) {
      batteryTemperaturePath.style.transformOrigin = "1556px 540px";

      const animationBatteryTemperature = batteryTemperaturePath.animate(
        [
          { transform: "rotate(-216deg)", offset: 0, fill: "#2c88e3" },
          { fill: "#2c88e3", offset: relativeTemperatureValue(0) },
          { fill: "#f0f6fd", offset: relativeTemperatureValue(10) },
          { fill: "#f0f6fd", offset: relativeTemperatureValue(30) },
          { fill: "#e32c2c", offset: relativeTemperatureValue(40) },
          { transform: "rotate(0)", fill: "#e32c2c", offset: 1 },
        ],
        INITIAL_ANIMATION_OPTIONS
      );

      const animationBatteryTemperatureExcessSegment = batteryTemperatureExcessSegment.animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0, offset: 0.51 }, { opacity: 0 }],
        INITIAL_ANIMATION_OPTIONS
      );

      const updateAnimation = () => {
        const relativeValue = relativeTemperatureValue((carLiveData.batteryMinT + carLiveData.batteryMaxT) / 2);

        updateAnimationProgress(animationBatteryTemperature, relativeValue);
        updateAnimationProgress(animationBatteryTemperatureExcessSegment, relativeValue);
        requestAnimationFrame(updateAnimation);
      };

      setTimeout(() => {
        requestAnimationFrame(updateAnimation);
      }, INITIAL_ANIMATION_DURATION);
    }

    if (socPath25 && socPath50 && socPath75 && socPath100) {
      const updateSocBars = () => {
        socPath25.style.opacity = "0";
        socPath50.style.opacity = "0";
        socPath75.style.opacity = "0";
        socPath100.style.opacity = "0";

        socPath25.style.opacity = "1";

        if (carLiveData.socValue > 25) {
          socPath50.style.opacity = "1";
        }

        if (carLiveData.socValue > 50) {
          socPath75.style.opacity = "1";
        }

        if (carLiveData.socValue > 75) {
          socPath100.style.opacity = "1";
        }

        requestAnimationFrame(updateSocBars);
      };

      setTimeout(() => requestAnimationFrame(updateSocBars), INITIAL_ANIMATION_DURATION);
    }

    if (cellVoltagePath25 && cellVoltagePath50 && cellVoltagePath75 && cellVoltagePath100) {
      const updateSocBars = () => {
        cellVoltagePath25.style.opacity = "0";
        cellVoltagePath50.style.opacity = "0";
        cellVoltagePath75.style.opacity = "0";
        cellVoltagePath100.style.opacity = "0";

        cellVoltagePath25.style.opacity = "1";

        const cellVoltage = (carLiveData.maxCellVoltageValue + carLiveData.minCellVoltageValue) / 2;

        if (cellVoltage > 3.58) {
          cellVoltagePath50.style.opacity = "1";
        }

        if (cellVoltage > 3.78) {
          cellVoltagePath75.style.opacity = "1";
        }

        if (cellVoltage > 3.98) {
          cellVoltagePath100.style.opacity = "1";
        }

        requestAnimationFrame(updateSocBars);
      };

      setTimeout(() => requestAnimationFrame(updateSocBars), INITIAL_ANIMATION_DURATION);
    }

    if (accelerationCircle && accelerationSpan) {
      const updateAccelerationCirclePosition = () => {
        const forwardAccelerationG = carLiveData.forwardAccelerationG;
        const rightAccelerationG = carLiveData.rightAccelerationG;

        const proportion = 72;

        accelerationCircle.style.transform = `translate(${rightAccelerationG * proportion}px, ${forwardAccelerationG * -1 * proportion}px)`;

        const accelerationValue =
          Math.abs(forwardAccelerationG) > Math.abs(rightAccelerationG) ? forwardAccelerationG : rightAccelerationG;
        accelerationSpan.innerHTML = accelerationValue.toFixed(1);

        requestAnimationFrame(updateAccelerationCirclePosition);
      };

      accelerationSpan.innerHTML = "--";

      setTimeout(() => requestAnimationFrame(updateAccelerationCirclePosition), INITIAL_ANIMATION_DURATION);
    }
  });

  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      fill="none"
      version="1.1"
      id="svg39"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="1920" height="1080" fill="#24211f" id="rect1" />
      <g filter="url(#filter0_i_23_8)" id="g1">
        <circle cx="960" cy="540" r="331" fill="#1D1C1C" id="circle1" />
      </g>
      <circle cx="960" cy="540" r="330.5" stroke="white" stroke-opacity="0.05" id="circle2" />
      <g
        id="g39"
        mask="url(#mask15)"
        style="display:inline;fill:url(#linearGradient4);stroke:none;stroke-width:4;stroke-dasharray:none;stroke-opacity:0.377229;paint-order:normal"
        transform="rotate(-45,959.65872,540.40346)"
      >
        <g id="g6" style="fill:url(#linearGradient3)">
          <path
            id="dischargePath"
            ref={dischargePath}
            style="display:inline;fill:url(#radialGradient42);stroke:none;stroke-width:4;stroke-dasharray:none;stroke-opacity:0.377229;paint-order:normal"
            d="M 960.03317,209.49313 A 330.5,330.5 0 0 1 1246.2301,374.78544 A 330.5,330.5 0 0 1 1246.1812,705.28549 A 330.5,330.5 0 0 1 959.93544,870.49306 L 959.98431,539.99313 Z"
            inkscape:transform-center-x="-165.38113"
            inkscape:transform-center-y="-6.6185075e-06"
          />
          <path
            id="path1"
            style="fill:none;stroke:none;stroke-width:4;stroke-dasharray:none;stroke-opacity:0.377229;paint-order:normal"
            d="M 959.62428,870.49308 A 330.5,330.5 0 0 1 673.42735,705.20077 A 330.5,330.5 0 0 1 673.47625,374.70072 A 330.5,330.5 0 0 1 959.72201,209.49315 L 959.67314,539.99308 Z"
            inkscape:transform-center-x="165.38113"
            inkscape:transform-center-y="9.7693814e-06"
          />
        </g>
      </g>
      <g
        id="g8"
        mask="url(#mask16)"
        style="display:inline;fill:url(#linearGradient40);stroke:none;stroke-width:4;stroke-dasharray:none;stroke-opacity:0.377229;paint-order:normal"
        transform="rotate(-45,959.82872,539.99311)"
      >
        <g id="g7" style="fill:url(#linearGradient8);stroke:none" transform="matrix(0,-1,-1,0,1499.8218,1499.8218)">
          <path
            id="regenPath"
            ref={regenPath}
            style="display:inline;fill:url(#radialGradient8);stroke:none;stroke-width:4;stroke-dasharray:none;stroke-opacity:0.377229;paint-order:normal"
            d="M 960.03317,209.49313 A 330.5,330.5 0 0 1 1246.2301,374.78544 A 330.5,330.5 0 0 1 1246.1812,705.28549 A 330.5,330.5 0 0 1 959.93544,870.49306 L 959.98431,539.99313 Z"
            inkscape:transform-center-x="-165.38113"
            inkscape:transform-center-y="-6.6185075e-06"
          />
          <path
            id="path7"
            style="fill:none;stroke:none;stroke-width:4;stroke-dasharray:none;stroke-opacity:0.377229;paint-order:normal"
            d="M 959.62428,870.49308 A 330.5,330.5 0 0 1 673.42735,705.20077 A 330.5,330.5 0 0 1 673.47625,374.70072 A 330.5,330.5 0 0 1 959.72201,209.49315 L 959.67314,539.99308 Z"
            inkscape:transform-center-x="165.38113"
            inkscape:transform-center-y="9.7693814e-06"
          />
        </g>
      </g>
      <path
        d="M1170.09 750.013L1128.32 704.738L1126.52 703L1122 707.672L1123.8 709.41L1170.09 750.013Z"
        fill="#FF5B5B"
        id="powerNeedle"
        ref={powerNeedle}
      />
      <g filter="url(#filter1_d_23_8)" id="g4">
        <circle cx="960" cy="540" r="240" fill="#1F1F1F" id="circle3" />
        <circle cx="960" cy="540" r="239.5" stroke="white" stroke-opacity="0.08" id="circle4" />
      </g>
      <g filter="url(#filter2_i_23_8)" id="g5">
        <circle cx="364.5" cy="539.5" r="184.5" fill="#1D1C1C" id="circle5" />
      </g>
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:center;text-anchor:middle;white-space:pre"
        font-family="Inter"
        font-size="128px"
        letter-spacing="0em"
        id="text5"
        x="195.74219"
        y="-6.8765869"
      >
        <tspan
          x="952.99219"
          y="533.1684"
          id="speedSpan"
          ref={speedSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:center;text-anchor:middle"
        >
          120
        </tspan>
      </text>
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:end;text-anchor:end;white-space:pre"
        font-family="Inter"
        font-size="48px"
        letter-spacing="0em"
        id="text6"
        x="75.745117"
        y="0"
      >
        <tspan
          x="958.58887"
          y="661.45502"
          id="powerSpan"
          ref={powerSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:center;text-anchor:middle"
        >
          140
        </tspan>
      </text>
      <text
        fill="white"
        style="white-space:pre;-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        font-family="Inter"
        font-size="32"
        font-weight="200"
        letter-spacing="0em"
        id="text7"
      >
        <tspan
          x="907"
          y="582.136"
          id="tspan7"
          style="-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        >
          км/год
        </tspan>
      </text>
      <text
        fill="white"
        style="white-space:pre;-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        font-family="Inter"
        font-size="20"
        font-weight="300"
        letter-spacing="0em"
        id="text8"
      >
        <tspan
          x="946"
          y="687.273"
          id="tspan8"
          style="-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        >
          кВт
        </tspan>
      </text>
      <path d="M929 604H991" stroke="#746A6A" id="path8" />
      <text
        fill="white"
        style="white-space:pre;-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        font-family="Inter"
        font-size="32"
        letter-spacing="0em"
        id="text9"
      >
        <tspan
          x="399"
          y="500.136"
          id="tspan3"
          style="-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        >
          1G
        </tspan>
      </text>
      <mask id="mask0_23_8" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="211" y="386" width="307" height="307">
        <rect x="340" y="386" width="49" height="307" fill="#D9D9D9" id="rect9" />
        <rect x="518" y="515" width="49" height="307" transform="rotate(90 518 515)" fill="#D9D9D9" id="rect10" />
      </mask>
      <g mask="url(#mask0_23_8)" id="g10">
        <circle cx="364.5" cy="539.5" r="74" stroke="#746A6A" id="circle10" />
      </g>
      <path
        d="M1733.71 587.252C1741.25 559.128 1742.02 529.62 1735.97 501.14C1729.91 472.661 1717.21 446.018 1698.88 423.39C1680.56 400.763 1657.14 382.793 1630.54 370.951C1603.94 359.108 1574.92 353.729 1545.84 355.253C1516.77 356.777 1488.47 365.16 1463.25 379.718C1438.03 394.276 1416.62 414.595 1400.77 439.014C1384.91 463.433 1375.05 491.258 1372.01 520.215C1368.97 549.171 1372.82 578.437 1383.25 605.619L1555.5 539.5L1733.71 587.252Z"
        stroke="white"
        stroke-opacity="0.05"
        stroke-width="2"
        mask="none"
        id="path14"
        style="stroke:none;stroke-opacity:1;fill:#1d1c1c;fill-opacity:1"
      />
      <g id="g9" mask="url(#mask10)" style="display:inline">
        <path
          d="M 1733.71,587.252 C 1741.25,559.128 1742.02,529.62 1735.97,501.14 C 1729.91,472.661 1717.21,446.018 1698.88,423.39 C 1680.56,400.763 1657.14,382.793 1630.54,370.951 C 1603.94,359.108 1574.92,353.729 1545.84,355.253 C 1516.77,356.777 1488.47,365.16 1463.25,379.718 C 1438.03,394.276 1416.62,414.595 1400.77,439.014 C 1384.91,463.433 1375.05,491.258 1372.01,520.215 C 1368.97,549.171 1372.82,578.437 1383.25,605.619 L 1555.5,539.5 Z"
          fill="#1d1c1c"
          id="batteryTemperaturePath"
          ref={batteryTemperaturePath}
          style="display:inline;fill:#e32c2c;fill-opacity:0.3791045"
        />
      </g>
      <path
        d="M 1733.71,587.252 C 1741.25,559.128 1742.02,529.62 1735.97,501.14 C 1729.91,472.661 1717.21,446.018 1698.88,423.39 L 1646.6746,465.66629 L 1555.5,539.5 Z"
        stroke="white"
        stroke-opacity="0.05"
        stroke-width="2"
        mask="none"
        id="batteryTemperatureExcessSegment"
        ref={batteryTemperatureExcessSegment}
        style="display:inline;fill:#1d1c1c;fill-opacity:1;stroke:none;stroke-opacity:1"
      />
      <circle
        fill="#ff5b5b"
        id="accelerationCircle"
        ref={accelerationCircle}
        style="display:inline"
        r="17"
        cx="365"
        cy="540"
      />
      <path
        d="M 1733.71,587.252 C 1741.25,559.128 1742.02,529.62 1735.97,501.14 C 1729.91,472.661 1717.21,446.018 1698.88,423.39 C 1680.56,400.763 1657.14,382.793 1630.54,370.951 C 1603.94,359.108 1574.92,353.729 1545.84,355.253 C 1516.77,356.777 1488.47,365.16 1463.25,379.718 C 1438.03,394.276 1416.62,414.595 1400.77,439.014 C 1384.91,463.433 1375.05,491.258 1372.01,520.215 C 1368.97,549.171 1372.82,578.437 1383.25,605.619 L 1555.5,539.5 Z"
        stroke="#ffffff"
        stroke-opacity="0.05"
        stroke-width="2"
        mask="none"
        id="path13"
        style="display:inline"
      />
      <path
        d="M 1482.22,490.565 L 1484.18,492.118 L 1488.21,487.023 L 1486.26,485.471 L 1461.22,467.55 L 1436.19,449.63 L 1459.2,470.098 Z"
        fill="#ff5b5b"
        id="batteryTemperatureNeedle"
        ref={batteryTemperatureNeedle}
        style="display:inline"
      />
      <g filter="url(#filter4_d_23_8)" id="g16" style="display:inline">
        <circle cx="1556" cy="540" r="92" fill="#1f1f1f" id="circle15" />
        <circle cx="1556" cy="540" r="91.5" stroke="#ffffff" stroke-opacity="0.08" id="circle16" />
      </g>
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';white-space:pre"
        font-family="Inter"
        font-size="48px"
        letter-spacing="0em"
        id="text16"
        x="98.743752"
        y="0"
      >
        <tspan
          x="1567.0406"
          y="557.45502"
          id="batteryTemperatureSpan"
          ref={batteryTemperatureSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:end;text-anchor:end"
        >
          35
        </tspan>
      </text>
      <text
        fill="white"
        style="white-space:pre;-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        font-family="Inter"
        font-size="20"
        font-weight="200"
        letter-spacing="0em"
        id="text17"
      >
        <tspan
          x="1574"
          y="557.273"
          id="tspan17"
          style="-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        >
          °C
        </tspan>
      </text>
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';white-space:pre"
        font-family="Inter"
        font-size="48px"
        letter-spacing="0em"
        id="text18"
        x="129.59485"
        y="-0.55309248"
      >
        <tspan
          x="1418.4152"
          y="968.90192"
          id="socSpan"
          ref={socSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:end;text-anchor:end"
        >
          90
        </tspan>
      </text>
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';white-space:pre"
        font-family="Inter"
        font-size="20px"
        font-weight="300"
        letter-spacing="0em"
        id="text19"
      >
        <tspan
          x="1425"
          y="969.27301"
          id="tspan19"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI'"
        >
          %
        </tspan>
      </text>
      <path
        d="M1477 950L1465.5 966H1508L1520.5 950H1477Z"
        fill="#FF5B5B"
        stroke="#746A6A"
        id="socPath25"
        ref={socPath25}
      />
      <path
        d="M1525 950L1513.5 966H1556L1568.5 950H1525Z"
        fill="#D9D9D9"
        stroke="#746A6A"
        id="socPath50"
        ref={socPath50}
      />
      <path
        d="M1573 950L1561.5 966H1604L1616.5 950H1573Z"
        fill="#D9D9D9"
        stroke="#746A6A"
        id="socPath75"
        ref={socPath75}
      />
      <path
        d="M1621 950L1609.5 966H1652L1664.5 950H1621Z"
        fill="#D9D9D9"
        stroke="#746A6A"
        id="socPath100"
        ref={socPath100}
      />
      <path d="M1464 969H1655.5L1670 950" stroke="white" id="path23" />
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:end;text-anchor:end;white-space:pre"
        font-family="Inter"
        font-size="48px"
        letter-spacing="0em"
        id="text23"
        x="175.98438"
        y="0"
      >
        <tspan
          x="584"
          y="969.45502"
          id="cellVoltageSpan"
          ref={cellVoltageSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:end;text-anchor:end"
        >
          3.85
        </tspan>
      </text>
      <text
        fill="white"
        style="white-space:pre;-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        font-family="Inter"
        font-size="20"
        font-weight="300"
        letter-spacing="0em"
        id="text24"
      >
        <tspan
          x="591"
          y="969.273"
          id="tspan24"
          style="-inkscape-font-specification:'Segoe UI';font-family:'Segoe UI';font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal"
        >
          В
        </tspan>
      </text>
      <path
        d="M465 950L476.5 966H434L421.5 950H465Z"
        fill="#FF5B5B"
        stroke="#746A6A"
        id="cellVoltagePath25"
        ref={cellVoltagePath25}
      />
      <path
        d="M417 950L428.5 966H386L373.5 950H417Z"
        fill="#D9D9D9"
        stroke="#746A6A"
        id="cellVoltagePath50"
        ref={cellVoltagePath50}
      />
      <path
        d="M369 950L380.5 966H338L325.5 950H369Z"
        fill="#D9D9D9"
        stroke="#746A6A"
        id="cellVoltagePath75"
        ref={cellVoltagePath75}
      />
      <path d="M478 969H286.5L272 950" stroke="white" id="path27" />
      <path
        d="M1556.02 656C1554.53 656 1553.33 657.203 1553.33 658.697V689.375C1552.09 690.251 1551.35 691.676 1551.35 693.198C1551.35 695.787 1553.44 697.886 1556.02 697.886C1558.6 697.886 1560.69 695.787 1560.69 693.198C1560.69 691.672 1559.95 690.243 1558.71 689.365V683.968H1571.13V680.067H1558.71V675.561H1571.13V671.659H1558.71V667.12H1571.13V663.218H1558.71V658.697C1558.71 657.203 1557.51 656 1556.02 656ZM1533.55 688.483C1531 688.502 1528.94 689.494 1527.18 690.311C1527.11 690.34 1527.07 690.358 1527 690.387V694.639C1527.63 694.379 1528.24 694.111 1528.8 693.852C1530.56 693.036 1532 692.404 1533.52 692.386C1535.17 692.415 1536.66 693.067 1538.42 693.879C1540.18 694.696 1542.22 695.685 1544.76 695.706H1544.8C1545.67 695.696 1546.49 695.565 1547.25 695.38C1547.07 694.666 1546.96 693.933 1546.96 693.196C1546.97 692.573 1547.03 691.951 1547.18 691.342C1546.37 691.613 1545.59 691.785 1544.76 691.801C1543.24 691.782 1541.79 691.15 1540.03 690.335C1538.26 689.516 1536.17 688.525 1533.55 688.483ZM1578.52 688.484C1575.98 688.503 1573.92 689.494 1572.15 690.311C1570.4 691.123 1568.91 691.772 1567.26 691.803C1566.46 691.794 1565.68 691.605 1564.86 691.319C1565.01 691.937 1565.04 692.566 1565.04 693.198C1565.03 693.933 1564.93 694.665 1564.75 695.377C1565.53 695.572 1566.35 695.698 1567.24 695.709H1567.27C1569.89 695.669 1571.98 694.676 1573.75 693.856C1575.51 693.039 1576.95 692.407 1578.48 692.39C1580.12 692.419 1581.61 693.071 1583.37 693.882C1583.88 694.121 1584.43 694.369 1585 694.609V690.343C1585 690.341 1585 690.344 1585 690.343C1583.23 689.524 1581.14 688.526 1578.52 688.484ZM1533.7 699.934C1533 699.939 1532.36 700.042 1531.77 700.198V704.331C1532.49 704.034 1533.1 703.849 1533.7 703.841C1534.63 703.86 1535.52 704.226 1536.67 704.752C1537.84 705.283 1539.29 705.985 1541.13 705.999H1541.18C1543.06 705.971 1544.55 705.269 1545.72 704.734C1546.88 704.204 1547.73 703.852 1548.58 703.841C1549.51 703.86 1550.39 704.226 1551.55 704.752C1552.71 705.283 1554.16 705.985 1556.01 705.999H1556.05C1557.94 705.971 1559.42 705.269 1560.59 704.734C1561.75 704.204 1562.61 703.852 1563.45 703.841C1564.38 703.86 1565.26 704.226 1566.42 704.752C1567.58 705.283 1569.03 705.986 1570.87 706L1570.92 706C1572.8 705.971 1574.29 705.269 1575.46 704.734C1576.62 704.204 1577.48 703.852 1578.32 703.841C1578.96 703.85 1579.57 704.036 1580.27 704.314V700.197C1579.68 700.049 1579.05 699.944 1578.36 699.937L1578.31 699.937C1576.46 699.946 1575.02 700.653 1573.85 701.184C1572.7 701.712 1571.82 702.077 1570.88 702.096C1570.04 702.086 1569.19 701.731 1568.03 701.201C1566.85 700.667 1565.37 699.967 1563.49 699.937L1563.44 699.936C1561.59 699.946 1560.15 700.653 1558.98 701.184C1557.83 701.712 1556.95 702.077 1556.02 702.096C1555.17 702.086 1554.32 701.73 1553.15 701.201C1551.98 700.666 1550.5 699.966 1548.62 699.936H1548.58C1546.73 699.945 1545.28 700.652 1544.12 701.183C1542.96 701.711 1542.08 702.076 1541.15 702.095C1540.31 702.086 1539.46 701.73 1538.29 701.201C1537.12 700.666 1535.64 699.965 1533.75 699.935L1533.7 699.934Z"
        fill="#F2F2F2"
        id="path28"
      />
      <defs id="defs39">
        <linearGradient id="linearGradient13">
          <stop style="stop-color:#e3f18d;stop-opacity:0.805255;" offset="0" id="stop12" />
          <stop style="stop-color:#92f18d;stop-opacity:0.51313758;" offset="1" id="stop13" />
        </linearGradient>
        <linearGradient id="linearGradient11">
          <stop style="stop-color:#85e435;stop-opacity:1;" offset="0" id="stop10" />
          <stop style="stop-color:#35e448;stop-opacity:0;" offset="1" id="stop11" />
        </linearGradient>
        <linearGradient id="linearGradient42">
          <stop style="stop-color:#c48df1;stop-opacity:0.805255;" offset="0" id="stop41" />
          <stop style="stop-color:#8d97f1;stop-opacity:0.51313758;" offset="1" id="stop42" />
        </linearGradient>
        <linearGradient id="linearGradient39">
          <stop style="stop-color:#3584e4;stop-opacity:1;" offset="0" id="stop39" />
          <stop style="stop-color:#3584e4;stop-opacity:0;" offset="1" id="stop40" />
        </linearGradient>
        <filter
          id="filter0_i_23_8"
          x="629"
          y="209"
          width="662"
          height="662"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" id="feFlood28" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" id="feBlend28" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
            id="feColorMatrix28"
          />
          <feMorphology
            radius="7"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_innerShadow_23_8"
            id="feMorphology28"
          />
          <feOffset id="feOffset28" />
          <feGaussianBlur stdDeviation="34.5" id="feGaussianBlur28" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" id="feComposite28" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" id="feColorMatrix29" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_23_8" id="feBlend29" />
        </filter>
        <filter
          id="filter1_d_23_8"
          x="666.9"
          y="246.9"
          width="586.2"
          height="586.2"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" id="feFlood29" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
            id="feColorMatrix30"
          />
          <feMorphology
            radius="8"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_23_8"
            id="feMorphology30"
          />
          <feOffset id="feOffset30" />
          <feGaussianBlur stdDeviation="22.55" id="feGaussianBlur30" />
          <feComposite in2="hardAlpha" operator="out" id="feComposite30" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" id="feColorMatrix31" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_23_8" id="feBlend31" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_23_8" result="shape" id="feBlend32" />
        </filter>
        <filter
          id="filter2_i_23_8"
          x="180"
          y="355"
          width="369"
          height="369"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" id="feFlood32" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" id="feBlend33" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
            id="feColorMatrix33"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect1_innerShadow_23_8"
            id="feMorphology33"
          />
          <feOffset id="feOffset33" />
          <feGaussianBlur stdDeviation="28.75" id="feGaussianBlur33" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" id="feComposite33" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" id="feColorMatrix34" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_23_8" id="feBlend34" />
        </filter>
        <filter
          id="filter3_i_23_8"
          x="1371"
          y="355"
          width="369"
          height="250.619"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" id="feFlood34" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" id="feBlend35" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
            id="feColorMatrix35"
          />
          <feMorphology
            radius="7"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_innerShadow_23_8"
            id="feMorphology35"
          />
          <feOffset id="feOffset35" />
          <feGaussianBlur stdDeviation="34.5" id="feGaussianBlur35" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" id="feComposite35" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" id="feColorMatrix36" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_23_8" id="feBlend36" />
        </filter>
        <filter
          id="filter4_d_23_8"
          x="1410.9"
          y="394.9"
          width="290.2"
          height="290.2"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" id="feFlood36" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
            id="feColorMatrix37"
          />
          <feMorphology
            radius="8"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_23_8"
            id="feMorphology37"
          />
          <feOffset id="feOffset37" />
          <feGaussianBlur stdDeviation="22.55" id="feGaussianBlur37" />
          <feComposite in2="hardAlpha" operator="out" id="feComposite37" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" id="feColorMatrix38" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_23_8" id="feBlend38" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_23_8" result="shape" id="feBlend39" />
        </filter>
        <linearGradient
          xlink:href="#linearGradient11"
          id="linearGradient40"
          x1="1229.0756"
          y1="467.68753"
          x2="1279.6393"
          y2="417.74399"
          gradientUnits="userSpaceOnUse"
        />
        <radialGradient
          xlink:href="#linearGradient42"
          id="radialGradient42"
          cx="1163.3118"
          cy="70.423248"
          fx="1163.3118"
          fy="70.423248"
          r="325.42908"
          gradientTransform="matrix(0.02373598,0.6759142,-0.32821027,0.01152569,955.44343,37.985479)"
          gradientUnits="userSpaceOnUse"
        />
        <radialGradient
          xlink:href="#linearGradient13"
          id="radialGradient8"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0.02373598,0.6759142,-0.32821027,0.01152569,955.44343,37.985479)"
          cx="1163.3118"
          cy="70.423248"
          fx="1163.3118"
          fy="70.423248"
          r="325.42908"
        />
        <linearGradient
          xlink:href="#linearGradient39"
          id="linearGradient8"
          gradientUnits="userSpaceOnUse"
          x1="1229.0756"
          y1="467.68753"
          x2="1279.6393"
          y2="417.74399"
        />
        <linearGradient
          xlink:href="#linearGradient11"
          id="linearGradient3"
          gradientUnits="userSpaceOnUse"
          x1="1229.0756"
          y1="467.68753"
          x2="1279.6393"
          y2="417.74399"
        />
        <linearGradient
          xlink:href="#linearGradient11"
          id="linearGradient4"
          gradientUnits="userSpaceOnUse"
          x1="1229.0756"
          y1="467.68753"
          x2="1279.6393"
          y2="417.74399"
        />
        <mask maskUnits="userSpaceOnUse" id="mask10">
          <path
            d="M 1733.71,587.252 C 1741.25,559.128 1742.02,529.62 1735.97,501.14 C 1729.91,472.661 1717.21,446.018 1698.88,423.39 C 1680.56,400.763 1657.14,382.793 1630.54,370.951 C 1603.94,359.108 1574.92,353.729 1545.84,355.253 C 1516.77,356.777 1488.47,365.16 1463.25,379.718 C 1438.03,394.276 1416.62,414.595 1400.77,439.014 C 1384.91,463.433 1375.05,491.258 1372.01,520.215 C 1368.97,549.171 1372.82,578.437 1383.25,605.619 L 1555.5,539.5 Z"
            id="path12"
            style="fill:#ffffff"
          />
        </mask>
        <mask maskUnits="userSpaceOnUse" id="mask15">
          <path
            stroke="#ffffff"
            stroke-opacity="0.05"
            id="path15"
            style="display:inline;fill:#ffffff;fill-opacity:1"
            transform="rotate(-45)"
            sodipodi:arc-type="slice"
            d="M 627.36859,1060.6898 A 330.5,330.5 0 0 1 298.22837,1391.187 A 330.5,330.5 0 0 1 -33.62022,1063.4094 L 296.86859,1060.6898 Z"
          />
        </mask>
        <mask maskUnits="userSpaceOnUse" id="mask16">
          <path
            stroke="#ffffff"
            stroke-opacity="0.05"
            id="path16"
            style="display:inline;fill:#ffffff;fill-opacity:1"
            transform="matrix(0.70710678,-0.70710678,-0.70710678,-0.70710678,0,0)"
            sodipodi:cy="-1060.3142"
            sodipodi:arc-type="slice"
            d="M 627.36862,-1060.3142 A 330.5,330.5 0 0 1 299.17615,-729.82226 A 330.5,330.5 0 0 1 -33.599156,-1055.6993 L 296.86862,-1060.3142 Z"
          />
        </mask>
      </defs>
      <path
        d="M 321.05405,950 L 332.55405,966 H 290.05405 L 277.55405,950 Z"
        fill="#d9d9d9"
        stroke="#746a6a"
        id="cellVoltagePath100"
        ref={cellVoltagePath100}
      />
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:end;text-anchor:end;white-space:pre"
        font-family="Inter"
        font-size="48px"
        letter-spacing="0em"
        id="text1"
        x="-83.867195"
        y="-193.63847"
      >
        <tspan
          x="365.14062"
          y="775.81653"
          id="accelerationSpan"
          ref={accelerationSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';text-align:center;text-anchor:middle"
        >
          4.5
        </tspan>
      </text>
      <text
        fill="#ffffff"
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI';white-space:pre"
        font-family="Inter"
        font-size="20px"
        font-weight="300"
        letter-spacing="0em"
        id="text2"
        x="-187.36105"
        y="-193.10492"
      >
        <tspan
          x="403.63895"
          y="776.16809"
          id="tspan2"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe UI';-inkscape-font-specification:'Segoe UI'"
        >
          G
        </tspan>
      </text>
    </svg>
  );
};

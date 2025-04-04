import { Component, onMount, useContext } from "solid-js";
import { CarLiveDataContext } from "../../contexts/CarLiveDataContext";
import { updateAnimationProgress } from "../../helpers/animation.helpers";
import { INITIAL_ANIMATION_DURATION, INITIAL_ANIMATION_OPTIONS } from "../../constants/animation.constants";

export const EvDashboardPanel: Component = () => {
  const temperatureRange = {
    lowest: -10,
    highest: 60,
  };

  const voltageRange = {
    lowest: 2.0,
    highest: 4.5,
  };

  let lineLength = 0;
  let batteryTemperature: SVGRectElement | undefined;
  let batteryVoltage: SVGRectElement | undefined;
  let powerValue: SVGPathElement | undefined;

  let speedSpan: SVGTSpanElement | undefined;
  let socSpan: SVGTSpanElement | undefined;
  let batteryTemperatureSpan: SVGTSpanElement | undefined;
  let batteryTemperatureDiffSpan: SVGTSpanElement | undefined;
  let batteryVoltageSpan: SVGTSpanElement | undefined;
  let batteryVoltageDiffSpan: SVGTSpanElement | undefined;
  let powerSpan: SVGTSpanElement | undefined;

  const carLiveData = useContext(CarLiveDataContext);

  onMount(() => {
    if (!powerValue || !speedSpan || !powerSpan || !socSpan) return;

    lineLength = powerValue.getTotalLength();
    powerValue.style.strokeDasharray = lineLength + " " + lineLength;
    powerValue.style.strokeDashoffset = `-${lineLength}`;

    const animation = powerValue.animate(
      [
        { strokeDashoffset: `-${lineLength}`, stroke: "white" },
        { stroke: "white", offset: 5000 / 7000 },
        { stroke: "#ff2a2a", offset: 6000 / 7000 },
        {
          strokeDashoffset: `-${lineLength * 2}`,
          stroke: "#ff2a2a",
        },
      ],
      INITIAL_ANIMATION_OPTIONS
    );

    const updateValue = () => {
      const powerW = Math.abs(carLiveData.batteryPower);
      const powerKwt = powerW / 1000;
      const relativeValue = powerKwt / 150;
      updateAnimationProgress(animation, relativeValue);
      speedSpan.innerHTML = `${carLiveData.vehicleSpeed.toFixed()}`;
      socSpan.innerHTML = `${carLiveData.socValue.toFixed()}%`;
      if (powerW < 2000) {
        powerSpan.innerHTML = `${powerW.toFixed()} Вт`;
      } else {
        powerSpan.innerHTML = `${powerKwt.toFixed()} кВт`;
      }
      requestAnimationFrame(updateValue);
    };

    speedSpan.innerHTML = `--`;

    setTimeout(() => requestAnimationFrame(updateValue), INITIAL_ANIMATION_DURATION);
  });

  onMount(() => {
    if (!batteryTemperature || !batteryTemperatureSpan || !batteryTemperatureDiffSpan) return;
    batteryTemperature.style.y = "96px";

    const animationRangeStart = 96;
    const animationRangeEnd = 45;

    const relativeTemperatureValue = (value: number) =>
      (value - temperatureRange.lowest) / (temperatureRange.highest - temperatureRange.lowest);

    const keyFrames = [
      { y: `${animationRangeStart}px`, fill: "#2a7fff" },
      { fill: "#2a7fff", offset: relativeTemperatureValue(5) },
      { fill: "#ffffff", offset: relativeTemperatureValue(10) },
      { fill: "#ffffff", offset: relativeTemperatureValue(40) },
      { y: `${animationRangeEnd}px`, fill: "#ff2a2a" },
    ];

    const animation = batteryTemperature.animate(keyFrames, {
      ...INITIAL_ANIMATION_OPTIONS,
    });

    const updateValue = () => {
      const batteryMedT = (carLiveData.batteryMaxT + carLiveData.batteryMinT) / 2;
      const relativeValue = relativeTemperatureValue(batteryMedT);
      updateAnimationProgress(animation, relativeValue);
      batteryTemperatureSpan.innerHTML = `${batteryMedT}°C`;
      batteryTemperatureDiffSpan.innerHTML = `${Math.abs(carLiveData.batteryMaxT - carLiveData.batteryMinT)}°C`;
      requestAnimationFrame(updateValue);
    };

    batteryTemperatureSpan.innerHTML = "--°C";

    setTimeout(() => requestAnimationFrame(updateValue), INITIAL_ANIMATION_DURATION);
  });

  onMount(() => {
    if (!batteryVoltage || !batteryVoltageSpan || !batteryVoltageDiffSpan) return;

    batteryVoltage.style.y = "96px";

    const animationRangeStart = 96;
    const animationRangeEnd = 45;

    const relativeVoltageValue = (value: number) =>
      (value - voltageRange.lowest) / (voltageRange.highest - voltageRange.lowest);

    const keyFrames = [
      { y: `${animationRangeStart}px`, fill: "#2a7fff" },
      { fill: "#2a7fff", offset: relativeVoltageValue(2.5) },
      { fill: "#ffffff", offset: relativeVoltageValue(2.7) },
      { fill: "#ffffff", offset: relativeVoltageValue(4) },
      { y: `${animationRangeEnd}px`, fill: "#ff2a2a" },
    ];

    const animation = batteryVoltage.animate(keyFrames, {
      ...INITIAL_ANIMATION_OPTIONS,
    });

    const updateValue = () => {
      const batteryMedVoltage = (carLiveData.maxCellVoltageValue + carLiveData.minCellVoltageValue) / 2;
      const batterVoltageDiff = Math.abs(carLiveData.maxCellVoltageValue - carLiveData.minCellVoltageValue);
      const relativeValue = relativeVoltageValue(batteryMedVoltage);
      updateAnimationProgress(animation, relativeValue);
      batteryVoltageSpan.innerHTML = `${batteryMedVoltage.toFixed(2)}В`;
      batteryVoltageDiffSpan.innerHTML = `${batterVoltageDiff.toFixed(2)}В`;
      requestAnimationFrame(updateValue);
    };

    batteryVoltageSpan.innerHTML = "--В";
    batteryVoltageDiffSpan.innerHTML = "--В";

    setTimeout(() => requestAnimationFrame(updateValue), INITIAL_ANIMATION_DURATION);
  });

  return (
    <svg viewBox="8 20 142 100" version="1.1" id="svg1" xmlns="http://www.w3.org/2000/svg">
      <defs id="defs1">
        <filter
          style="color-interpolation-filters: sRGB"
          id="filter1"
          x="-0.0083770359"
          y="-0.016092877"
          width="1.0167541"
          height="1.0321858"
        >
          <feGaussianBlur stdDeviation="0.49615941" id="feGaussianBlur1" />
        </filter>
      </defs>
      <rect
        style="fill:#2a7fff;fill-opacity:1;stroke:none;stroke-width:2.1158;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:17583.1;stroke-opacity:1;paint-order:stroke fill markers"
        id="batteryTemperature"
        ref={batteryTemperature}
        width="11.877826"
        height="51.961636"
        x="43.875488"
        y="44.989208"
        transform="matrix(1,0,-0.31133599,0.9502999,0,0)"
      />
      <rect
        style="fill:#ff2a2a;fill-opacity:1;stroke:none;stroke-width:2.1158;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:17583.1;stroke-opacity:1;paint-order:stroke fill markers"
        id="batteryVoltage"
        ref={batteryVoltage}
        width="10.165843"
        height="53.211285"
        x="64.754662"
        y="44.796955"
        transform="matrix(1,0,-0.31133599,0.9502999,0,0)"
        ry="1.532639"
      />
      <path
        style="display:inline;fill:none;fill-opacity:1;stroke:#ff2a2a;stroke-width:14;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:4652.2;stroke-opacity:1;paint-order:stroke fill markers"
        d="M 58.470472,94.414988 72.552448,59.176244 C 76.835164,47.706769 75.710636,47.510142 97.347986,47.535738 l 50.636334,-0.130114"
        id="powerValue"
        ref={powerValue}
      />
      <path
        id=""
        style="display:inline;fill:#24211f;fill-opacity:1;stroke:none;stroke-width:1.8178;stroke-linecap:round;stroke-linejoin:round"
        d="M 0,-2 V 129 H 169.33333 V -2 Z m 142.06471,44.31783 c 4.00098,-0.0012 6.36473,-0.09753 5.2741,3.861263 l -0.54054,2.133204 c -0.98487,3.215704 -1.5624,4.22343 -6.78201,4.23695 l -50.171615,0.372071 c -8.53091,-0.01561 -9.809683,0.782854 -12.662793,8.123018 L 65.42443,88.549634 c -1.471463,3.401339 -2.357091,3.408289 -4.080371,3.429248 h -2.484086 c -2.899023,-0.0015 -2.206593,-1.47427 -1.44694,-3.727421 L 69.767318,51.327616 c 3.295061,-8.948283 3.160652,-7.795609 19.186425,-8.316288 z M 32.956645,42.991174 h 4.013708 c 1.316066,0.02914 0.724416,1.12354 0.223242,2.860808 L 22.647713,90.591886 c -0.384122,1.257753 -0.738213,1.378773 -1.830379,1.386996 h -3.63492 c -1.069429,0 -0.966569,-0.553157 -0.721403,-1.468128 l 14.584122,-44.85721 c 0.501267,-1.496151 0.803617,-2.657815 1.911512,-2.66237 z m 20.519677,0 h 4.013709 c 1.316066,0.02914 0.724416,1.12354 0.223242,2.860808 L 43.167391,90.591886 c -0.384122,1.257753 -0.738213,1.378773 -1.830379,1.386996 h -3.634921 c -1.069429,0 -0.967085,-0.553158 -0.721919,-1.468128 l 14.584639,-44.85721 c 0.501267,-1.496151 0.803616,-2.657815 1.911511,-2.66237 z"
      />
      <path
        id="path1"
        style="display:inline;fill:#24211f;fill-opacity:1;stroke:none;stroke-width:1.8178;stroke-linecap:round;stroke-linejoin:round;filter:url(#filter1)"
        d="M 14.757812,38.320312 V 98.648438 H 156.90625 V 38.320312 Z m 127.306638,3.998047 c 4.00098,-0.0012 6.36407,-0.09746 5.27344,3.861329 l -0.53906,2.132812 c -0.98487,3.215701 -1.5636,4.222808 -6.78321,4.236328 l -50.17187,0.373047 c -8.530901,-0.01561 -9.809002,0.78289 -12.662109,8.123047 L 65.423828,88.548828 c -1.471461,3.401336 -2.3568,3.408729 -4.080078,3.429688 h -2.484375 c -2.89902,-0.0015 -2.206918,-1.473414 -1.447266,-3.726563 L 69.767578,51.328125 c 3.295058,-8.948274 3.15979,-7.795728 19.185547,-8.316406 z M 32.957031,42.990234 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222656,2.861328 L 22.648438,90.591797 c -0.384122,1.257752 -0.739867,1.378496 -1.832032,1.386719 h -3.634765 c -1.069428,0 -0.965869,-0.551827 -0.720703,-1.466797 L 31.044922,45.654297 c 0.501266,-1.49615 0.804215,-2.659508 1.912109,-2.664063 z m 20.519531,0 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222657,2.861328 L 43.167969,90.591797 c -0.384122,1.257752 -0.737913,1.378496 -1.830078,1.386719 h -3.636719 c -1.069428,0 -0.965869,-0.551828 -0.720703,-1.466797 L 51.564453,45.654297 c 0.501267,-1.49615 0.804216,-2.659508 1.912109,-2.664063 z M 49.930329,24.654049 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222656,2.861328 L 39.621736,72.255612 c -0.384122,1.257752 -0.739867,1.378496 -1.832032,1.386719 h -3.634765 c -1.069428,0 -0.965869,-0.551827 -0.720703,-1.466797 L 48.01822,27.318112 c 0.501266,-1.49615 0.804215,-2.659508 1.912109,-2.664063 z"
      />
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:18.2314px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f2f2f2;fill-opacity:0.844653;stroke-width:15.1928;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="92.912605"
        id="text1"
        y="0"
      >
        <tspan
          id="speedSpan"
          ref={speedSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;stroke-width:15.1928"
          x="122.9126"
          y="81.488785"
        >
          320
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.1436px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f2f2f2;fill-opacity:0.844653;stroke-width:8.453;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="105.20061"
        id="text1-1"
        y="47.70742"
      >
        <tspan
          id="socSpan"
          ref={socSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;stroke-width:8.453"
          x="121.89207"
          y="93.04631"
        >
          100%
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:8px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#ffffff;fill-opacity:1;stroke:#24211f;stroke-width:0.7;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:17583.1;stroke-opacity:1;paint-order:stroke fill markers"
        x="112.82273"
        id="text2"
      >
        <tspan
          id="powerSpan"
          ref={powerSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:8px;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;fill:#ffffff;fill-opacity:1;stroke:#24211f;stroke-width:0.7;stroke-dasharray:none;stroke-opacity:1"
          x="142.82275"
          y="50.211357"
        >
          52 кВт
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.13432px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.44526;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="37.378757"
        id="text3"
      >
        <tspan
          id="batteryVoltageSpan"
          ref={batteryVoltageSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.44526"
          x="44.181839"
          y="106.2525"
        >
          3.7В
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:3.5394px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:2.9495;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="38.9305"
        id="text3-2"
        y="18.987761"
      >
        <tspan
          id="batteryVoltageDiffSpan"
          ref={batteryVoltageDiffSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:2.9495"
          x="44.754635"
          y="109.95081"
        >
          0.02В
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.13432px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.44526;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="17.990339"
        id="text4"
      >
        <tspan
          id="batteryTemperatureSpan"
          ref={batteryTemperatureSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.44526"
          x="24.793421"
          y="106.2525"
        >
          20°C
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:3.33201px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:2.77667;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="16.987755"
        id="text4-6"
        y="24.389366"
      >
        <tspan
          id="batteryTemperatureDiffSpan"
          ref={batteryTemperatureDiffSpan}
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Monospace;-inkscape-font-specification:Monospace;text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:2.77667"
          x="22.470625"
          y="110.02242"
        >
          2°C
        </tspan>
      </text>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="5.9197226"
        y="92.309402"
        id="text1-5-4-2"
      >
        <tspan
          id="tspan1-9-8-7"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
          x="13.229364"
          y="92.309402"
        >
          -10
        </tspan>
      </text>
      <text
        style="font-size:5.33333px;text-align:start;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:15.1928;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="122.57192"
        y="81.298347"
        id="text1-8"
      >
        <tspan
          id="tspan1-2"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:5.33333px;font-family:Monospace;-inkscape-font-specification:Monospace;fill:#f9f9f9;stroke-width:15.1928"
          x="122.57192"
          y="81.298347"
        >
          км/год{" "}
        </tspan>
      </text>
      <path
        style="fill:#f9f9f9;stroke:#80b3ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
        d="m 14.024785,90.891915 h 2.1828"
        id="path2"
      />
      <g id="g3" transform="translate(0.44742285,-1.7825014)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="18.817513"
          y="53.306458"
          id="text1-5-4-2-9-7-0"
        >
          <tspan
            id="tspan1-9-8-7-98-1-3"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="26.12714"
            y="53.306458"
          >
            50
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 26.730815,51.889 h 2.1828"
          id="path2-8-8-7"
        />
      </g>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="21.775558"
        y="44.417397"
        id="text1-5-4-2-9-7-0-3"
      >
        <tspan
          id="tspan1-9-8-7-98-1-3-9"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
          x="29.085186"
          y="44.417397"
        >
          60
        </tspan>
      </text>
      <path
        style="fill:#ff8080;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
        d="m 29.880599,42.999911 h 2.1828"
        id="path2-8-8-7-2"
      />
      <g id="g10" transform="translate(-10.748456,32.967499)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="18.817513"
          y="53.306458"
          id="text9"
        >
          <tspan
            id="tspan9"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="26.12714"
            y="53.306458"
          >
            0
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#80b3ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 26.730815,51.889 h 2.1828"
          id="path10"
        />
      </g>
      <g id="g9" transform="translate(-8.4927836,26.047499)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="18.817513"
          y="53.306458"
          id="text8"
        >
          <tspan
            id="tspan8"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="26.12714"
            y="53.306458"
          >
            10
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#80b3ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 26.730815,51.889 h 2.1828"
          id="path9"
        />
      </g>
      <path
        d="m 32.803922,42.886445 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222656,2.861328 L 22.495329,90.488008 c -0.384122,1.257752 -0.739867,1.378496 -1.832032,1.386719 h -3.634765 c -1.069428,0 -0.965869,-0.551827 -0.720703,-1.466797 L 30.891813,45.550508 c 0.501266,-1.49615 0.804215,-2.659508 1.912109,-2.664063 z"
        style="display:inline;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.378;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
        id="path1-7"
      />
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="26.633659"
        y="92.35067"
        id="text1-5-4-2-0"
      >
        <tspan
          id="tspan1-9-8-7-5"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
          x="33.943302"
          y="92.35067"
        >
          2.0
        </tspan>
      </text>
      <path
        style="fill:#f9f9f9;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
        d="m 34.738722,90.933188 h 2.1828"
        id="path2-1"
      />
      <g id="g11" transform="translate(-9.2275733,-41.348343)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.599442"
          y="95.622299"
          id="text1-5-4-2-9-1"
        >
          <tspan
            id="tspan1-9-8-7-98-4"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.909084"
            y="95.622299"
          >
            4.0
          </tspan>
        </text>
        <path
          style="fill:#aaeeff;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.238177,94.20484 h 2.1828"
          id="path2-8-5"
        />
      </g>
      <text
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
        x="42.749428"
        y="44.368057"
        id="text1-5-4-2-9-7-0-3-9"
      >
        <tspan
          id="tspan1-9-8-7-98-1-3-9-9"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
          x="50.059059"
          y="44.368057"
        >
          4.5
        </tspan>
      </text>
      <path
        style="fill:#ff8080;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
        d="m 50.854456,42.950577 h 2.1828"
        id="path2-8-8-7-2-9"
      />
      <g id="g14" transform="translate(-18.734771,-12.088343)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.599442"
          y="95.622299"
          id="text13"
        >
          <tspan
            id="tspan13"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.909084"
            y="95.622299"
          >
            2.5
          </tspan>
        </text>
        <path
          style="fill:#aaeeff;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.238177,94.20484 h 2.1828"
          id="path13"
        />
      </g>
      <path
        d="m 53.517859,42.927718 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222656,2.861328 L 43.209266,90.529278 c -0.384122,1.25775 -0.739867,1.3785 -1.832032,1.38672 h -3.634765 c -1.069428,0 -0.965869,-0.55183 -0.720703,-1.4668 L 51.60575,45.591781 c 0.501266,-1.49615 0.804215,-2.659508 1.912109,-2.664063 z"
        style="display:inline;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.378;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
        id="path1-7-9"
      />
      <path
        d="m 141.83127,42.283166 c 4.00098,-0.0012 6.36407,-0.09746 5.27344,3.861329 l -0.53906,2.132812 c -0.98487,3.215701 -1.5636,4.222808 -6.78321,4.236328 l -50.171871,0.373047 c -8.5309,-0.01561 -9.809,0.78289 -12.66211,8.123047 l -11.75781,27.503906 c -1.47146,3.401336 -2.3568,3.408729 -4.08008,3.429688 h -2.48438 c -2.89902,-0.0015 -2.20691,-1.473414 -1.44726,-3.726563 l 12.35547,-36.923828 c 3.29506,-8.948274 3.15979,-7.795728 19.18554,-8.316406 z"
        style="display:inline;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.378;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
        id="path1-9"
      />
      <g id="g2" transform="translate(2.0935738,0.69239045)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.031769"
          y="78.623436"
          id="text1-5-4-2-9-7-2"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.341404"
            y="78.623436"
          >
            20
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.136827,77.720551 h 2.1828"
          id="path2-8-8-97"
        />
      </g>
      <g id="g2-7" transform="translate(7.4061419,-15.100074)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.031769"
          y="78.623436"
          id="text1-5-4-2-9-7-2-2"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5-2"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.341404"
            y="78.623436"
          >
            40
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.136827,77.720551 h 2.1828"
          id="path2-8-8-97-8"
        />
      </g>
      <g id="g2-7-5" transform="translate(19.541228,-35.437436)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="49.703548"
          y="77.103638"
          id="text1-5-4-2-9-7-2-2-2"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5-2-2"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="57.013184"
            y="77.103638"
          >
            60
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 57.801644,76.685644 0.546658,2.113238"
          id="path2-8-8-97-8-4"
        />
      </g>
      <g id="g2-7-5-6" transform="translate(38.328341,-36.005615)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="49.703548"
          y="77.103638"
          id="text1-5-4-2-9-7-2-2-2-1"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5-2-2-9"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="57.013184"
            y="77.103638"
          >
            80
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 57.801644,76.685644 0.546658,2.113238"
          id="path2-8-8-97-8-4-6"
        />
      </g>
      <g id="g2-7-5-64" transform="translate(72.088034,-36.39828)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="49.703548"
          y="77.103638"
          id="text1-5-4-2-9-7-2-2-2-7"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5-2-2-4"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="57.013184"
            y="77.103638"
          >
            120
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 57.801644,76.685644 0.546658,2.113238"
          id="path2-8-8-97-8-4-5"
        />
      </g>
      <g id="g2-7-5-1" transform="translate(88.570027,-35.694455)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.311829"
          y="76.354973"
          id="text1-5-4-2-9-7-2-2-2-9"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5-2-2-1"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.621464"
            y="76.354973"
          >
            140
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.784255,76.077361 0.546658,2.113238"
          id="path2-8-8-97-8-4-0"
        />
      </g>
      <g id="g2-7-5-0" transform="translate(55.241959,-36.275986)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="49.703548"
          y="77.103638"
          id="text1-5-4-2-9-7-2-2-2-3"
        >
          <tspan
            id="tspan1-9-8-7-98-1-5-2-2-99"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:2.66667px;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="57.013184"
            y="77.103638"
          >
            100
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 57.801644,76.685644 0.546658,2.113238"
          id="path2-8-8-97-8-4-4"
        />
      </g>
      <g id="g6" transform="translate(-1.6298965,5.1774986)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="18.817513"
          y="53.306458"
          id="text5"
        >
          <tspan
            id="tspan3"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="26.12714"
            y="53.306458"
          >
            40
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 26.730815,51.889 h 2.1828"
          id="path6"
        />
      </g>
      <g id="g7" transform="translate(-3.9175257,12.137499)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="18.817513"
          y="53.306458"
          id="text6"
        >
          <tspan
            id="tspan6"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="26.12714"
            y="53.306458"
          >
            30
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 26.730815,51.889 h 2.1828"
          id="path7"
        />
      </g>
      <g id="g8" transform="translate(-6.1731961,19.087499)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="18.817513"
          y="53.306458"
          id="text7"
        >
          <tspan
            id="tspan7"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="26.12714"
            y="53.306458"
          >
            20
          </tspan>
        </text>
        <path
          style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 26.730815,51.889 h 2.1828"
          id="path8"
        />
      </g>
      <g id="g12" transform="translate(-12.396639,-31.568343)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.599442"
          y="95.622299"
          id="text11"
        >
          <tspan
            id="tspan11"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.909084"
            y="95.622299"
          >
            3.5
          </tspan>
        </text>
        <path
          style="fill:#aaeeff;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.238177,94.20484 h 2.1828"
          id="path11"
        />
      </g>
      <g id="g13" transform="translate(-15.501787,-21.828343)">
        <text
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
          x="48.599442"
          y="95.622299"
          id="text12"
        >
          <tspan
            id="tspan12"
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
            x="55.909084"
            y="95.622299"
          >
            3.0
          </tspan>
        </text>
        <path
          style="fill:#aaeeff;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
          d="m 56.238177,94.20484 h 2.1828"
          id="path12"
        />
      </g>
      <g style="fill:none" id="g15" transform="matrix(0.00873906,0,0,0.00873906,16.882701,95.083811)">
        <path
          fill="#ffffff"
          fill-rule="evenodd"
          d="m 99.5,224 h -23 v 84 H 0 V 604.5 H 585.5 V 308 H 489 V 224 H 366 v 84 h -19 v 46 H 539.5 V 558.5 H 46 V 354 h 186 v -46 h -32.5 v -84 z m 54,84 h -31 v -38 h 31 z M 443,270 v 38 H 412 V 270 Z M 647.5,648.5 V 398 h -46 V 625.5 H 85 v 46 h 562.5 z m 70,60.5 V 458.5 h -46 V 686 H 155 v 46 h 562.5 z"
          clip-rule="evenodd"
          id="path1-3"
        />
        <path
          fill="#ffffff"
          d="M 321,31 C 321,13.8792 307.121,0 290,0 272.879,0 259,13.8792 259,31 Z m -62,0 v 379 h 62 V 31 Z"
          id="path2-6"
        />
        <circle cx="289.5" cy="446.5" r="57.5" fill="#ffffff" id="circle2" />
        <path stroke="#ffffff" stroke-width="40" d="M 290.5,106.5 H 415 M 291,176 h 124.5" id="path3-1" />
        <path fill="#ffffff" d="m 121,252 h 51 v 63 h -51 z m 279,0 h 51 v 63 h -51 z" id="path4" />
      </g>
      <g style="fill:none" id="g16" transform="matrix(0.00981013,0,0,0.00981013,36.467445,95.407656)">
        <path
          fill="#ffffff"
          fill-rule="evenodd"
          d="M 120.102,124 H 76.5 v 84 H 0 V 504.5 H 585.5 V 208 H 489 V 124 H 477.683 L 411.102,254 H 539.5 V 458.5 H 46 V 254 H 169.889 Z M 647.5,548.5 V 298 h -46 V 525.5 H 85 v 46 h 562.5 z m 70,60.5 V 358.5 h -46 V 586 H 155 v 46 h 562.5 z"
          clip-rule="evenodd"
          id="path1-0"
        />
        <path
          stroke="#ffffff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="58"
          d="M 156,29 282,358 450.5,29"
          id="path2-4"
        />
      </g>
    </svg>
  );
};

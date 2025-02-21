import { createEffect, createSignal, onMount, useContext, type Component } from "solid-js";

import styles from "./Dashboard.module.css";
import { CarLiveDataContext } from "../../CarLiveDataContext";
import { updateAnimationProgress } from "./Dashboard.helpers";

const ANIMATION_DURATION = 1000;

const durationOptions: KeyframeAnimationOptions = {
  duration: ANIMATION_DURATION,
  fill: "both",
};

export const Dashboard: Component<{ goToMainScreen: () => void }> = (props) => {
  let lineLength = 0;
  let coolantTemperature: SVGRectElement | undefined;
  let oilTemperature: SVGRectElement | undefined;
  let revValue: SVGPathElement | undefined;

  let speedSpan: SVGTSpanElement | undefined;
  let coolantTemperatureSpan: SVGTSpanElement | undefined;
  let oilTemperatureSpan: SVGTSpanElement | undefined;

  const carLiveData = useContext(CarLiveDataContext);

  onMount(() => {
    if (!revValue || !speedSpan) return;

    lineLength = revValue.getTotalLength();
    revValue.style.strokeDasharray = lineLength + " " + lineLength;
    revValue.style.strokeDashoffset = `-${lineLength}`;

    const animation = revValue.animate(
      [
        { strokeDashoffset: `-${lineLength}`, stroke: "white" },
        { stroke: "white", offset: 5000 / 7000 },
        { stroke: "#ff2a2a", offset: 6000 / 7000 },
        {
          strokeDashoffset: `-${lineLength * 2}`,
          stroke: "#ff2a2a",
        },
      ],
      durationOptions
    );

    const updateValue = () => {
      const relativeValue = carLiveData.rpm / 7000;
      updateAnimationProgress(animation, relativeValue);
      speedSpan.innerHTML = `${carLiveData.vehicleSpeed.toFixed()}`;
      requestAnimationFrame(updateValue);
    };

    speedSpan.innerHTML = `--`;

    setTimeout(() => requestAnimationFrame(updateValue), ANIMATION_DURATION);
  });

  onMount(() => {
    if (!coolantTemperature || !coolantTemperatureSpan) return;
    coolantTemperature.style.y = "96px";

    const animationRangeStart = 96;
    const animationRangeEnd = 45;

    const keyFrames = [
      { y: `${animationRangeStart}px`, fill: "#2a7fff" },
      { fill: "#2a7fff", offset: (30 - 10) / (130 - 10) },
      { fill: "#ffffff", offset: (50 - 10) / (130 - 10) },
      { fill: "#ffffff", offset: (100 - 10) / (130 - 10) },
      { y: `${animationRangeEnd}px`, fill: "#ff2a2a" },
    ];

    const animation = coolantTemperature.animate(keyFrames, {
      ...durationOptions,
    });

    const updateValue = () => {
      const relativeValue = (carLiveData.coolantTemperature - 10) / (130 - 10);
      updateAnimationProgress(animation, relativeValue);
      coolantTemperatureSpan.innerHTML = `${carLiveData.coolantTemperature}°C`;
      requestAnimationFrame(updateValue);
    };

    coolantTemperatureSpan.innerHTML = "--°C";

    setTimeout(() => requestAnimationFrame(updateValue), ANIMATION_DURATION);
  });

  onMount(() => {
    if (!oilTemperature || !oilTemperatureSpan) return;

    oilTemperature.style.y = "96px";

    const animationRangeStart = 96;
    const animationRangeEnd = 45;

    const keyFrames = [
      { y: `${animationRangeStart}px`, fill: "#2a7fff" },
      { fill: "#2a7fff", offset: (30 - 10) / (130 - 10) },
      { fill: "#ffffff", offset: (50 - 10) / (130 - 10) },
      { fill: "#ffffff", offset: (100 - 10) / (130 - 10) },
      { y: `${animationRangeEnd}px`, fill: "#ff2a2a" },
    ];

    const animation = oilTemperature.animate(keyFrames, {
      ...durationOptions,
    });

    const updateValue = () => {
      const relativeValue = (carLiveData.oilTemperature - 10) / (130 - 10);
      updateAnimationProgress(animation, relativeValue);
      oilTemperatureSpan.innerHTML = `${carLiveData.oilTemperature}°C`;
      requestAnimationFrame(updateValue);
    };

    oilTemperatureSpan.innerHTML = "--°C";

    setTimeout(() => requestAnimationFrame(updateValue), ANIMATION_DURATION);
  });

  return (
    <div class={styles.Dashboard}>
      <button class={styles.GoToMainScreenButton} onClick={props.goToMainScreen}>
        {"<<<"}
      </button>
      <div class={styles.DashContainer}>
        <svg viewBox="0 0 169.33333 127" version="1.1" id="svg1" xmlns="http://www.w3.org/2000/svg">
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
            ref={coolantTemperature}
            width="11.877826"
            height="51.961636"
            x="43.875488"
            y="44.989208"
            transform="matrix(1,0,-0.31133599,0.9502999,0,0)"
          />
          <rect
            style="fill:#ff2a2a;fill-opacity:1;stroke:none;stroke-width:2.1158;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-dashoffset:17583.1;stroke-opacity:1;paint-order:stroke fill markers"
            ref={oilTemperature}
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
            ref={revValue}
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
          <path
            id="path5"
            d="m 19.232794,95.667415 c -0.156333,0 -0.282172,0.125839 -0.282172,0.282172 v 3.209571 c -0.130239,0.0916 -0.207909,0.240725 -0.208313,0.399952 1e-6,0.27089 0.219597,0.49049 0.490485,0.49049 0.270887,0 0.490483,-0.2196 0.490484,-0.49049 -5e-5,-0.159612 -0.07776,-0.309217 -0.208312,-0.401042 v -0.56456 h 1.305035 v -0.40822 H 19.514966 V 97.71394 h 1.305035 v -0.408218 h -1.305035 v -0.474973 h 1.305035 v -0.408218 h -1.305035 v -0.472944 c 0,-0.156333 -0.125839,-0.282172 -0.282172,-0.282172 z m -2.359573,3.398453 v 8e-5 l -0.0024,7e-5 c -0.267445,0.002 -0.481615,0.10562 -0.66676,0.19106 -0.0062,0.003 -0.01179,0.005 -0.0179,0.008 v 0.444892 c 0.06631,-0.0271 0.130095,-0.0552 0.18896,-0.0823 0.18499,-0.0854 0.336243,-0.15157 0.496283,-0.15337 0.173003,0.003 0.329194,0.0712 0.513534,0.1562 0.185201,0.0854 0.399273,0.18895 0.66647,0.19106 h 0.0047 c 0.09189,-0.001 0.177107,-0.0146 0.257455,-0.0339 -0.01923,-0.0747 -0.02928,-0.15143 -0.02994,-0.22854 8.02e-4,-0.0652 0.0083,-0.130252 0.02247,-0.193962 -0.08414,0.0283 -0.166829,0.0464 -0.253831,0.048 -0.160021,-0.002 -0.311448,-0.0681 -0.4965,-0.15337 -0.185977,-0.0857 -0.405586,-0.18942 -0.680242,-0.19382 z m 4.72306,8e-5 -0.0024,7e-5 c -0.267446,0.002 -0.481616,0.10562 -0.666761,0.19106 -0.184292,0.085 -0.340269,0.1529 -0.513316,0.15613 -0.08441,-10e-4 -0.166719,-0.0206 -0.252527,-0.0507 0.01376,0.06464 0.02073,0.130552 0.0208,0.196642 -6.62e-4,0.0769 -0.01067,0.15341 -0.02979,0.22789 0.08126,0.0203 0.167588,0.0338 0.260718,0.0346 h 0.0047 c 0.274879,-0.004 0.494534,-0.10808 0.680459,-0.19389 0.185101,-0.0854 0.336418,-0.15164 0.496573,-0.15337 0.17288,0.003 0.328946,0.0712 0.513171,0.15613 0.05421,0.025 0.111867,0.0509 0.171637,0.076 v -0.446342 c -2.52e-4,-1.2e-4 -4.76e-4,-1.9e-4 -7.29e-4,-3e-4 -0.185976,-0.0857 -0.405586,-0.1895 -0.680242,-0.19389 z m -4.707622,1.197902 c -0.07314,5.2e-4 -0.140306,0.0113 -0.202151,0.0276 v 0.43242 c 0.07556,-0.0309 0.139643,-0.0504 0.202731,-0.0513 0.09792,0.002 0.190634,0.0403 0.312034,0.0954 0.122358,0.0555 0.274246,0.12896 0.468161,0.13047 l 0.0023,7e-5 0.0023,-7e-5 c 0.198116,-0.003 0.353823,-0.0764 0.476931,-0.13235 0.12206,-0.0555 0.211526,-0.0923 0.300002,-0.0935 0.09792,0.002 0.190634,0.0403 0.312034,0.0954 0.122358,0.0555 0.274246,0.12896 0.46816,0.13047 l 0.0023,7e-5 0.0023,-7e-5 c 0.198119,-0.003 0.353823,-0.0764 0.47693,-0.13235 0.122061,-0.0555 0.2116,-0.0923 0.300075,-0.0935 0.09789,0.002 0.190664,0.0403 0.312034,0.0954 0.122358,0.0555 0.274177,0.12903 0.468088,0.13054 h 0.0023 l 0.0023,-7e-5 c 0.198116,-0.003 0.353896,-0.0764 0.477003,-0.13235 0.122061,-0.0555 0.211527,-0.0923 0.300002,-0.0935 0.06678,0.001 0.131771,0.0206 0.204471,0.0495 v -0.43069 c -0.06153,-0.0156 -0.128079,-0.0263 -0.200415,-0.0274 l -0.0023,-7e-5 h -0.0023 c -0.194108,0.001 -0.346072,0.075 -0.468377,0.13054 -0.121352,0.0552 -0.213923,0.0934 -0.311817,0.0954 -0.0885,-10e-4 -0.178122,-0.0382 -0.30022,-0.0936 -0.123126,-0.0559 -0.278775,-0.12916 -0.476713,-0.13228 l -0.0023,-7e-5 h -0.0023 c -0.194111,0.001 -0.346072,0.075 -0.468377,0.13054 -0.121352,0.0552 -0.213926,0.0934 -0.311817,0.0954 -0.0885,-0.001 -0.178194,-0.0382 -0.300292,-0.0936 -0.12313,-0.0559 -0.278703,-0.12923 -0.476641,-0.13235 h -0.0047 c -0.194107,0.001 -0.346072,0.075 -0.468378,0.13054 -0.121351,0.0552 -0.21385,0.0934 -0.311744,0.0954 -0.0885,-0.001 -0.178194,-0.0382 -0.300292,-0.0936 -0.12313,-0.0559 -0.278776,-0.12923 -0.476713,-0.13235 z"
            style="fill: #f2f2f2; stroke-width: 0.0371106"
          />
          <path
            id="path5-0"
            style="display: inline; fill: #f2f2f2; stroke-width: 0.0357183"
            d="m 39.614024,95.267481 c -0.150466,0 -0.271647,0.121176 -0.271647,0.271647 v 3.089115 c -0.125348,0.08814 -0.20005,0.231675 -0.200438,0.384928 4e-6,0.26072 0.211363,0.472076 0.472085,0.472076 0.260722,0 0.472082,-0.211356 0.472086,-0.472076 -4e-5,-0.153615 -0.07487,-0.29761 -0.200519,-0.385988 v -0.543369 h 1.256036 v -0.392869 h -1.256036 v -0.453717 h 1.256036 v -0.392865 h -1.256036 v -0.457197 h 1.256036 v -0.392865 h -1.256036 v -0.455173 c 0,-0.150468 -0.121096,-0.271647 -0.271567,-0.271647 z m -3.170596,2.698591 -0.283299,1.108359 1.579228,0.548706 0.0114,1.271413 3.628278,0.004 1.756282,-2.042569 c 0.149163,-0.04749 0.310227,-0.09887 0.34763,-0.110941 l 0.20149,0.180779 0.229651,-0.255876 -0.347793,-0.31211 -0.09402,0.03032 c 0,0 -0.810931,0.261509 -1.322066,0.412534 -0.410251,0.12127 -1.163783,0.326204 -1.495963,0.416334 -0.0281,0.14459 -0.086,0.281746 -0.170012,0.402726 0.01623,-0.004 1.245201,-0.336166 1.763483,-0.489306 0.08453,-0.025 0.176802,-0.0533 0.267764,-0.081 l -1.294149,1.505089 -3.129812,-0.003 -0.01207,-1.338339 0.491507,-10e-4 -8.2e-5,-0.0192 c -0.01047,-0.05858 -0.01599,-0.117942 -0.01651,-0.17745 6.2e-5,-0.04928 0.0036,-0.09849 0.01046,-0.14728 l -0.488513,0.0013 -0.0032,-0.354354 z m 0.241465,0.444005 1.046697,0.352328 0.0044,0.495536 -1.164434,-0.404583 z m 6.999716,1.03577 c -0.07092,-2.1e-4 -0.128595,0.0571 -0.128823,0.12797 l -9.7e-4,0.16136 c -0.0028,0.11161 -0.02332,0.21147 -0.07744,0.305553 -0.01478,0.0306 -0.02283,0.0644 -0.0229,0.0993 -2.7e-5,0.12637 0.102436,0.2289 0.228841,0.22892 0.126408,-2e-5 0.228867,-0.10249 0.228841,-0.22892 0,-0.0327 -0.007,-0.0645 -0.01999,-0.0935 -0.0583,-0.0906 -0.07037,-0.201163 -0.08052,-0.307103 l 0.001,-0.16474 c 2.04e-4,-0.071 -0.05715,-0.12865 -0.128099,-0.12879 z"
          />
          <text
            style='       font-style: normal;       font-variant: normal;       font-weight: normal;       font-stretch: normal;       font-size: 18.2314px;       font-family: Consolas;       -inkscape-font-specification: "Open Sans";       text-align: end;       writing-mode: lr-tb;       direction: ltr;       text-anchor: start;       fill: #f2f2f2;       fill-opacity: 0.844653;       stroke-width: 15.1928;       stroke-linejoin: round;       stroke-dashoffset: 17583.1;       paint-order: stroke fill markers;     '
            x="93.454964"
            y="81.488785"
            id="text1"
          >
            <tspan
              id="speedSpan"
              ref={speedSpan}
              style='         font-style: normal;         font-variant: normal;         font-weight: normal;         font-stretch: normal;         -inkscape-font-specification: "Open Sans";         text-align: end;         text-anchor: end;         stroke-width: 15.1928;       '
              x="123.45496"
              y="81.488785"
            >
              &#10; 320&#10;{" "}
            </tspan>
          </text>
          <text
            style='       font-style: normal;       font-variant: normal;       font-weight: normal;       font-stretch: normal;       font-size: 4.13432px;       font-family: Consolas;       -inkscape-font-specification: "Open Sans";       text-align: end;       writing-mode: lr-tb;       direction: ltr;       text-anchor: start;       fill: #f9f9f9;       fill-opacity: 0.844653;       stroke-width: 3.44526;       stroke-linejoin: round;       stroke-dashoffset: 17583.1;       paint-order: stroke fill markers;     '
            x="38.912659"
            y="106.2525"
            id="text1-5"
          >
            <tspan
              id="oilTemperatureSpan"
              ref={oilTemperatureSpan}
              style='         font-style: normal;         font-variant: normal;         font-weight: normal;         font-stretch: normal;         -inkscape-font-specification: "Open Sans";         text-align: end;         text-anchor: end;         stroke-width: 3.44526;         fill: #f9f9f9;       '
              x="45.71574"
              y="106.2525"
            >
              &#10; 140°C&#10;{" "}
            </tspan>
          </text>
          <text
            style='       font-style: normal;       font-variant: normal;       font-weight: normal;       font-stretch: normal;       font-size: 4.13432px;       font-family: Consolas;       -inkscape-font-specification: "Open Sans";       text-align: end;       writing-mode: lr-tb;       direction: ltr;       text-anchor: start;       fill: #f9f9f9;       fill-opacity: 0.844653;       stroke-width: 3.44526;       stroke-linejoin: round;       stroke-dashoffset: 17583.1;       paint-order: stroke fill markers;     '
            x="17.990339"
            y="106.2525"
            id="text1-5-4"
          >
            <tspan
              ref={coolantTemperatureSpan}
              id="coolantTemperatureSpan"
              style='         font-style: normal;         font-variant: normal;         font-weight: normal;         font-stretch: normal;         -inkscape-font-specification: "Open Sans";         text-align: end;         text-anchor: end;         stroke-width: 3.44526;         fill: #f9f9f9;       '
              x="24.793421"
              y="106.2525"
            >
              &#10; 140°C&#10;{" "}
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
              10
            </tspan>
          </text>
          <text
            style="       font-size: 7.05556px;       text-align: start;       writing-mode: lr-tb;       direction: ltr;       text-anchor: start;       fill: #f9f9f9;       fill-opacity: 0.844653;       stroke-width: 15.1928;       stroke-linejoin: round;       stroke-dashoffset: 17583.1;       paint-order: stroke fill markers;     "
            x="99.250504"
            y="90.699226"
            id="text1-8"
          >
            <tspan
              id="tspan1-2"
              style='         font-style: italic;         font-variant: normal;         font-weight: normal;         font-stretch: normal;         font-size: 7.05556px;         -inkscape-font-specification: "Open Sans Italic";         stroke-width: 15.1928;         fill: #f9f9f9;       '
              x="99.250504"
              y="90.699226"
            >
              &#10; км/год&#10;{" "}
            </tspan>
          </text>
          <path
            style="fill:#f9f9f9;stroke:#80b3ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
            d="m 14.024785,90.891915 h 2.1828"
            id="path2"
          />
          <text
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
            x="8.2821808"
            y="84.319786"
            id="text1-5-4-2-9"
          >
            <tspan
              id="tspan1-9-8-7-98"
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
              x="15.591823"
              y="84.319786"
            >
              30
            </tspan>
          </text>
          <path
            style="fill:#aaeeff;stroke:#5599ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
            d="m 16.387243,82.902285 h 2.1828"
            id="path2-8"
          />
          <text
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
            x="10.837154"
            y="76.619194"
            id="text1-5-4-2-9-7"
          >
            <tspan
              id="tspan1-9-8-7-98-1"
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
              x="18.146791"
              y="76.619194"
            >
              50
            </tspan>
          </text>
          <path
            style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
            d="m 18.942213,75.201703 h 2.1828"
            id="path2-8-8"
          />
          <text
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
            x="14.783617"
            y="64.603737"
            id="text1-5-4-2-9-7-0"
          >
            <tspan
              id="tspan1-9-8-7-98-1-3"
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
              x="22.093245"
              y="64.603737"
            >
              80
            </tspan>
          </text>
          <path
            style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
            d="m 22.88867,63.186261 h 2.1828"
            id="path2-8-8-7"
          />
          <text
            style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
            x="18.837784"
            y="52.32679"
            id="text1-5-4-2-9-7-0-3"
          >
            <tspan
              id="tspan1-9-8-7-98-1-3-9"
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
              x="26.147411"
              y="52.32679"
            >
              110
            </tspan>
          </text>
          <path
            style="fill:#ff8080;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
            d="m 26.942825,50.909304 h 2.1828"
            id="path2-8-8-7-2"
          />
          <path
            d="m 32.803922,42.886445 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222656,2.861328 L 22.495329,90.488008 c -0.384122,1.257752 -0.739867,1.378496 -1.832032,1.386719 h -3.634765 c -1.069428,0 -0.965869,-0.551827 -0.720703,-1.466797 L 30.891813,45.550508 c 0.501266,-1.49615 0.804215,-2.659508 1.912109,-2.664063 z"
            style="display:inline;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.378;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
            id="path1-7"
          />
          <g id="g1" transform="translate(-17.648521,-15.261282)">
            <text
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
              x="44.282181"
              y="107.61195"
              id="text1-5-4-2-0"
            >
              <tspan
                id="tspan1-9-8-7-5"
                style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
                x="51.591824"
                y="107.61195"
              >
                10
              </tspan>
            </text>
            <path
              style="fill:#f9f9f9;stroke:#80b3ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
              d="m 52.387243,106.19447 h 2.1828"
              id="path2-1"
            />
            <text
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
              x="46.644638"
              y="99.622337"
              id="text1-5-4-2-9-1"
            >
              <tspan
                id="tspan1-9-8-7-98-4"
                style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
                x="53.954281"
                y="99.622337"
              >
                30
              </tspan>
            </text>
            <path
              style="fill:#aaeeff;stroke:#5599ff;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
              d="m 54.749701,98.20484 h 2.1828"
              id="path2-8-5"
            />
            <text
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
              x="49.199612"
              y="91.921745"
              id="text1-5-4-2-9-7-4"
            >
              <tspan
                id="tspan1-9-8-7-98-1-1"
                style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
                x="56.509251"
                y="91.921745"
              >
                50
              </tspan>
            </text>
            <path
              style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
              d="m 57.304671,90.504258 h 2.1828"
              id="path2-8-8-9"
            />
            <text
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
              x="53.146076"
              y="79.906288"
              id="text1-5-4-2-9-7-0-7"
            >
              <tspan
                id="tspan1-9-8-7-98-1-3-2"
                style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
                x="60.455704"
                y="79.906288"
              >
                80
              </tspan>
            </text>
            <path
              style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
              d="m 61.251128,78.488816 h 2.1828"
              id="path2-8-8-7-5"
            />
            <text
              style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:4.44216px;font-family:Consolas;-inkscape-font-specification:'Open Sans';text-align:end;writing-mode:lr-tb;direction:ltr;text-anchor:start;fill:#f9f9f9;fill-opacity:0.844653;stroke-width:3.7018;stroke-linejoin:round;stroke-dashoffset:17583.1;paint-order:stroke fill markers"
              x="57.200241"
              y="67.629341"
              id="text1-5-4-2-9-7-0-3-9"
            >
              <tspan
                id="tspan1-9-8-7-98-1-3-9-9"
                style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;-inkscape-font-specification:'Open Sans';text-align:end;text-anchor:end;fill:#f9f9f9;stroke-width:3.7018"
                x="64.509872"
                y="67.629341"
              >
                110
              </tspan>
            </text>
            <path
              style="fill:#ff8080;stroke:#ff5555;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
              d="m 65.305283,66.211859 h 2.1828"
              id="path2-8-8-7-2-9"
            />
            <path
              d="m 71.16638,58.189 h 4.013672 c 1.316065,0.02914 0.72383,1.124062 0.222656,2.861328 L 60.857787,105.79056 c -0.384122,1.25775 -0.739867,1.3785 -1.832032,1.38672 H 55.39099 c -1.069428,0 -0.965869,-0.55183 -0.720703,-1.4668 L 69.254271,60.853063 c 0.501266,-1.49615 0.804215,-2.659508 1.912109,-2.664063 z"
              style="display:inline;fill:none;fill-opacity:1;stroke:#ffffff;stroke-width:0.378;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
              id="path1-7-9"
            />
          </g>
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
                1000
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
                2000
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
                3000
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
                4000
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
                6000
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
                7000
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
                5000
              </tspan>
            </text>
            <path
              style="fill:#f9f9f9;stroke:#f9f9f9;stroke-width:0.378;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
              d="m 57.801644,76.685644 0.546658,2.113238"
              id="path2-8-8-97-8-4-4"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

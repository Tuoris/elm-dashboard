import argparse
import re
import sys

sys.stdin.reconfigure(encoding="utf8", errors="strict")  # or ignore or replace

refsToFind = [
    "revValue",
    "batteryVoltage",
    "powerValue",
    "cellVoltageMaxPath",
    "batteryTempMaxPath",
    "socSpan",
    "batteryVoltageDiffSpan",
    "batteryTempMinPath",
    "batteryTemperatureSpan",
    "coolantTemperature",
    "batteryTemperatureDiffSpan",
    "batteryVoltageSpan",
    "rpmSpan",
    "batteryTemperature",
    "powerSpan",
    "cellVoltageMinPath",
    "throttleSpan",
    "throttleValue",
    "speedSpan",
    "coolantTemperatureSpan",
    "cellVoltageSpan",
    "cellVoltageDiffSpan",
    "heaterTempSpan",
    "batteryInletTempSpan",
    "maxPowerSpan",
    "powerUnit",
]


def main():
    parser = argparse.ArgumentParser(
        prog="Convert dashboard asset SVG to TSX",
        description="Tip: pipe xclip or Set-Clipboard command to copy content to clipboard.",
    )
    parser.add_argument("svg_file")
    options = parser.parse_args()

    svg_file = options.svg_file

    svg_file_content = open(svg_file, encoding="utf-8").read()

    for ref in refsToFind:
        svg_file_content = svg_file_content.replace(
            f'"{ref}"', f'"{ref}" ref={{{ref}}}'
        )

    svg_file_content = re.sub(r'sodipodi\:\w+="[\w\d.]+"', "", svg_file_content)
    svg_file_content = re.sub(r'xmlns:\w+="\S+"', "", svg_file_content)
    svg_file_content = re.sub(r"xml:\w+=\"[^\"]+\"", "", svg_file_content)
    svg_file_content = re.sub(r"<\?xml[^>]+>", "", svg_file_content)
    svg_file_content = re.sub(
        r'<sodipodi:namedview[\n\w\s="#\.:\-]+\/>', "", svg_file_content
    )
    svg_file_content = re.sub(r"inkscape:\w+=\"[^\"]+\"", "", svg_file_content)

    with open("output.tsvg", mode="w", encoding="utf-8") as output_file:
        output_file.write(svg_file_content)


if __name__ == "__main__":
    main()

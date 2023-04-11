function convertAzToPixel(width, az) {
  const valueMax = width - 1;
  const halfWidth = Math.round(valueMax / 2);
  const numberOfPixelPerDegree = valueMax / 360;
  if (az === -180) {
    return 0;
  } else if (az === 180) {
    return valueMax;
  } else if (az === 0) {
    return halfWidth;
  } else if (az < 0) {
    return Math.round(numberOfPixelPerDegree * (180 - Math.abs(az)));
  } else {
    return Math.round(numberOfPixelPerDegree * Math.abs(az) + halfWidth);
  }
}

function convertFToPixel(height, f) {
  return height - 1 - f;
}

function createEcho(value, table, width, index, typeOfEcho) {
  if (value === 255) {
    table[index + width] = value;
    table[index - width] = value;
    table[index + width * 2] = value;
    table[index - width * 2] = value;
    table[index] = value;
    if (index % width === 0) {
      table[index + 1] = value;
    } else if (index % width === width - 1) {
      table[index - 1] = value;
    } else {
      table[index - 1] = value;
      table[index + 1] = value;
    }

    if (typeOfEcho !== 0) {
      table[index + width * 3] = value;
      table[index - width * 3] = value;
      if (index % width === 0) {
        table[index + 2] = value;
        table[index + width + 1] = value;
        table[index - width + 1] = value;
      } else if (index % width === width - 1) {
        table[index - 2] = value;
        table[index + width - 1] = value;
        table[index - width - 1] = value;
      } else {
        table[index - 2] = value;
        table[index + 2] = value;
        table.fill(value, index + width - 1, index + width + 2);
        table.fill(value, index - width - 1, index - width + 2);
      }

      if (typeOfEcho !== 1) {
        table[index + width * 4] = value;
        table[index - width * 4] = value;
        if (index % width === 0) {
          table[index + 3] = value;
          table[index + width + 2] = value;
          table[index - width + 2] = value;
          table[index + width * 2 + 1] = value;
          table[index - width * 2 + 1] = value;
        } else if (index % width === width - 1) {
          table[index - 3] = value;
          table[index + width - 2] = value;
          table[index - width - 2] = value;
          table[index + width * 2 - 1] = value;
          table[index - width * 2 - 1] = value;
        } else {
          table[index - 3] = value;
          table[index + 3] = value;
          table.fill(value, index + width - 2, index + width + 3);
          table.fill(value, index - width - 2, index - width + 3);
          table.fill(value, index + width * 2 - 1, index + width * 2 + 2);
          table.fill(value, index - width * 2 - 1, index - width * 2 + 2);
        }
      }
    }
  }
}

function computeFRAZ(width, height, echos, typeOfEcho = 0) {
  let table = new Uint8Array(width * height);
  for (let i = 0; i <= height; i++) {
    for (let j = 0; j < width; j++) {
      let value = 0;
      for (const [index, echo] of Object.entries(echos)) {
        if (
          i === convertFToPixel(height, echo.f) &&
          j === convertAzToPixel(width, echo.az)
        ) {
          value = 255;
          echos.splice(index, 1);
          break;
        }
      }
      createEcho(value, table, width, width * i + j, typeOfEcho);
    }
  }
  return table;
}

function printFRAZ(width, height, fraz) {
  const tableToPrint = [];
  for (let i = 0; i <= fraz.length; i++) {
    if (fraz[i] === 255) {
      tableToPrint.push('*');
    } else {
      tableToPrint.push(' ');
    }
  }
  let start = 0;
  let end = width;
  for (let i = 0; i < height; i++) {
    console.log(tableToPrint.slice(start, end).join(' '));
    start = end;
    end = end + width;
  }
}

const width = 50;
const height = 100;

const fraz = computeFRAZ(
  width,
  height,
  [
    { az: -50, f: 40 },
    { az: -180, f: 40 },
    { az: 180, f: 40 },
    { az: -180, f: 0 },
    { az: -50, f: 0 },
    { az: 180, f: 0 },
    { az: -180, f: 99 },
    { az: -50, f: 99 },
    { az: 180, f: 99 },
  ],
  2
);
printFRAZ(width, height, fraz);

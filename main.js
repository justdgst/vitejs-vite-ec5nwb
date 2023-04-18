import { generate_table } from './counter.js';

function convertAzToColumn(az) {
  return Math.round((az * (width - 1)) / AZ_MAX);
}

function convertFToLine(f) {
  const invertF = F_MAX - f;
  return Math.round((invertF * (height - 1)) / F_MAX);
}

function convertPToValue(p) {
  return Math.round((p * VALUE_MAX) / P_MAX);
}

function fillFRAZTable(width, height, echos) {
  let table = new Uint8Array(width * height);
  let value = 0;
  for (const echo of echos) {
    const line = convertFToLine(echo.f);
    const column = convertAzToColumn(echo.az);
    const index = line * width + column;
    const pValue = convertPToValue(echo.p);

    const propagationY = (height * echo.p * P_MAX_PERCENTAGE) / (P_MAX * 100);
    const propagationX = (width * echo.p * P_MAX_PERCENTAGE) / (P_MAX * 100);

    const lineMax = -Math.round(propagationY / 2);
    const lineMin = Math.round(propagationY / 2);
    const columnMin = -Math.round(propagationX / 2);
    const columnMax = Math.round(propagationX / 2);

    for (let i = lineMax; i <= lineMin; i++) {
      for (let j = columnMin; j <= columnMax; j++) {
        // Fill the middle column
        table[index + width * i] = pValue - Math.abs(j);
        // Fill the middle line (manage the border)
        if (index + j < width * line) {
          table[index + j + width] = pValue - Math.abs(j);
        } else if (index + j >= width * line + width) {
          table[index + j - width] = pValue - Math.abs(j);
        } else {
          table[index + j] = pValue - Math.abs(j);
        }

        // Fill to get an echo shape (manage the border)
        if (
          (i < Math.round(propagationY / 2) &&
            i > -Math.round(propagationY / 2) &&
            j > -Math.round(propagationX / 6) &&
            j < Math.round(propagationX / 6)) ||
          (i < Math.round(propagationY / 4) &&
            i > -Math.round(propagationY / 4) &&
            j > -Math.round(propagationX / 4) &&
            j < Math.round(propagationX / 4)) ||
          (i < Math.round(propagationY / 6) &&
            i > -Math.round(propagationY / 6) &&
            j > -Math.round(propagationX / 2) &&
            j < Math.round(propagationX / 2))
        ) {
          if (index + j < width * line) {
            table[index + j + width * i + width] = pValue - Math.abs(j);
          } else if (index + j >= width * line + width) {
            table[index + j + width * i - width] = pValue - Math.abs(j);
          } else {
            table[index + j + width * i] = pValue - Math.abs(j);
          }
        }
      }
    }
  }
  return table;
}

function printFRAZ(width, height, fraz) {
  const tableToPrint = [];
  for (let i = 0; i <= fraz.length; i++) {
    if (fraz[i] > 0) {
      tableToPrint.push('*');
    } else if (fraz[i] === 0) {
      tableToPrint.push(' ');
    } else {
      tableToPrint.push('0');
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

const F_MAX = 300;
const AZ_MAX = 360;
const P_MAX = 100;
const P_MAX_PERCENTAGE = 10;
const VALUE_MAX = 255;

const width = 100;
const height = 300;

const fraz = fillFRAZTable(width, height, [
  { az: 180, f: 150, p: 100 },
  //{ az: 190, f: 150, p: 100 },
]);
printFRAZ(width, height, fraz);

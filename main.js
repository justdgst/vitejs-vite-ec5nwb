function convertAzToColumn(az) {
  return Math.round((az * (width - 1)) / AZ_MAX);
}

function convertFToLine(f) {
  const deltaF = F_MAX - F_MIN;
  const invertF = F_MAX - f;
  return Math.round((invertF * (height - 1)) / deltaF);
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
    const middleIndex = line * width + column;
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
        table[middleIndex + width * i] = pValue - Math.abs(i);
        // Fill the middle line (manage the border)
        if (middleIndex + j < width * line) {
          table[middleIndex + j + width] = pValue - Math.abs(j);
        } else if (middleIndex + j >= width * line + width) {
          table[middleIndex + j - width] = pValue - Math.abs(j);
        } else {
          table[middleIndex + j] = pValue - Math.abs(j);
        }

        // Fill to get an echo shape (manage the border)
        if (
          (i < lineMin &&
            i > lineMax &&
            j > -Math.round(propagationX / 6) &&
            j < Math.round(propagationX / 6)) ||
          (i < Math.round(propagationY / 4) &&
            i > -Math.round(propagationY / 4) &&
            j > -Math.round(propagationX / 4) &&
            j < Math.round(propagationX / 4)) ||
          (i < Math.round(propagationY / 6) &&
            i > -Math.round(propagationY / 6) &&
            j > columnMin &&
            j < columnMax)
        ) {
          if (middleIndex + j < width * line) {
            table[middleIndex + j + width * i + width] =
              pValue - Math.abs(j) - Math.abs(i);
          } else if (middleIndex + j >= width * line + width) {
            table[middleIndex + j + width * i - width] =
              pValue - Math.abs(j) - Math.abs(i);
          } else {
            table[middleIndex + j + width * i] =
              pValue - Math.abs(j) - Math.abs(i);
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
    console.log(fraz.slice(start, end).join(' '));
    start = end;
    end = end + width;
  }
}

const F_MAX = 10000;
const F_MIN = 100;
const AZ_MAX = 360;
const P_MAX = 300;
const P_MAX_PERCENTAGE = 10;
const VALUE_MAX = 255;

const width = 200;
const height = 300;

const fraz = fillFRAZTable(width, height, [{ az: 180, f: 300, p: 180 }]);
printFRAZ(width, height, fraz);

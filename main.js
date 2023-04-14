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

//function convertAzaToPixel(width, az) {
//  return (az * (width-1) / AZ_MAX) % width
//}

//function convertFToPixel(height, f) {
//  return f* (height-1) / F_MAX;
//}

//function convertPToValue(p) {
//  return p * VALUE_MAX / PMAX
//}

function convertFToPixel(height, f) {
  return height - 1 - f;
}

function createEcho() {
  //  const propagationX widht * (echo.p * P_MAX_PERCENTAGE / P_MAX)
  //  const propagationY height * (echo.p * P_MAX_PERCENTAGE / P_MAX)
  //  for i = -propagationY /2 jusqu'a propagationY/2 avec ++
  //  for j = -propagationX /2 jusqu'a propagationX/2 avec ++
  //  Calcul value actuel
  //  Set value dans la bonne case
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

function computeFRAZ(width, height, echos, typeOfEcho = 0) {
  let table = new Uint8Array(width * height);
  // echo . for
  //  creaEcho(table, echo)
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
const VALUE_MAX = 255;
const F_MAX = 200;
const AZ_MAX = 360;
const P_MAX = 100;
const P_MAX_PERCENTAGE = 5;

const fraz = computeFRAZ(
  width,
  height,
  [
    { az: -50, f: 40, p: 100 },
    { az: -180, f: 40, p: 100 },
    { az: 180, f: 40, p: 100 },
    { az: -180, f: 0, p: 100 },
    { az: -50, f: 0, p: 100 },
    { az: 180, f: 0, p: 100 },
    { az: -180, f: 99, p: 100 },
    { az: -50, f: 99, p: 100 },
    { az: 180, f: 99, p: 100 },
  ],
  2
);
printFRAZ(width, height, fraz);

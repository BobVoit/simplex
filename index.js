const printSystem = (system, header, column) => {

    console.log(header.join("\t"));

    for (let i = 0; i < system.length; i++) {

        const line = system[i].join("\t");
        console.log(column[i] + "\t" + line);
    }
    if (system[system.length - 1][0] < 0) {
        console.log("F(x) = " + system[system.length - 2][0] + " " + system[system.length - 1][0] + "M");
    }
    else if (system[system.length - 1][0] == 0) {
        console.log("F(x) = " + system[system.length - 2][0]);
    }
    else {
        console.log("F(x) = " + system[system.length - 2][0] + " + " + system[system.length - 1][0] + "M");
    }

}

const rounded = (value) => {
    return Number(value.toFixed(2))
}

const negativeInFirst = (system, column) => {

    //console.log(header.join(" "));

    for (let i = 0; i < column.length - 2; i++) {
        if (system[i][0] < 0) {
            for (let j = 0; j <= system.length; j++)
                system[i][j] = -1 * system[i][j];
        }
    }
    for (let j = 0; j <= system.length; j++) {
        for (let i = 0; i < column.length - 2; i++) {
            system[system.length - 1][j] += system[i][j];
        }
        system[system.length - 1][j] *= -1;
    }

}

const copyMatrix = (matrix) => {
    const newMatrix = [];

    for (let i = 0; i < matrix.length; i++) {
        const newLine = [];
        for (let j = 0; j < matrix[i].length; j++) {
            newLine.push(matrix[i][j]);
        }
        newMatrix.push(newLine);
    }
    return newMatrix;
}

const lastLineHaveNegativeElement = (system, lineLength, columnLength) => {
    const lastLine = system[columnLength - 1];
    const prevLastLine = system[columnLength - 2];

    for (let i = 1; i < lineLength; i++) {
        if (lastLine[i] < 0) {
            return true;
        }
    }

    for (let i = 1; i < lineLength; i++) {
        if (lastLine[i] !== 0) {
            continue;
        }

        if (prevLastLine[i] < 0) {
            return true;
        }
    }

    return false;
}

const prevLastPlusAndPrevLastIsNegative = (system, i, columnLength) => {
    const lastLine = system[columnLength - 1];
    const prevLastLine = system[columnLength - 2];

    if (lastLine[i] < 0) {
        return true;
    }

    if (lastLine[i] === 0 && prevLastLine[i] < 0) {
        return true;
    }

    return false;
}

/*const isHaveBasis = (system, columnLength, indexColumn) => {

    let one = 0;
    let zero = 0;
    let another = 0;

    for (let i = 0; i < columnLength - 2; i++) {
        const currentElement = system[i][indexColumn];
        if (currentElement === 0) {
            zero++;
        } else if (currentElement === 1) {
            one++;
        } else {
            another++;
        }
    }

    return one === 1 && another === 0;
}*/

const simplex = (system, header, column, lineLength, columnLength) => {
    const lastLine = system[columnLength - 1];

    let s = 1;
    let minValue = 0.1;
    for (let i = 1; i < lineLength; i++) {
        // const first = lastLine[i] < minValue;
        //const second = !isHaveBasis(system, columnLength, i)
        // const third = prevLastPlusAndPrevLastIsNegative(system, lineLength, columnLength)
        if (lastLine[i] < minValue && /*!isHaveBasis(system, columnLength, i) &&*/ prevLastPlusAndPrevLastIsNegative(system, i, columnLength)) {
            minValue = lastLine[i];
            s = i;
        }
    }

    let k = 0;
    minValue = Number.MAX_VALUE;
    for (let i = 1; i < columnLength - 2; i++) {
        if (system[i][s] <= 0) {
            continue;
        }

        const value = system[i][0] / system[i][s];
        if (value < minValue) {
            minValue = value;
            k = i;
        }
    }
    changeCoef(k, s, header, column);

    const memory = system[k][s];

    const newSystem = copyMatrix(system);

    for (let i = 0; i < columnLength; i++) {
        for (let j = 0; j < lineLength; j++) {
            newSystem[i][j] = rounded(((system[i][j] * memory) - (system[i][s] * system[k][j]))) / memory;
        }
    }

    for (let i = 0; i < lineLength; i++) {
        if (i === s) {
            continue;
        }
        newSystem[k][i] = rounded(system[k][i] / system[k][s]);
    }

    for (let i = 0; i < columnLength; i++) {
        if (i === k) {
            continue;
        }
        newSystem[i][s] = -rounded((system[i][s] / system[k][s]));
    }

    newSystem[k][s] = rounded(1 / memory);


    return newSystem;
}

const changeCoef = (k, s, header, column) => {
    const elementHeader = header[s + 1];
    const elementColumn = column[k];
    const newElementColumn = elementHeader.replace("-", " ");
    const newElementHeader = elementColumn.replace(" ", "-");

    header[s + 1] = newElementHeader;
    column[k] =
        newElementColumn;
}

const printLongLine = () => {
    console.log("----------------------------------------------------------------------------------------------------");
}

let system = [
    [1, -1, -1, 1, 0, 0, 0, 0],
    [1, -1, 2, 0, 1, 0, 0, 0],
    [2, -2, -3, 0, 0, 1, 0, 0],
    [3, -3, 2, 0, 0, 0, 1, 0],
    [-1, 2, 2, 0, 0, 0, 0, 1],
    [0, -1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

/*let system = [
    [3, 1, -4, 2, -5, 9],
    [6, 0, 1, -3, 4, -5],
    [1, 0, 1, -1, 1, -1],
    [-6, 2, 14, -9, 11, -14],
    [0, 0, 0, 0, 0, 0, 0, 0]
];*/

const lineLength = 8;
const columnLength = 7;

const header = [];
for (let i = 0; i <= lineLength; i++) {
    if (i === 0) {
        header.push("  ");
    } else if (i === 1) {
        header.push("b");
    } else {
        header.push(`x${i - 1}`);
    }
}

const column = [];
for (let i = lineLength; i <= columnLength + lineLength-3; i++) {
    column.push(`x${i}`);
}
column.push(" f");
column.push(" g");

//const header = [" ", " b", "-x1", "-x2", "-x3", "-x4", "-x5", "-x6", "-x7"];
//const column = [" x3", " x4", " x5", " x6", " x7", " f", " g"];

// const header = [];
// for (let i = 0; i <= lineLength; i++) {
// if (i === 0) {
// header.push(" ");
// } else if (i === 1) {
// header.push(" b");
// } else {
// header.push(` x${i - 1}`);
// }
// }

// const column = [];
// for (let i = 0; i < columnLength - 2; i++) {
// column.push(` x${lineLength + i}`);
// }
// column.push(" f");
// column.push(" g");

negativeInFirst(system, column);
printSystem(system, header, column);
printLongLine();

while (lastLineHaveNegativeElement(system, lineLength, columnLength)) {
    system = simplex(system, header, column, lineLength, columnLength);
    printSystem(system, header, column);
    printLongLine();
}
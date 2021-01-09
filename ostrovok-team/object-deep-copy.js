// Реализовать функцию, создающую глубокую копию (deep copy) объекта без использования JSON.stringify

function deepCopy(obj) {
    console.log(obj);
    const newObject = {};

    const keys = Object.getOwnPropertyNames(obj);

    console.log(keys);
    keys.forEach(key => {
        const value = obj[key];

        if (typeof value !== 'object' || typeof value === 'object') {
            newObject[key] = value;
        } else {
            if (Array.isArray(value)) newObject[key] = deepCopyArray(value);
            else newObject[key] = deepCopy(value);
        }
    });

    return newObject;
}

function deepCopyArray(arr) {
    console.log('inside deepcopyarr');
    return arr.map(element => {
        if (Array.isArray(element)) return deepCopyArray(element);
        else if (element && typeof element === 'object') return deepCopy(element);
        else return element;
    })
}

const source = {
    a: 1,
    b: '2',
    c: {
        aa: 1,
        bb: '2',
        cc: {
            aaa: 1,
            bbb: '2',
            ccc: {},
        }
    },
    d: [1, '2', null, undefined, {}, {a: 1, b: '2', c: {}, d: [11, '22']}]
}

const copy = deepCopy(source);

console.log(copy);

console.log(source.c === copy.c);
console.log(source.c.cc === copy.c.cc);
console.log(source.d === copy.d);
console.log(source.d[5].c === copy.d[5].c);

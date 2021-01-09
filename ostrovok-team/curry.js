/*
    Implement the curry function to make the following code work:

    function abc(a, b, c) {
      return a + b + c;
    }

    function abcdef(a, b, c, d, e, f) {
      return a + b + c + d + e + f;
    }

    abc.curry('A')('B')('C'); // 'ABC'
    abc.curry('A', 'B')('C'); // 'ABC'
    abc.curry('A', 'B', 'C'); // 'ABC'

    abcdef.curry('A')('B')('C')('D')('E')('F'); // 'ABCDEF'
    abcdef.curry('A', 'B', 'C')('D', 'E', 'F'); // 'ABCDEF'
*/

function abc(a, b, c) {
    return a + b + c;
}

function abcdef(a, b, c, d, e, f) {
    return a + b + c + d + e + f;
}

function curry(...args) {
    let result = [...args];

    function nextF(...args) {
        result.push(...args);

        return nextF;
    }

    nextF.toString = () => {
        return result.join('');
    };

    return nextF;
}

abc.curry = curry;
abcdef.curry = curry;

console.log(abc.curry('A')('B')('C')); // 'ABC'
console.log(abc.curry('A', 'B')('C')); // 'ABC'
console.log(abc.curry('A', 'B', 'C')); // 'ABC'

console.log(abcdef.curry('A')('B')('C')('D')('E')('F')); // 'ABCDEF'
console.log(abcdef.curry('A', 'B', 'C')('D', 'E', 'F')); // 'ABCDEF'

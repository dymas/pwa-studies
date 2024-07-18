function trace() {
  const err = new Error();
  console.log('All functions called before error: ', err.stack);
}

function functionA() {
  functionB();
}

function functionB() {
  trace();
}

functionA();

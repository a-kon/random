(function() {
    function rnd() {
        let rand = 5 + Math.random() * (100 - 5 + 1);
        return Math.round(rand);
    }

    function handleItem(item) {
        // sleep(20);
        sleep(rnd()); // таск "выполняется" рандомное кол-во времени от 5 до 100мс
        return item;
    }

    function sleep(ms) {
      const started = +new Date();

      while (+new Date() < started + ms) {};
    }

    const ONE_LOOP = 16.6 // 1s/60 frames per second
    let PERIOD = ONE_LOOP * 3 // 1s/60 frames per second by default. Количество времени, за которое мы должны исполнить не более 1 таска.
    let AVG_PROCESS_TIME = 20; // average processing time, 20 sec by default
    const ticks = [];

    const heap = [];
    const items = Array.from({length: 300}, (_, i) => i + 1);

    items.forEach(item => heap.push(item));

    function recalcAVG(execTime) {
        ticks.push(execTime);
        if (ticks.length > 100) ticks.shift();

        AVG_PROCESS_TIME = ticks.length > 10
            ? ticks.reduce((summ, el) => summ + el) / ticks.length
            : AVG_PROCESS_TIME;

        console.log(`AVG_PROCESS_TIME = ${AVG_PROCESS_TIME}`);

        // если таск выполняется больше половины всего времени, то нужно сделать вызовы реже
        if (AVG_PROCESS_TIME > PERIOD / 2) {
            PERIOD = Math.round(AVG_PROCESS_TIME * 2);
            console.log(`   EXECUTION IS TOO SLOW, SET NEW PERIOD ${PERIOD}`);
        } else if (PERIOD / 2.5 > AVG_PROCESS_TIME) {
            PERIOD = Math.round(AVG_PROCESS_TIME * 2);
            console.log(`   EXECUTION IS QUITE FAST, SET NEW PERIOD ${PERIOD}`);
        }

    }

    async function loop() {
        function createTask() {
            if (Math.random() > 0.5) {
                console.log('Wow a new task!');
                heap.push(Math.random());
            }

            process();
        }

        async function process() {
            const item = heap.shift();

            new Promise((res) => {
                if (!item) {
                    console.log('NO ITEMS IN HEAP, WAIT FOR IT\n');

                    return setTimeout(createTask, 5 * 1000); // 5s
                }

                const start = Date.now();

                handleItem(item);

                const stop = Date.now();
                const execTime = stop - start;

                recalcAVG(execTime);

                res();

                const nextCallIn = Math.round(execTime > PERIOD
                    ? ONE_LOOP // если время выполнения было дольше 3 лупов, то даем браузеру передышку на остальные таски
                    : PERIOD - execTime) // иначе ждем остаток времени

                console.log(`Done in ${execTime}, next call in ${nextCallIn}\n`);

                setTimeout(process, nextCallIn);
            })
        }

        process();
    }

    loop();
})()

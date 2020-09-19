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
    const items = new Array(300).fill(null).map((_, i) => i);

    items.forEach(item => heap.push(item));


    async function loop() {
        async function process() {
            const item = heap.shift();

            new Promise((res) => {
                const start = Date.now();

                handleItem(item);

                const stop = Date.now();
                const execTime = stop - start;

                // AVG_PROCESS_TIME = (AVG_PROCESS_TIME + execTime) / 2;
                ticks.push(execTime);
                if (ticks.length > 100) ticks.shift();
                AVG_PROCESS_TIME = ticks.reduce((summ, el) => summ + el) / ticks.length;
                console.log(`AVG_PROCESS_TIME = ${AVG_PROCESS_TIME}`);

                // если таск выполняется больше половины всего времени, то нужно сделать вызовы реже
                if (AVG_PROCESS_TIME > PERIOD / 2) {
                    PERIOD = AVG_PROCESS_TIME * 2;
                    console.log(`   EXECUTION IS TOO SLOW, SET NEW PERIOD ${PERIOD}`);
                } else if (PERIOD / 2.5 > AVG_PROCESS_TIME) {
                    PERIOD = AVG_PROCESS_TIME * 2;
                    console.log(`   EXECUTION IS QUITE FAST, SET NEW PERIOD ${PERIOD}`);
                }

                res();

                const nextCallIn = Math.round(execTime > PERIOD
                    ? ONE_LOOP // если время выполнения было дольше 3 лупов, то даем браузеру передышку на остальные таски
                    : AVG_PROCESS_TIME) // иначе ждем остаток времени

                console.log(`Done in ${execTime}, next call in ${nextCallIn}`);

                setTimeout(process, nextCallIn);
            })
        }

        process();
    }

    loop();
})()

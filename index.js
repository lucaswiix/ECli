const jobs = {
    input: require('./jobs/input.js'),
}

async function start(){
    jobs.input()
}

start()
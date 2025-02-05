process.on('message', message => {
    let result = 0;
    for (let i=0; i <= 2e9; i++){
        result++
    }

    process.send(result)
})  
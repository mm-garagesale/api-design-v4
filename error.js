process.on('uncaughtException', err => {
    console.log('Uncaught exception:', err.message)
})

process.on('unhandledRejection', err => {
    console.log('Unhandled rejection:', err.message)
})

setTimeout(() => {
    throw new Error('oops')
}, 300)

Promise.reject(new Error('fail'));
